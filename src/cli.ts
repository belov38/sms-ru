#!/usr/bin/env node

import { sendSMS, SMSError, isSuccessStatus } from './index.js';

async function main() {
  const [,, phone, message, ...args] = process.argv;

  if (!phone || !message) {
    console.error('Usage: npx sms-ru <phone> <message> [--test] [--from <sender>] [--translit]');
    process.exit(1);
  }

  const options = {
    test: args.includes('--test'),
    translit: args.includes('--translit'),
    from: args.includes('--from') ? args[args.indexOf('--from') + 1] : undefined,
  };

  try {
    const result = await sendSMS({
      phones: phone,
      message,
      options,
    });

    if (isSuccessStatus(result.status_code)) {
      console.log('SMS sent successfully!');
      if (result.balance !== undefined) {
        console.log(`Balance: ${result.balance} RUB`);
      }
    }
  } catch (error) {
    if (error instanceof SMSError) {
      console.error('Error sending SMS:', error.message);
      process.exit(1);
    }
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 