import { Region } from '@communication/domain/dto/Region.js';
import { EVENTS } from '@communication/domain/type/Events.js';
import { TICKET_STATUSES } from '@communication/domain/type/TicketStatus.js';
import { DNI } from '@communication/domain/valueObject/DNI.js';
import { Ticket } from '@communication/infrastructure/lla/dto/Ticket.js';
import { Config } from '@core/Config.js';
import { DATABASE_CONNECTION, DatabaseConnection } from '@core/domain/DatabaseConnection.js';
import { LOGGER, Logger } from '@core/domain/Logger.js';
import { Nullable } from '@core/domain/type/Nullable.js';
import { Phone } from '@core/domain/valueObject/Phone.js';
import { inject, injectable } from 'inversify';

@injectable()
export class LLAApi {
  public databaseName: string;

  public constructor (
    @inject(Config) private config: Config,
    @inject(LOGGER) private logger: Logger,
    @inject(DATABASE_CONNECTION) private databaseConnection: DatabaseConnection
  ) {
    this.databaseName = 'dev';
  }

  public async getRegionByDni (dni: DNI): Promise<Nullable<Region>> {
    const database = await this.getDatabase();

    const queryString = `SELECT bt.idBloque, bt.nombreBloque FROM "${ this.databaseName }"."Usuario" u
LEFT JOIN "${ this.databaseName }"."FiscalGeneral" fg ON u.idUsuario = fg.idUsuario
LEFT JOIN "${ this.databaseName }"."Escuelas" e ON fg.idEscuela = e.idEscuela
LEFT JOIN "${ this.databaseName }"."CircuitoElectoral" ce ON e.idCircuito = ce.idCircuito
LEFT JOIN "${ this.databaseName }"."Departamento" d ON ce.idDepartamento = d.idDepartamento
LEFT JOIN "${ this.databaseName }"."BloqueTerritorial" bt ON d.idBloque = bt.idBloque
WHERE u.dni = '${ dni.toPrimitives() }'
LIMIT 1;`;

    const { rows } = await database.query(queryString);

    if (rows.length === 0) {
      return null;
    }

    return new Region({
      id: rows[0].idBloque,
      name: rows[0].nombreBloque
    });
  }

  public async getCategoryIdByName (eventName: EVENTS): Promise<Nullable<number>> {
    const database = await this.getDatabase();

    const queryString = `SELECT ci.idCategoria, ci.nombreCategoria FROM "${ this.databaseName }"."CategoriasIncidencias" ci
WHERE ci.nombreCategoria = '${ eventName }'
LIMIT 1;`;

    const { rows } = await database.query(queryString);

    if (rows.length === 0) {
      return null;
    }

    return rows[0].idCategoria;
  }

  public async getRegionByPhone (phone: Phone): Promise<Nullable<Region>> {
    const database = await this.getDatabase();

    const parsedPhone = phone.toPrimitives().replace('+549', '');

    const queryString = `SELECT bt.idBloque, bt.nombreBloque FROM "${ this.databaseName }"."Usuario" u
LEFT JOIN "${ this.databaseName }"."FiscalGeneral" fg ON u.idUsuario = fg.idUsuario
LEFT JOIN "${ this.databaseName }"."Escuelas" e ON fg.idEscuela = e.idEscuela
LEFT JOIN "${ this.databaseName }"."CircuitoElectoral" ce ON e.idCircuito = ce.idCircuito
LEFT JOIN "${ this.databaseName }"."Departamento" d ON ce.idDepartamento = d.idDepartamento
LEFT JOIN "${ this.databaseName }"."BloqueTerritorial" bt ON d.idBloque = bt.idBloque
WHERE u.telefono = '${ parsedPhone }'
LIMIT 1;`;

    const { rows } = await database.query(queryString);

    if (rows.length === 0) {
      return null;
    }

    return new Region({
      id: rows[0].idBloque,
      name: rows[0].nombreBloque
    });
  }

  public async createTicket (ticket: Ticket): Promise<void> {
    const database = await this.getDatabase();

    const queryString = `INSERT INTO "${ this.databaseName }"."Incidencias"(
  "idUsuario",
  "idCategoria",
  "estado",
  "observaciones",
  "fechaCreacion",
  "ultimaActualizacion"
)
VALUES (
  ${ ticket.userId },
  ${ ticket.categoryId },
  ${ TICKET_STATUSES.PENDING },
  ${ ticket.details },
  NOW(),
  NOW()
)
RETURNING "idEscrutinio"`;

    await database.query(queryString);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async saveElectoralResults (electoralTableId: number, result: any): Promise<void> {
    const scrutinyId = await this.saveScrutinyReport(electoralTableId, result);

    await this.saveReportDetails(scrutinyId, result.valoresTotalizadosPositivos);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async saveScrutinyReport (electoralTableId: number, result: any): Promise<number> {
    const database = await this.getDatabase();

    const queryString = `INSERT INTO "2023"."ActaEscrutinio"(
  "idMesa",
  "votosBlancos",
  "votosNulos",
  "votosRecurridosComandoImpugnados",
  "mesaImpugnada",
  total,
  created_at
)
VALUES (
  ${ electoralTableId },
  ${ result.valoresTotalizadosOtros.votosEnBlanco },
  ${ result.valoresTotalizadosOtros.votosNulos },
  ${ result.valoresTotalizadosOtros.votosRecurridosComandoImpugnados },
  ${ false },
  ${ result.estadoRecuento.cantidadVotantes },
  NOW()
)
RETURNING "idEscrutinio"`;

    const { rows } = await database.query(queryString);

    return rows[0].idEscrutinio;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async saveReportDetails (scrutinyId: number, votesByParty: Array<any>): Promise<void> {
    const database = await this.getDatabase();

    for (const partyVotes of votesByParty) {
      const queryString = `INSERT INTO "2023"."ActaDetalle"(
  "idEscrutinio",
  "idLista",
  "votos"
)
VALUES (
  ${ scrutinyId },
  ${ parseInt(partyVotes.idAgrupacion) },
  ${ partyVotes.votos }
)`;

      await database.query(queryString);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async getDatabase (): Promise<any> {
    return await this.databaseConnection.getDatabase();
  }
}
