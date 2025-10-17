import { CrmPayload } from '@communication/domain/dto/CrmPayload.js';
import { Region } from '@communication/domain/dto/Region.js';
import { TrimmedString } from '@core/domain/valueObject/TrimmedString.js';

export interface Crm {
  askForDNI (data: CrmPayload): Promise<void>
  assignTeamToConversation (conversationId: number, teamId: number): Promise<void>
  getTeamByName (name: TrimmedString): Promise<Region>
}

export const CRM = Symbol.for('Crm');
