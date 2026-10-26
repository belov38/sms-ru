# sms-ru

Библиотека для отправки SMS через сервис [sms.ru](https://sms.ru) с использованием нативного Node.js fetch API.

## Требования

- Node.js >= 22

## Установка

```bash
npm install @belov.ai/sms-ru
```

## Использование

### В коде

```typescript
import { SMSRuClient, SMSError, SMSCostLimitError } from '@belov.ai/sms-ru';

// Создаем клиент с API ключом (таймаут запроса по умолчанию 30 секунд)
const client = new SMSRuClient('your-api-key', { timeoutMs: 30000 });

try {
  // Отправка нескольким получателям (до 100 номеров за запрос)
  const result = await client.sendSMS({
    phones: ['79001234567', '79007654321'],
    message: 'Hello World',
    options: {
      test: true, // Тестовый режим
      from: 'Company', // Имя отправителя
      translit: true, // Транслитерация
      limit: 10, // Максимальная стоимость в рублях
    },
  });

  // Если отклонена только часть номеров, исключения нет
  for (const [phone, info] of Object.entries(result.sms)) {
    if (info.status === 'OK') {
      console.log(`${phone}: отправлено, id ${info.sms_id}`);
    } else {
      console.error(`${phone}: ошибка ${info.status_code} ${info.status_text}`);
    }
  }
  console.log('Balance:', result.balance);
} catch (error) {
  if (error instanceof SMSCostLimitError) {
    console.error(`Стоимость ${error.cost} больше лимита ${error.limit}`);
  } else if (error instanceof SMSError) {
    // statusCode есть только у ошибок, которые вернул SMS.RU
    console.error('SMS Error:', error.message, error.statusCode);
  }
}
```

Альтернативный способ через переменную окружения `SMSRU_API_ID`:

```typescript
import { sendSMS } from '@belov.ai/sms-ru';

const result = await sendSMS({
  phones: '79001234567',
  message: 'Hello World',
});
```

### Через CLI

```bash
# Установите переменную окружения с вашим API ключом
export SMSRU_API_ID=your-api-key

# Отправка SMS
npx @belov.ai/sms-ru 79001234567 "Hello World"

# Тестовый режим (без реальной отправки)
npx @belov.ai/sms-ru 79001234567 "Test message" --test

# С указанием отправителя
npx @belov.ai/sms-ru 79001234567 "Hello" --from "Company"

# С транслитерацией
npx @belov.ai/sms-ru 79001234567 "Привет мир" --translit

# Несколько номеров через запятую
npx @belov.ai/sms-ru 79001234567,79007654321 "Hello"
```

Неизвестные флаги отклоняются (код выхода 2). Если хотя бы один номер не принят, код выхода 1.

## API

### new SMSRuClient(apiId, options?)

Создает новый экземпляр клиента для работы с SMS.RU API.

#### Параметры

- `apiId`: string - Ваш API ключ от sms.ru
- `options.timeoutMs`: number - Таймаут запроса в миллисекундах (по умолчанию 30000)

### client.sendSMS(params)

Основная функция для отправки SMS.

#### Параметры

- `phones`: string | string[] - Номер телефона или массив номеров (до 100)
- `message`: string - Текст сообщения
- `options`: object (опционально)
  - `from`: string - Имя отправителя
  - `time`: number - Unix timestamp для отложенной отправки
  - `ttl`: number - Срок жизни сообщения в минутах (1-1440)
  - `daytime`: boolean - Не отправлять ночью: переносит отправку на 10:00 по времени получателя
  - `ip`: string - IP адрес вашего пользователя для защиты от накрутки
  - `translit`: boolean - Переводить ли сообщение в транслит
  - `test`: boolean - Тестовый режим
  - `partner_id`: string - ID партнера
  - `limit`: number - Максимальная стоимость в рублях

#### Возвращает

Promise<SMSResponse> - Результат отправки. Если отклонена только часть номеров, исключения нет: статус каждого номера в `result.sms[phone]`. Если не принят ни один номер, бросается `SMSError` с кодом первого отклонённого номера.

#### Ошибки

- `SMSError` - любая ошибка запроса: ответ SMS.RU со `status: "ERROR"` или ни один номер не принят (код в `statusCode`, ответ в `response`), сетевая ошибка или таймаут (`cause`), не-JSON ответ, неверные входные данные.
- `SMSCostLimitError` (наследник `SMSError`) - предварительная стоимость больше `limit`, отправка не выполнялась.

Таймаут не гарантирует, что сообщение не было отправлено: перед повторной отправкой проверьте статус.

### Вспомогательные функции

- `getStatusDescription(code)`: Получает описание статуса по коду
- `getStatusCategory(code)`: Получает категорию статуса
- `isSuccessStatus(code)`: Проверяет, является ли статус успешным
- `isProcessingStatus(code)`: Проверяет, находится ли сообщение в обработке
- `isErrorStatus(code)`: Проверяет, является ли статус ошибочным
- `getCodeByCategory(category)`: Получает все коды для указанной категории
- `isValidCode(code)`: Проверяет валидность кода статуса

## Лицензия

MIT
