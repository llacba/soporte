import { CRM, Crm } from '@communication/domain/Crm.js';
import { AssignDNIRegionData } from '@communication/domain/dto/AssignDNIRegionData.js';
import { PARTY_ELECTORAL_DATA, PartyElectoralData } from '@communication/domain/PartyElectoralData.js';
import { Config } from '@core/Config.js';
import { NotFound } from '@core/domain/error/NotFound.js';
import { LOGGER, Logger } from '@core/domain/Logger.js';
import { TrimmedString } from '@core/domain/valueObject/TrimmedString.js';
import { inject } from 'inversify';

export class SetRegionByDNI {
  public constructor (
    @inject(Config) private config: Config,
    @inject(LOGGER) private logger: Logger,
    @inject(CRM) private crm: Crm,
    @inject(PARTY_ELECTORAL_DATA) private partyElectoralData: PartyElectoralData
  ) {}

  public async run (data: AssignDNIRegionData): Promise<void> {
    const region = await this.partyElectoralData.getRegionByDni(data.dni);

    if (!region) {
      await this.crm.sendAuditorNotFound(data.phone);

      throw new NotFound(`Phone ${ data.phone.toPrimitives() } with DNI ${ data.dni.toPrimitives() } not found in Party Electoral Data`);
    }

    const team = await this.crm.getTeamByName(new TrimmedString(region.name));

    await this.crm.assignTeamToConversation(data.conversationId, team.id);

    await this.crm.sendEventsList(data.phone);
  }
}
