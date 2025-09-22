import { CrmSendMessageData } from '@communication/domain/dto/CrmSendMessageData.js';
import { Phone } from '@core/domain/valueObject/Phone.js';

export interface AssignPhoneRegionData extends CrmSendMessageData {
  phone: Phone;
}
