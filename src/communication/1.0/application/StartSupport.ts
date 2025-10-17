import { CRM, Crm } from '@communication/domain/Crm.js';
import { CrmPayloadWithPhone } from '@communication/domain/dto/CrmPayloadWithPhone.js';
import { MESSAGE_SENDER, MessageSender } from '@communication/domain/MessageSender.js';
import { PARTY_ELECTORAL_DATA, PartyElectoralData } from '@communication/domain/PartyElectoralData.js';
import { Config } from '@core/Config.js';
import { LOGGER, Logger } from '@core/domain/Logger.js';
import { TrimmedString } from '@core/domain/valueObject/TrimmedString.js';
import { inject } from 'inversify';

export class StartSupport {
  public constructor (
    @inject(Config) private config: Config,
    @inject(LOGGER) private logger: Logger,
    @inject(CRM) private crm: Crm,
    @inject(MESSAGE_SENDER) private messageSender: MessageSender,
    @inject(PARTY_ELECTORAL_DATA) private partyElectoralData: PartyElectoralData
  ) {}

  public async run (payload: CrmPayloadWithPhone): Promise<void> {
    const region = await this.partyElectoralData.getRegionByPhone(payload.phone);

    if (!region) {
      this.logger.warning(`Party Electoral Data: Phone ${ payload.phone.toPrimitives() } not found.`);

      await this.crm.askForDNI(payload);

      return;
    }

    const team = await this.crm.getTeamByName(new TrimmedString(region.name));

    await this.crm.assignTeamToConversation(payload.conversationId, team.id);

    await this.messageSender.sendEventsList(payload.phone);
  }
}
