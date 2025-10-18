import { Nullable } from '@core/domain/type/Nullable.js';

export interface CrmPayload {
  contactId: number;
  conversationId: number;
  crmContactId: number;
  inboxId: number;
  userId?: Nullable<number>;
}
