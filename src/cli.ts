#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { sendSMS, SMSError } from './index.js';

const USAGE = `Usage: sms-ru [options] <phone>[,<phone>...] <message>

Options:
  --test             Simulate sending (no SMS is sent, balance is not charged)
  --from <sender>    Sender name approved in SMS.RU
  --translit         Transliterate Cyrillic to Latin
  -h, --help         Show this help

The API key is read from the SMSRU_API_ID environment variable.`;

function parseCli() {
  try {
    return parseArgs({
      allowPositionals: true,
      strict: true,
      options: {
        test: { type: 'boolean' },
        translit: { type: 'boolean' },
        from: { type: 'string' },
        help: { type: 'boolean', short: 'h' },
      },
    });
  } catch (error) {
    console.error(`Error: ${(error as Error).message}\n\n${USAGE}`);
    process.exit(2);
  }
}

async function main() {
  const { values, positionals } = parseCli();

  if (values.help) {
    console.log(USAGE);
    return;
  }

  if (positionals.length !== 2) {
    console.error(USAGE);
    process.exit(2);
  }

  const [phone, message] = positionals;

  try {
    const result = await sendSMS({
      phones: phone.split(',').map((p) => p.trim()).filter(Boolean),
      message,
      options: {
        test: values.test,
        translit: values.translit,
        from: values.from,
      },
    });

    let failed = 0;
    for (const [number, info] of Object.entries(result.sms)) {
      if (info.status === 'OK') {
        console.log(`${number}: ${values.test ? 'test OK' : 'sent'}, id ${info.sms_id}`);
      } else {
        failed++;
        console.error(`${number}: failed, ${info.status_code} ${info.status_text ?? ''}`.trim());
      }
    }
    if (result.balance !== undefined) {
      console.log(`Balance: ${result.balance} RUB`);
    }
    if (failed > 0) process.exit(1);
  } catch (error) {
    if (error instanceof SMSError) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
    throw error;
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
