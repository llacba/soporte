import { CrmContactCustomAttributes } from '@communication/domain/dto/CrmContactCustomAttributes.js';

export interface CrmPayload {
  conversationId: number;
  crmContactId: number;
  customAttributes?: CrmContactCustomAttributes;
  inboxId: number;
}
