# sms-ru

Библиотека для отправки SMS через сервис [sms.ru](https://sms.ru) с использованием нативного Node.js fetch API.

## Требования

- Node.js >= 18.0.0

## Установка

```bash
npm install @belov.ai/sms-ru
```

## Использование

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
```

### В коде

```typescript
import { sendSMS } from '@belov.ai/sms-ru';

// Простая отправка
const result = await sendSMS({
  phones: '79001234567',
  message: 'Hello World'
});

// Отправка нескольким получателям
const result = await sendSMS({
  phones: ['79001234567', '79007654321'],
  message: 'Hello World',
  options: {
    test: true, // Тестовый режим
    from: 'Company', // Имя отправителя
    translit: true, // Транслитерация
    limit: 10 // Максимальная стоимость в рублях
  }
});

// Обработка ошибок
try {
  const result = await sendSMS({
    phones: '79001234567',
    message: 'Hello World'
  });
  console.log('Balance:', result.balance);
} catch (error) {
  if (error instanceof SMSError) {
    console.error('SMS Error:', error.message);
    console.error('Status Code:', error.statusCode);
  }
}
```

## API

### sendSMS(params)

Основная функция для отправки SMS.

#### Параметры

- `phones`: string | string[] - Номер телефона или массив номеров
- `message`: string - Текст сообщения
- `options`: object (опционально)
  - `from`: string - Имя отправителя
  - `time`: number - Unix timestamp для отложенной отправки
  - `translit`: boolean - Переводить ли сообщение в транслит
  - `test`: boolean - Тестовый режим
  - `partner_id`: string - ID партнера
  - `limit`: number - Максимальная стоимость в рублях

#### Возвращает

Promise<SMSResponse> - Результат отправки

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
