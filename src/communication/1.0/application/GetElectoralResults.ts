import { DineApi } from '@communication/infrastructure/lla/DineApi.js';
import { LLAApi } from '@communication/infrastructure/lla/LLAApi.js';
import { Config } from '@core/Config.js';
import { LOGGER, Logger } from '@core/domain/Logger.js';
import { inject } from 'inversify';

export class GetElectoralResults {
  public constructor (
    @inject(Config) private config: Config,
    @inject(LOGGER) private logger: Logger,
    @inject(DineApi) private dineApi: DineApi,
    @inject(LLAApi) private llaApi: LLAApi
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async run (): Promise<any> {
    const year = 2023;
    // const electoralTables = 9097;

    // const missingTables = [4230, 4566, 4567, 6178, 6283, 6995, 8767, 8784, 9082];

    const currentTable = 4230;
    // for (const currentTable of missingTables) {
    try {
      const result = await this.dineApi.getElectoralResults(year, currentTable);

      await this.llaApi.saveElectoralResults(currentTable, result);

      this.logger.info(`Electoral table ${ currentTable } processed`);
    } catch (error) {
      this.logger.error(error as Error);
    }
    // }
  }
}
