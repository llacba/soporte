import { CRM, Crm } from '@communication/domain/Crm.js';
import { Config } from '@core/Config.js';
import { LOGGER, Logger } from '@core/domain/Logger.js';
import { Phone } from '@core/domain/valueObject/Phone.js';
import { inject } from 'inversify';

export class SendEventsList {
  public constructor (
    @inject(Config) private config: Config,
    @inject(LOGGER) private logger: Logger,
    @inject(CRM) private crm: Crm
  ) {}

  public async run (phone: Phone): Promise<void> {
    await this.crm.sendEventsList(phone);
  }
}
