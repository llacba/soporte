import { Phone } from '@core/domain/valueObject/Phone.js';
import { TrimmedString } from '@core/domain/valueObject/TrimmedString.js';

export interface MessageSender {
  sendAuditorNotFound (phone: Phone): Promise<void>
  sendEventsList (phone: Phone): Promise<void>
  sendSupportRequestConfirmation (phone: Phone): Promise<void>
  sendTextMessage (message: TrimmedString, phone: Phone): Promise<void>
}

export const MESSAGE_SENDER = Symbol.for('MessageSender');
