/**
 * @module sms-library
 */

// Типы категорий статусов
export type StatusCategory =
  | 'success'
  | 'processing'
  | 'delivery_failed'
  | 'validation_error'
  | 'auth_error'
  | 'limit_error'
  | 'server_error'
  | 'callback_error';

// Интерфейс для описания деталей кода состояния
export interface StatusCodeDetails {
  description: string;
  category: StatusCategory;
}

// Enum для кодов состояния
export enum SMSRuStatusCode {
  MESSAGE_NOT_FOUND = -1,
  REQUEST_COMPLETED = 100,
  SENDING_TO_OPERATOR = 101,
  MESSAGE_SENT = 102,
  MESSAGE_DELIVERED = 103,
  EXPIRED = 104,
  DELETED_BY_OPERATOR = 105,
  PHONE_FAILURE = 106,
  UNKNOWN_DELIVERY_ERROR = 107,
  REJECTED = 108,
  MESSAGE_READ = 110,
  NO_ROUTE_FOUND = 150,
  INVALID_API_ID = 200,
  INSUFFICIENT_FUNDS = 201,
  INVALID_PHONE = 202,
  NO_MESSAGE_TEXT = 203,
  OPERATOR_NOT_CONNECTED = 204,
  MESSAGE_TOO_LONG = 205,
  DAILY_LIMIT_EXCEEDED = 206,
  NO_ROUTE_TO_PHONE = 207,
  INVALID_TIME = 208,
  NUMBER_IN_STOP_LIST = 209,
  INVALID_HTTP_METHOD = 210,
  METHOD_NOT_FOUND = 211,
  INVALID_ENCODING = 212,
  TOO_MANY_RECIPIENTS = 213,
  FOREIGN_NUMBER = 214,
  NUMBER_IN_SPAM_LIST = 215,
  FORBIDDEN_MESSAGE = 216,
  CREDIT_AD_WITHOUT_DISCLAIMER = 217,
  SERVICE_TEMPORARY_UNAVAILABLE = 220,
  SENDER_NAME_REQUIRED = 221,
  TEMPLATE_MISMATCH = 222,
  DAILY_MESSAGE_LIMIT = 230,
  DUPLICATE_MESSAGE_PER_MINUTE = 231,
  DUPLICATE_MESSAGE_PER_DAY = 232,
  TOO_MANY_CODE_ATTEMPTS = 233,
  INVALID_TOKEN = 300,
  INVALID_CREDENTIALS = 301,
  ACCOUNT_NOT_CONFIRMED = 302,
  INVALID_CONFIRMATION_CODE = 303,
  TOO_MANY_CODES_SENT = 304,
  TOO_MANY_CODE_ATTEMPTS_RETRY = 305,
  SERVER_ERROR = 500,
  TOR_IP_LIMIT = 501,
  COUNTRY_IP_MISMATCH = 502,
  COUNTRY_MESSAGE_LIMIT = 503,
  FOREIGN_AUTH_LIMIT = 504,
  IP_MESSAGE_LIMIT = 505,
  HOSTING_IP_LIMIT = 506,
  INVALID_IP = 507,
  CALLS_LIMIT_EXCEEDED = 508,
  AUTH_CODE_LIMIT = 509,
  COUNTRY_BLOCKED = 550,
  INVALID_CALLBACK_URL = 901,
  CALLBACK_HANDLER_NOT_FOUND = 902,
}

