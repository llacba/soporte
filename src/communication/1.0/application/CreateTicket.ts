import { AssignPhoneRegionData } from '@communication/domain/dto/AssignPhoneRegionData.js';
import { PARTY_ELECTORAL_DATA, PartyElectoralData } from '@communication/domain/PartyElectoralData.js';
import { Config } from '@core/Config.js';
import { LOGGER, Logger } from '@core/domain/Logger.js';
import { inject } from 'inversify';

export class CreateTicket {
  public constructor (
    @inject(Config) private config: Config,
    @inject(LOGGER) private logger: Logger,
    @inject(PARTY_ELECTORAL_DATA) private partyElectoralData: PartyElectoralData
  ) {}

  public async run (data: AssignPhoneRegionData): Promise<void> {
    await this.partyElectoralData.createTicket(data);
  }
}
