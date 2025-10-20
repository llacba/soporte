import { CRM, Crm } from '@communication/domain/Crm.js';
import { CrmPayloadWithPhoneAndDni } from '@communication/domain/dto/CrmPayloadWithPhoneAndDni.js';
import { MESSAGE_SENDER, MessageSender } from '@communication/domain/MessageSender.js';
import { PARTY_ELECTORAL_DATA, PartyElectoralData } from '@communication/domain/PartyElectoralData.js';
import { Config } from '@core/Config.js';
import { NotFound } from '@core/domain/error/NotFound.js';
import { LOGGER, Logger } from '@core/domain/Logger.js';
import { TrimmedString } from '@core/domain/valueObject/TrimmedString.js';
import { inject } from 'inversify';

export class SetRegionByDni {
  public constructor (
    @inject(Config) private config: Config,
    @inject(LOGGER) private logger: Logger,
    @inject(CRM) private crm: Crm,
    @inject(MESSAGE_SENDER) private messageSender: MessageSender,
    @inject(PARTY_ELECTORAL_DATA) private partyElectoralData: PartyElectoralData
  ) {}

  public async run (payload: CrmPayloadWithPhoneAndDni): Promise<void> {
    const contact = await this.partyElectoralData.getContactByDni(payload.dni);

    if (!contact) {
      await this.messageSender.sendAuditorNotFound(payload.phone);

      throw new NotFound(`Party Electoral Data: Contact with Phone ${ payload.phone.toPrimitives() } and DNI ${ payload.dni.toPrimitives() }`);
    }

    const team = await this.crm.getTeamByName(new TrimmedString(contact.region.name));

    await this.crm.updateContactData(contact);

    await this.crm.assignTeamToConversation(payload.conversationId, team.id);

    await this.messageSender.sendEventsList(payload.phone);
  }
}
