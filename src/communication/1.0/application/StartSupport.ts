import { CRM, Crm } from '@communication/domain/Crm.js';
import { AssignPhoneRegionData } from '@communication/domain/dto/AssignPhoneRegionData.js';
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
    @inject(PARTY_ELECTORAL_DATA) private partyElectoralData: PartyElectoralData
  ) {}

  public async run (data: AssignPhoneRegionData): Promise<void> {
    const region = await this.partyElectoralData.getRegionByPhone(data.phone);

    if (!region) {
      await this.crm.askForDNI(data);

      return;
    }

    const team = await this.crm.getTeamByName(new TrimmedString(region.name));

    await this.crm.assignTeamToConversation(data.conversationId, team.id);

    await this.crm.sendEventsList(data.phone);
  }
}
