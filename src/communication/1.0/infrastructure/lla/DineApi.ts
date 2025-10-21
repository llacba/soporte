import { Config } from '@core/Config.js';
import { LOGGER, Logger } from '@core/domain/Logger.js';
import axios from 'axios';
import { inject, injectable } from 'inversify';

@injectable()
export class DineApi {
  public constructor (
    @inject(Config) private config: Config,
    @inject(LOGGER) private logger: Logger
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getElectoralResults (year: number, electoralTableId: number): Promise<any> {
    const dineApiUrl = 'https://resultados.mininterior.gob.ar/api/resultados/getResultados';

    const response = await axios.get(dineApiUrl, {
      params: {
        anioEleccion: year,
        categoriaId: 1,
        distritoId: 4,
        mesaId: electoralTableId,
        tipoEleccion: 2,
        tipoRecuento: 1
      }
    });

    return response.data;
  }
}
