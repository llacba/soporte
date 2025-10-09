import { CrmSendMessageData } from '@communication/domain/dto/CrmSendMessageData.js';
import { Region } from '@communication/domain/dto/Region.js';
import { TrimmedString } from '@core/domain/valueObject/TrimmedString.js';

export interface Crm {
  askForDNI (data: CrmSendMessageData): Promise<void>
  assignTeamToConversation (conversationId: number, teamId: number): Promise<void>
  getTeamByName (name: TrimmedString): Promise<Region>
}

export const CRM = Symbol.for('Crm');