const statusCodeDetails: Record<SMSRuStatusCode, StatusCodeDetails> = {
  [SMSRuStatusCode.MESSAGE_NOT_FOUND]: {
    description: 'Сообщение не найдено',
    category: 'validation_error',
  },
  [SMSRuStatusCode.REQUEST_COMPLETED]: {
    description: 'Запрос выполнен или сообщение находится в нашей очереди',
    category: 'success',
  },
  [SMSRuStatusCode.SENDING_TO_OPERATOR]: {
    description: 'Сообщение передается оператору',
    category: 'processing',
  },
  [SMSRuStatusCode.MESSAGE_SENT]: {
    description: 'Сообщение отправлено (в пути)',
    category: 'processing',
  },
  [SMSRuStatusCode.MESSAGE_DELIVERED]: {
    description: 'Сообщение доставлено',
    category: 'success',
  },
  [SMSRuStatusCode.EXPIRED]: {
    description: 'Не может быть доставлено: время жизни истекло',
    category: 'delivery_failed',
  },
  [SMSRuStatusCode.DELETED_BY_OPERATOR]: {
    description: 'Не может быть доставлено: удалено оператором',
    category: 'delivery_failed',
  },
  [SMSRuStatusCode.PHONE_FAILURE]: {
    description: 'Не может быть доставлено: сбой в телефоне',
    category: 'delivery_failed',
  },
  [SMSRuStatusCode.UNKNOWN_DELIVERY_ERROR]: {
    description: 'Не может быть доставлено: неизвестная причина',
    category: 'delivery_failed',
  },
  [SMSRuStatusCode.REJECTED]: {
    description: 'Не может быть доставлено: отклонено',
    category: 'delivery_failed',
  },
  [SMSRuStatusCode.MESSAGE_READ]: {
    description: 'Сообщение прочитано (для Viber, временно не работает)',
    category: 'success',
  },
  [SMSRuStatusCode.NO_ROUTE_FOUND]: {
    description: 'Не может быть доставлено: не найден маршрут на данный номер',
    category: 'delivery_failed',
  },
  [SMSRuStatusCode.INVALID_API_ID]: {
    description: 'Неправильный api_id',
    category: 'auth_error',
  },
  [SMSRuStatusCode.INSUFFICIENT_FUNDS]: {
    description: 'Не хватает средств на лицевом счету',
    category: 'validation_error',
  },
  [SMSRuStatusCode.INVALID_PHONE]: {
    description:
      'Неправильно указан номер телефона получателя, либо на него нет маршрута',
    category: 'validation_error',
  },
  [SMSRuStatusCode.NO_MESSAGE_TEXT]: {
    description: 'Нет текста сообщения',
    category: 'validation_error',
  },
  [SMSRuStatusCode.OPERATOR_NOT_CONNECTED]: {
    description: 'Вы не подключили данного оператора',
    category: 'validation_error',
  },
  [SMSRuStatusCode.MESSAGE_TOO_LONG]: {
    description: 'Сообщение слишком длинное (превышает 8 СМС)',
    category: 'validation_error',
  },
  [SMSRuStatusCode.DAILY_LIMIT_EXCEEDED]: {
    description:
      'Будет превышен или уже превышен дневной лимит на отправку сообщений',
    category: 'limit_error',
  },
  [SMSRuStatusCode.NO_ROUTE_TO_PHONE]: {
    description: 'На этот номер нет маршрута для доставки сообщений',
    category: 'validation_error',
  },
  [SMSRuStatusCode.INVALID_TIME]: {
    description: 'Параметр time указан неправильно',
    category: 'validation_error',
  },
  [SMSRuStatusCode.NUMBER_IN_STOP_LIST]: {
    description: 'Вы добавили этот номер (или один из номеров) в стоп-лист',
    category: 'validation_error',
  },
  [SMSRuStatusCode.INVALID_HTTP_METHOD]: {
    description: 'Используется GET, где необходимо использовать POST',
    category: 'validation_error',
  },
  [SMSRuStatusCode.METHOD_NOT_FOUND]: {
    description: 'Метод не найден',
    category: 'validation_error',
  },
  [SMSRuStatusCode.INVALID_ENCODING]: {
    description: 'Текст сообщения необходимо передать в кодировке UTF-8',
    category: 'validation_error',
  },
  [SMSRuStatusCode.TOO_MANY_RECIPIENTS]: {
    description: 'Указано более 5000 номеров в списке получателей',
    category: 'validation_error',
  },
  [SMSRuStatusCode.FOREIGN_NUMBER]: {
    description:
      'Номер находится зарубежом (включена настройка "Отправлять только на номера РФ")',
    category: 'validation_error',
  },
  [SMSRuStatusCode.NUMBER_IN_SPAM_LIST]: {
    description:
      'Этот номер находится в стоп-листе SMS.RU (от получателя поступала жалоба на спам)',
    category: 'validation_error',
  },
  [SMSRuStatusCode.FORBIDDEN_MESSAGE]: {
    description: 'В тексте сообщения содержится запрещенное слово',
    category: 'validation_error',
  },
  [SMSRuStatusCode.CREDIT_AD_WITHOUT_DISCLAIMER]: {
    description:
      'В тексте сообщения содержится реклама кредита, но нет фразы "Оцените свои финансовые возможности и риски"',
    category: 'validation_error',
  },
  [SMSRuStatusCode.SERVICE_TEMPORARY_UNAVAILABLE]: {
    description: 'Сервис временно недоступен, попробуйте чуть позже',
    category: 'server_error',
  },
  [SMSRuStatusCode.SENDER_NAME_REQUIRED]: {
    description:
      'Необходимо создать буквенного отправителя, соответствующего вашему сайту, названию юр. лица или товарному знаку',
    category: 'validation_error',
  },
  [SMSRuStatusCode.TEMPLATE_MISMATCH]: {
    description:
      'Включена опция "отправлять только шаблонированные сообщения", но сообщение не соответствует ни одному одобренному шаблону',
    category: 'validation_error',
  },
  [SMSRuStatusCode.DAILY_MESSAGE_LIMIT]: {
    description:
      'Превышен общий лимит количества сообщений на этот номер в день',
    category: 'limit_error',
  },
  [SMSRuStatusCode.DUPLICATE_MESSAGE_PER_MINUTE]: {
    description: 'Превышен лимит одинаковых сообщений на этот номер в минуту',
    category: 'limit_error',
  },
  [SMSRuStatusCode.DUPLICATE_MESSAGE_PER_DAY]: {
    description: 'Превышен лимит одинаковых сообщений на этот номер в день',
    category: 'limit_error',
  },
  [SMSRuStatusCode.TOO_MANY_CODE_ATTEMPTS]: {
    description:
      'Превышен лимит отправки повторных сообщений с кодом на этот номер за короткий промежуток времени',
    category: 'limit_error',
  },
  [SMSRuStatusCode.INVALID_TOKEN]: {
    description:
      'Неправильный token (возможно истек срок действия, либо ваш IP изменился)',
    category: 'auth_error',
  },
  [SMSRuStatusCode.INVALID_CREDENTIALS]: {
    description: 'Неправильный api_id, либо логин/пароль',
    category: 'auth_error',
  },
  [SMSRuStatusCode.ACCOUNT_NOT_CONFIRMED]: {
    description: 'Пользователь авторизован, но аккаунт не подтвержден',
    category: 'auth_error',
  },
  [SMSRuStatusCode.INVALID_CONFIRMATION_CODE]: {
    description: 'Код подтверждения неверен',
    category: 'auth_error',
  },
  [SMSRuStatusCode.TOO_MANY_CODES_SENT]: {
    description:
      'Отправлено слишком много кодов подтверждения. Пожалуйста, повторите запрос позднее',
    category: 'limit_error',
  },
  [SMSRuStatusCode.TOO_MANY_CODE_ATTEMPTS_RETRY]: {
    description:
      'Слишком много неверных вводов кода, повторите попытку позднее',
    category: 'limit_error',
  },
  [SMSRuStatusCode.SERVER_ERROR]: {
    description: 'Ошибка на сервере. Повторите запрос',
    category: 'server_error',
  },
  [SMSRuStatusCode.TOR_IP_LIMIT]: {
    description: 'Превышен лимит: IP пользователя из сети TOR',
    category: 'limit_error',
  },
  [SMSRuStatusCode.COUNTRY_IP_MISMATCH]: {
    description: 'Превышен лимит: IP пользователя не совпадает с его страной',
    category: 'limit_error',
  },
  [SMSRuStatusCode.COUNTRY_MESSAGE_LIMIT]: {
    description:
      'Превышен лимит: Слишком много сообщений в эту страну за короткий промежуток времени',
    category: 'limit_error',
  },
  [SMSRuStatusCode.FOREIGN_AUTH_LIMIT]: {
    description:
      'Превышен лимит: Слишком много кодов авторизаций зарубеж за короткий промежуток времени',
    category: 'limit_error',
  },
  [SMSRuStatusCode.IP_MESSAGE_LIMIT]: {
    description: 'Превышен лимит: Слишком много сообщений на один IP адрес',
    category: 'limit_error',
  },
  [SMSRuStatusCode.HOSTING_IP_LIMIT]: {
    description:
      'Превышен лимит: Слишком много сообщений с IP адреса хостинговой компании',
    category: 'limit_error',
  },
  [SMSRuStatusCode.INVALID_IP]: {
    description:
      'IP адрес пользователя указан неверно, либо идет из частной подсети',
    category: 'validation_error',
  },
  [SMSRuStatusCode.CALLS_LIMIT_EXCEEDED]: {
    description:
      'Превышен лимит: Превышено количество допустимых звонков за 5 минут',
    category: 'limit_error',
  },
  [SMSRuStatusCode.AUTH_CODE_LIMIT]: {
    description:
      'Превышен лимит: Слишком много сообщений с кодами авторизации за короткий промежуток времени',
    category: 'limit_error',
  },
  [SMSRuStatusCode.COUNTRY_BLOCKED]: {
    description: 'Страна заблокирована в целях безопасности',
    category: 'validation_error',
  },
  [SMSRuStatusCode.INVALID_CALLBACK_URL]: {
    description: 'Callback: URL неверный (не начинается на http://)',
    category: 'callback_error',
  },
  [SMSRuStatusCode.CALLBACK_HANDLER_NOT_FOUND]: {
    description: 'Callback: Обработчик не найден (возможно был удален ранее)',
    category: 'callback_error',
  },
};

