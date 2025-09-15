import { Config } from '@core/Config.js';
import { NotImplemented } from '@core/domain/error/NotImplemented.js';
import { LOGGER, Logger } from '@core/domain/Logger.js';
import { Phone } from '@core/domain/valueObject/Phone.js';
import { inject } from 'inversify';

export class GetPhoneRegion {
  public constructor (
    @inject(Config) private config: Config,
    @inject(LOGGER) private logger: Logger
  ) {}

  public async run (_phone: Phone): Promise<void> {
    throw new NotImplemented();
  }
}
