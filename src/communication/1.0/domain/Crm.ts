import { CrmSendMessageData } from '@communication/domain/dto/CrmSendMessageData.js';
import { Region } from '@communication/domain/dto/Region.js';
import { Phone } from '@core/domain/valueObject/Phone.js';
import { TrimmedString } from '@core/domain/valueObject/TrimmedString.js';

export interface Crm {
  askForDNI (data: CrmSendMessageData): Promise<void>
  assignTeamToConversation (conversationId: number, teamId: number): Promise<void>
  getTeamByName (name: TrimmedString): Promise<Region>
  sendAuditorNotFound (phone: Phone): Promise<void>
  sendEventsList (phone: Phone): Promise<void>
}

export const CRM = Symbol.for('Crm');
