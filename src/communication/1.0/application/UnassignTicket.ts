import { PARTY_ELECTORAL_DATA, PartyElectoralData } from '@communication/domain/PartyElectoralData.js';
import { formatDateTime } from '@core/application/date.js';
import { Config } from '@core/Config.js';
import { NotFound } from '@core/domain/error/NotFound.js';
import { LOGGER, Logger } from '@core/domain/Logger.js';
import { TrimmedString } from '@core/domain/valueObject/TrimmedString.js';
import { inject } from 'inversify';

export class UnassignTicket {
  public constructor (
    @inject(Config) private config: Config,
    @inject(LOGGER) private logger: Logger,
    @inject(PARTY_ELECTORAL_DATA) private partyElectoralData: PartyElectoralData
  ) {}

  public async run (conversationId: number): Promise<void> {
    const ticket = await this.partyElectoralData.getTicketByConversationId(conversationId);

    if (!ticket) {
      throw new NotFound(`Ticket with conversation ID ${ conversationId }`);
    }

    ticket.details = new TrimmedString(`${ ticket.details.toPrimitives() }
${ formatDateTime(new Date()) } - Desasignado.`);

    await this.partyElectoralData.unassignTicket(ticket);
  }
}
