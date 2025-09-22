import { AssignPhoneRegionData } from '@communication/domain/dto/AssignPhoneRegionData.js';
import { Region } from '@communication/domain/dto/Region.js';
import { REGION_NAMES } from '@communication/domain/type/RegionNames.js';
import { DNI } from '@communication/domain/valueObject/DNI.js';
import { Config } from '@core/Config.js';
import { NotImplemented } from '@core/domain/error/NotImplemented.js';
import { LOGGER, Logger } from '@core/domain/Logger.js';
import { Nullable } from '@core/domain/type/Nullable.js';
import { Phone } from '@core/domain/valueObject/Phone.js';
import { inject, injectable } from 'inversify';

@injectable()
export class LLAApi {
  public constructor (
    @inject(Config) private config: Config,
    @inject(LOGGER) private logger: Logger
  ) {}

  public async getRegionByDni (dni: DNI): Promise<Nullable<Region>> {
    if (dni.toPrimitives()) {
      return new Region({
        id: 1,
        name: REGION_NAMES.A
      });
    }

    return null;
  }

  public async getRegionByPhone (phone: Phone): Promise<Nullable<Region>> {
    if (phone.toPrimitives()) {
      return new Region({
        id: 1,
        name: REGION_NAMES.A
      });
    }

    return null;
  }

  public async createTicket (_data: AssignPhoneRegionData): Promise<void> {
    throw new NotImplemented();
  }
}
