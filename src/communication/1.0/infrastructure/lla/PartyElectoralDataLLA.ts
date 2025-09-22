import { Region } from '@communication/domain/dto/Region.js';
import { PartyElectoralData } from '@communication/domain/PartyElectoralData.js';
import { DNI } from '@communication/domain/valueObject/DNI.js';
import { LLAApi } from '@communication/infrastructure/lla/LLAApi.js';
import { Config } from '@core/Config.js';
import { LOGGER, Logger } from '@core/domain/Logger.js';
import { Nullable } from '@core/domain/type/Nullable.js';
import { Phone } from '@core/domain/valueObject/Phone.js';
import { inject, injectable } from 'inversify';

@injectable()
export class PartyElectoralDataLLA implements PartyElectoralData {
  public constructor (
    @inject(Config) private config: Config,
    @inject(LOGGER) private logger: Logger,
    @inject(LLAApi) private llaApi: LLAApi
  ) {}

  public async getRegionByDni (dni: DNI): Promise<Nullable<Region>> {
    return await this.llaApi.getRegionByDni(dni);
  }

  public async getRegionByPhone (phone: Phone): Promise<Nullable<Region>> {
    return await this.llaApi.getRegionByPhone(phone);
  }
}
