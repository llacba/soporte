import { Message } from '@communication/domain/entity/Message.js';
import { DateRange } from '@core/domain/type/DateRange.js';
import { Nullable } from '@core/domain/type/Nullable.js';
import { Uuid } from '@core/domain/valueObject/Uuid.js';

export interface CommunicationMessageRepository {
  findAll (): Promise<Array<Message>>
  findByDateRange (dateRange: DateRange): Promise<Array<Message>>
  findById (messageId: Uuid): Promise<Nullable<Message>>
  save (message: Message): Promise<void>
}

export const COMMUNICATION_MESSAGE_REPOSITORY = Symbol.for('CommunicationMessageRepository');