// API Response интерфейсы
export interface SMSResponse {
  status: 'OK' | 'ERROR';
  status_code: SMSRuStatusCode;
  sms: {
    [phone: string]: {
      status: 'OK' | 'ERROR';
      status_code: SMSRuStatusCode;
      sms_id?: string;
      status_text?: string;
    };
  };
  balance?: number;
  status_text?: string;
}

export interface CostResponse {
  status: 'OK' | 'ERROR';
  status_code: SMSRuStatusCode;
  status_text?: string;
  sms: {
    [phone: string]: {
      status: 'OK' | 'ERROR';
      status_code: SMSRuStatusCode;
      cost: number;
      sms: number;
      status_text?: string;
    };
  };
  total_cost: number;
  total_sms: number;
}

export interface SendSMSOptions {
  from?: string;
  time?: number;
  ttl?: number; // Message lifetime in minutes (1-1440)
  daytime?: boolean; // Postpone night-time messages to 10:00 recipient time
  ip?: string; // End user's IP address for SMS.RU abuse protection
  translit?: boolean;
  test?: boolean;
  partner_id?: string;
  limit?: number; // Maximum cost limit in rubles
}

export interface SMSRuClientOptions {
  timeoutMs?: number; // Request timeout, 30000 by default
}

// Максимум номеров в одном запросе к SMS.RU
export const MAX_PHONES_PER_REQUEST = 100;

