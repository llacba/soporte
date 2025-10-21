import { CrmPayloadWithPhoneAndEvent } from '@communication/domain/dto/CrmPayloadWithPhoneAndEvent.js';
import { PARTY_ELECTORAL_DATA, PartyElectoralData } from '@communication/domain/PartyElectoralData.js';
import { TICKET_STATUSES } from '@communication/domain/type/TicketStatus.js';
import { Ticket } from '@communication/infrastructure/lla/dto/Ticket.js';
import { Config } from '@core/Config.js';
import { InvalidArgument } from '@core/domain/error/InvalidArgument.js';
import { LOGGER, Logger } from '@core/domain/Logger.js';
import { inject } from 'inversify';

export class CreateTicket {
  public constructor (
    @inject(Config) private config: Config,
    @inject(LOGGER) private logger: Logger,
    @inject(PARTY_ELECTORAL_DATA) private partyElectoralData: PartyElectoralData
  ) {}

  public async run (payload: CrmPayloadWithPhoneAndEvent): Promise<void> {
    if (!payload.customAttributes || !payload.customAttributes.contactId) {
      throw new InvalidArgument('Falta ID de Usuario.');
    }

    const categoryId = await this.partyElectoralData.getCategoryIdByName(payload.message);

    if (!categoryId) {
      throw new InvalidArgument(`No se encontró el evento ${ payload.message }.`);
    }

    const newTicketDetails = `Conversación: [${ payload.conversationId }]
${ payload.message }`;

    const ticket = new Ticket({
      categoryId: categoryId,
      createdAt: new Date(),
      crmContactId: payload.crmContactId,
      details: newTicketDetails,
      status: TICKET_STATUSES.PENDING,
      updatedAt: new Date(),
      userId: payload.customAttributes.contactId
    });

    await this.partyElectoralData.createTicket(ticket);
  }
}
