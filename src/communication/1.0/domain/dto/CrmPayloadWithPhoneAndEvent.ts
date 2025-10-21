import { CrmPayloadWithPhone } from '@communication/domain/dto/CrmPayloadWithPhone.js';
import { EVENTS } from '@communication/domain/type/Events.js';

export interface CrmPayloadWithPhoneAndEvent extends CrmPayloadWithPhone {
  message: EVENTS;
}