// Вспомогательные функции
export function getStatusDescription(code: SMSRuStatusCode): string {
  return statusCodeDetails[code]?.description || 'Неизвестный код состояния';
}

export function getStatusCategory(
  code: SMSRuStatusCode,
): StatusCategory | undefined {
  return statusCodeDetails[code]?.category;
}

export function isSuccessStatus(code: SMSRuStatusCode): boolean {
  return statusCodeDetails[code]?.category === 'success';
}

export function isProcessingStatus(code: SMSRuStatusCode): boolean {
  return statusCodeDetails[code]?.category === 'processing';
}

export function isErrorStatus(code: SMSRuStatusCode): boolean {
  const errorCategories: StatusCategory[] = [
    'delivery_failed',
    'validation_error',
    'auth_error',
    'limit_error',
    'server_error',
    'callback_error',
  ];
  return errorCategories.includes(statusCodeDetails[code]?.category);
}

export function getCodeByCategory(category: StatusCategory): SMSRuStatusCode[] {
  return (
    Object.entries(statusCodeDetails)
      .filter(([_, details]) => details.category === category)
      .map(([code]) => Number(code) as SMSRuStatusCode)
  );
}

export function isValidCode(code: number): code is SMSRuStatusCode {
  return code in SMSRuStatusCode;
}

export interface SendSMSParams {
  phones: string | string[];
  message: string;
  options?: SendSMSOptions;
}

export class SMSError extends Error {
  constructor(
    message: string,
    // Код SMS.RU; отсутствует для сетевых ошибок и ошибок валидации
    public statusCode?: SMSRuStatusCode,
    public response?: SMSResponse | CostResponse,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'SMSError';
  }
}

// Предварительная стоимость превышает options.limit, отправка не выполнялась
export class SMSCostLimitError extends SMSError {
  constructor(
    public limit: number,
    public cost: number,
    response: CostResponse,
  ) {
    super(`Cost limit exceeded: ${cost} > ${limit}`, undefined, response);
    this.name = 'SMSCostLimitError';
  }
}

function describeStatus(data: {
  status_code: SMSRuStatusCode;
  status_text?: string;
}): string {
  return `${data.status_code} ${data.status_text ?? getStatusDescription(data.status_code)}`;
}

