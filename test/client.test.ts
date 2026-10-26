import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  SMSRuClient,
  SMSError,
  SMSCostLimitError,
  SMSRuStatusCode,
} from '../src/index.js';

type Call = { url: string; method?: string; body: URLSearchParams };

const realFetch = globalThis.fetch;
let calls: Call[];
let replies: Array<() => Response>;

beforeEach(() => {
  calls = [];
  replies = [];
  globalThis.fetch = (async (url: string, init?: RequestInit) => {
    calls.push({
      url,
      method: init?.method,
      body: new URLSearchParams(init?.body as URLSearchParams),
    });
    const reply = replies.shift();
    if (!reply) throw new Error('unexpected fetch');
    return reply();
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = realFetch;
});

const json = (data: unknown) => () => new Response(JSON.stringify(data));

test('sends several phones as one comma-separated "to" in POST body', async () => {
  replies.push(
    json({
      status: 'OK',
      status_code: 100,
      sms: {
        '79001234567': { status: 'OK', status_code: 100, sms_id: '1' },
        '79007654321': { status: 'OK', status_code: 100, sms_id: '2' },
      },
      balance: 10,
    }),
  );
  const client = new SMSRuClient('secret');
  await client.sendSMS({
    phones: ['79001234567', '79007654321'],
    message: 'Привет +1',
    options: { test: true, ttl: 60, daytime: true },
  });

  assert.equal(calls.length, 1);
  const [call] = calls;
  assert.equal(call.url, 'https://sms.ru/sms/send');
  assert.equal(call.method, 'POST');
  assert.equal(call.body.getAll('to').length, 1);
  assert.equal(call.body.get('to'), '79001234567,79007654321');
  assert.equal(call.body.get('msg'), 'Привет +1');
  assert.equal(call.body.get('api_id'), 'secret');
  assert.equal(call.body.get('test'), '1');
  assert.equal(call.body.get('ttl'), '60');
  assert.equal(call.body.get('daytime'), '1');
});

test('returns response when only some phones fail', async () => {
  replies.push(
    json({
      status: 'OK',
      status_code: 100,
      sms: {
        '79001234567': { status: 'OK', status_code: 100, sms_id: '1' },
        '7900': { status: 'ERROR', status_code: 202, status_text: 'bad phone' },
      },
    }),
  );
  const result = await new SMSRuClient('k').sendSMS({
    phones: ['79001234567', '7900'],
    message: 'hi',
  });
  assert.equal(result.sms['7900'].status, 'ERROR');
  assert.equal(result.sms['79001234567'].sms_id, '1');
});

test('throws SMSError with API code and text on request error', async () => {
  replies.push(json({ status: 'ERROR', status_code: 200, status_text: 'Неправильный api_id' }));
  await assert.rejects(
    new SMSRuClient('bad').sendSMS({ phones: '79001234567', message: 'hi' }),
    (error: unknown) =>
      error instanceof SMSError &&
      error.statusCode === SMSRuStatusCode.INVALID_API_ID &&
      error.message.includes('Неправильный api_id'),
  );
});

test('wraps non-JSON and network errors in SMSError', async () => {
  replies.push(() => new Response('<html>maintenance</html>'));
  await assert.rejects(
    new SMSRuClient('k').sendSMS({ phones: '79001234567', message: 'hi' }),
    (error: unknown) => error instanceof SMSError && error.statusCode === undefined,
  );

  replies.push(() => {
    throw new TypeError('fetch failed');
  });
  await assert.rejects(
    new SMSRuClient('k').sendSMS({ phones: '79001234567', message: 'hi' }),
    (error: unknown) => error instanceof SMSError && error.cause instanceof TypeError,
  );

  replies.push(() => new Response('oops', { status: 502 }));
  await assert.rejects(
    new SMSRuClient('k').sendSMS({ phones: '79001234567', message: 'hi' }),
    /HTTP error 502/,
  );
});

test('cost check uses POST body with translit and stops over limit', async () => {
  replies.push(
    json({ status: 'OK', status_code: 100, sms: {}, total_cost: 5, total_sms: 2 }),
  );
  await assert.rejects(
    new SMSRuClient('secret').sendSMS({
      phones: '79001234567',
      message: 'Привет',
      options: { limit: 1, translit: true, from: 'Shop' },
    }),
    (error: unknown) => error instanceof SMSCostLimitError && error.cost === 5,
  );
  assert.equal(calls.length, 1);
  const [call] = calls;
  assert.equal(call.url, 'https://sms.ru/sms/cost');
  assert.equal(call.body.get('api_id'), 'secret');
  assert.equal(call.body.get('translit'), '1');
  assert.equal(call.body.get('from'), 'Shop');
});

test('rejects invalid input without calling the API', async () => {
  const client = new SMSRuClient('k');
  const phones = Array.from({ length: 101 }, (_, i) => `7900000${i}`);
  await assert.rejects(client.sendSMS({ phones, message: 'hi' }), SMSError);
  await assert.rejects(client.sendSMS({ phones: [], message: 'hi' }), SMSError);
  await assert.rejects(client.sendSMS({ phones: '79001234567', message: ' ' }), SMSError);
  assert.equal(calls.length, 0);
});
