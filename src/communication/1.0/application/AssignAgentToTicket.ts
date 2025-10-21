import { CrmPayloadWithPhoneAndAssignedAgent } from '@communication/domain/dto/CrmPayloadWithPhoneAndAssignedAgent.js';
import { PARTY_ELECTORAL_DATA, PartyElectoralData } from '@communication/domain/PartyElectoralData.js';
import { Config } from '@core/Config.js';
import { InvalidArgument } from '@core/domain/error/InvalidArgument.js';
import { NotFound } from '@core/domain/error/NotFound.js';
import { LOGGER, Logger } from '@core/domain/Logger.js';
import { TrimmedString } from '@core/domain/valueObject/TrimmedString.js';
import { inject } from 'inversify';

export class AssignAgentToTicket {
  public constructor (
    @inject(Config) private config: Config,
    @inject(LOGGER) private logger: Logger,
    @inject(PARTY_ELECTORAL_DATA) private partyElectoralData: PartyElectoralData
  ) {}

  public async run (payload: CrmPayloadWithPhoneAndAssignedAgent): Promise<void> {
    if (!payload.customAttributes || !payload.customAttributes.contactId) {
      throw new InvalidArgument('Falta ID de Usuario.');
    }

    const ticket = await this.partyElectoralData.getTicketByConversationId(payload.conversationId);

    if (!ticket) {
      throw new NotFound(`Ticket with conversation ID ${ payload.conversationId }`);
    }

    ticket.details = new TrimmedString(`${ ticket.details.toPrimitives() }
${ new Date().toString() } - Asignado a ${ payload.agent.name.toPrimitives() }.`);

    await this.partyElectoralData.assignAgentToTicket(ticket);
  }
}