export class SMSRuClient {
  private apiId: string;
  private timeoutMs: number;

  constructor(apiId: string, options: SMSRuClientOptions = {}) {
    this.apiId = apiId;
    this.timeoutMs = options.timeoutMs ?? 30000;
  }

  // POST с параметрами в теле, чтобы api_id не попадал в URL и логи
  private async request<T>(path: string, params: URLSearchParams): Promise<T> {
    let response: Response;
    let body: string;
    try {
      response = await fetch(`https://sms.ru${path}`, {
        method: 'POST',
        body: params,
        signal: AbortSignal.timeout(this.timeoutMs),
      });
      body = await response.text();
    } catch (error) {
      throw new SMSError(
        `Request to ${path} failed: ${(error as Error).message}`,
        undefined,
        undefined,
        { cause: error },
      );
    }

    if (!response.ok) {
      throw new SMSError(`HTTP error ${response.status} from ${path}`);
    }

    try {
      return JSON.parse(body) as T;
    } catch (error) {
      throw new SMSError(
        `Invalid JSON response from ${path}: ${body.slice(0, 200)}`,
        undefined,
        undefined,
        { cause: error },
      );
    }
  }

  private baseParams(
    phones: string[],
    message: string,
    options: SendSMSOptions,
  ): URLSearchParams {
    const params = new URLSearchParams({
      api_id: this.apiId,
      json: '1',
      to: phones.join(','),
      msg: message,
    });
    if (options.from) params.append('from', options.from);
    if (options.translit) params.append('translit', '1');
    return params;
  }

  private async checkCost(
    phones: string[],
    message: string,
    options: SendSMSOptions,
  ): Promise<CostResponse> {
    const data = await this.request<CostResponse>(
      '/sms/cost',
      this.baseParams(phones, message, options),
    );

    if (data.status === 'ERROR') {
      throw new SMSError(
        `Cost check failed: ${describeStatus(data)}`,
        data.status_code,
        data,
      );
    }

    return data;
  }

  /**
   * Отправляет SMS. Бросает SMSError, если запрос не выполнен целиком.
   * Если запрос выполнен, но часть номеров отклонена, ответ возвращается
   * без исключения: проверяйте `result.sms[phone].status`.
   */
  async sendSMS({
    phones,
    message,
    options = {},
  }: SendSMSParams): Promise<SMSResponse> {
    // Преобразуем phones в массив
    const phoneArray = Array.isArray(phones) ? phones : [phones];

    // Проверяем, что есть хотя бы один телефон
    if (phoneArray.length === 0) {
      throw new SMSError('No phone numbers provided');
    }

    if (phoneArray.length > MAX_PHONES_PER_REQUEST) {
      throw new SMSError(
        `Too many phone numbers: ${phoneArray.length}, maximum is ${MAX_PHONES_PER_REQUEST} per request`,
      );
    }

    // Проверяем, что сообщение не пустое
    if (!message.trim()) {
      throw new SMSError('Message cannot be empty');
    }

    // Если установлен лимит стоимости, проверяем предварительную стоимость
    if (options.limit !== undefined) {
      const costData = await this.checkCost(phoneArray, message, options);

      if (costData.total_cost > options.limit) {
        throw new SMSCostLimitError(options.limit, costData.total_cost, costData);
      }
    }

    const params = this.baseParams(phoneArray, message, options);

    // Добавляем опциональные параметры
    if (options.time) params.append('time', options.time.toString());
    if (options.ttl !== undefined) params.append('ttl', options.ttl.toString());
    if (options.daytime) params.append('daytime', '1');
    if (options.ip) params.append('ip', options.ip);
    if (options.test) params.append('test', '1');
    if (options.partner_id) params.append('partner_id', options.partner_id);

    const data = await this.request<SMSResponse>('/sms/send', params);

    // Проверяем общий статус ответа
    if (data.status === 'ERROR') {
      throw new SMSError(
        `SMS sending failed: ${describeStatus(data)}`,
        data.status_code,
        data,
      );
    }

    return data;
  }
}

// Для обратной совместимости и CLI
export async function sendSMS(params: SendSMSParams): Promise<SMSResponse> {
  const apiId = process.env.SMSRU_API_ID;
  if (!apiId) {
    throw new SMSError('SMSRU_API_ID environment variable is not set');
  }

  const client = new SMSRuClient(apiId);
  return client.sendSMS(params);
}
