import { Agent } from '@communication/domain/dto/Agent.js';
import { PARTY_ELECTORAL_DATA, PartyElectoralData } from '@communication/domain/PartyElectoralData.js';
import { TICKET_STATUSES } from '@communication/domain/type/TicketStatus.js';
import { formatDateTime } from '@core/application/date.js';
import { Config } from '@core/Config.js';
import { NotFound } from '@core/domain/error/NotFound.js';
import { LOGGER, Logger } from '@core/domain/Logger.js';
import { Nullable } from '@core/domain/type/Nullable.js';
import { TrimmedString } from '@core/domain/valueObject/TrimmedString.js';
import { inject } from 'inversify';

export class ReopenTicket {
  public constructor (
    @inject(Config) private config: Config,
    @inject(LOGGER) private logger: Logger,
    @inject(PARTY_ELECTORAL_DATA) private partyElectoralData: PartyElectoralData
  ) {}

  public async run (conversationId: number, agent: Nullable<Agent>): Promise<void> {
    const ticket = await this.partyElectoralData.getTicketByConversationId(conversationId);

    if (!ticket) {
      throw new NotFound(`Ticket with conversation ID ${ conversationId }`);
    }

    ticket.status = agent ? TICKET_STATUSES.ASSIGNED : TICKET_STATUSES.PENDING;
    ticket.details = new TrimmedString(`${ ticket.details.toPrimitives() }
${ formatDateTime(new Date()) } - Reabierto.`);

    await this.partyElectoralData.reopenTicket(ticket);
  }
}
