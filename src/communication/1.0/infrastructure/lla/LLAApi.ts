import { Contact } from '@communication/domain/dto/Contact.js';
import { EVENTS } from '@communication/domain/type/Events.js';
import { TICKET_STATUSES } from '@communication/domain/type/TicketStatus.js';
import { DNI } from '@communication/domain/valueObject/DNI.js';
import { ContactData } from '@communication/infrastructure/lla/dto/ContactData.js';
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

  public async getContactByDni (dni: DNI): Promise<Nullable<Contact>> {
    const database = await this.getDatabase();

    const queryString = `SELECT u."idUsuario" as "id", u."apellido" as "lastName", u."nombre" as "firstName", u."email" as "email", u."telefono" as "phone", u."dni" as "dni", ura."idProvincia" as "provinceId", ura."idDepartamento" as "departmentId", ura."idCircuito" as "circuitId", ura."idEscuela" as "schoolId", ura."idMesa" as "tableId"
FROM ${ this.databaseName }."Usuario" u
LEFT JOIN ${ this.databaseName }."usuario_rol_alcance" ura ON ura."usuario_id" = u."idUsuario"
WHERE u."dni" = '${ dni.toPrimitives() }'
LIMIT 1;`;

    const { rows } = await database.query(queryString);

    if (rows.length === 0) {
      return null;
    }

    const contactData = new ContactData(rows[0]);

    return await this.getContactWithRegion(contactData);
  }

  public async getCategoryIdByName (eventName: EVENTS): Promise<Nullable<number>> {
    const database = await this.getDatabase();

    const queryString = `SELECT ci."idCategoria", ci."nombreCategoria" FROM ${ this.databaseName }."CategoriasIncidentes" ci
WHERE ci."nombreCategoria" = '${ eventName }'
LIMIT 1;`;

    const { rows } = await database.query(queryString);

    if (rows.length === 0) {
      return null;
    }

    return rows[0].idCategoria;
  }

  public async getContactByPhone (phone: Phone): Promise<Nullable<Contact>> {
    const database = await this.getDatabase();

    const parsedPhone = phone.toPrimitives().replace('+549', '');

    const queryString = `SELECT u."idUsuario" as "id", u."apellido" as "lastName", u."nombre" as "firstName", u."email" as "email", u."telefono" as "phone", u."dni" as "dni", ura."idProvincia" as "provinceId", ura."idDepartamento" as "departmentId", ura."idCircuito" as "circuitId", ura."idEscuela" as "schoolId", ura."idMesa" as "tableId"
FROM ${ this.databaseName }."Usuario" u
LEFT JOIN ${ this.databaseName }."usuario_rol_alcance" ura ON ura."usuario_id" = u."idUsuario"
WHERE u."telefono" = '${ parsedPhone }'
LIMIT 1;`;

    const { rows } = await database.query(queryString);

    if (rows.length === 0) {
      return null;
    }

    const contactData = new ContactData(rows[0]);

    return await this.getContactWithRegion(contactData);
  }

  public async createTicket (ticket: Ticket): Promise<void> {
    const database = await this.getDatabase();

    const queryString = `INSERT INTO ${ this.databaseName }."Incidencias"(
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
  '${ TICKET_STATUSES.PENDING }',
  '${ ticket.details.toPrimitives() }',
  NOW(),
  NOW()
);`;

    await database.query(queryString);
  }

  public async getTicketByConversationId (conversationId: number): Promise<Nullable<Ticket>> {
    const database = await this.getDatabase();

    const queryString = `SELECT i."idCategoria", i."fechaCreacion", i."observaciones", i."idTicket", i."estado", i."ultimaActualizacion", i."idUsuario"
FROM ${ this.databaseName }."Incidencias" i
WHERE i."observaciones" LIKE 'Conversación: [${ conversationId }]%'
LIMIT 1;`;

    const { rows } = await database.query(queryString);

    if (rows.length === 0) {
      return null;
    }

    return new Ticket({
      categoryId: rows[0].idCategoria,
      createdAt: rows[0].fechaCreacion,
      details: rows[0].observaciones,
      id: rows[0].idTicket,
      status: rows[0].estado,
      updatedAt: rows[0].ultimaActualizacion,
      userId: rows[0].idUsuario
    });
  }

  public async assignAgentToTicket (ticket: Ticket): Promise<void> {
    const database = await this.getDatabase();

    const queryString = `UPDATE ${ this.databaseName }."Incidencias"
SET "estado" = '${ TICKET_STATUSES.ASSIGNED }',
"observaciones" = '${ ticket.details.toPrimitives() }',
"ultimaActualizacion" = NOW()
WHERE "idTicket" = ${ ticket.id };`;

    await database.query(queryString);
  }

  public async reopenTicket (ticket: Ticket): Promise<void> {
    const database = await this.getDatabase();

    const queryString = `UPDATE ${ this.databaseName }."Incidencias"
SET "observaciones" = '${ ticket.details.toPrimitives() }',
"estado" = '${ ticket.status }',
"ultimaActualizacion" = NOW()
WHERE "idTicket" = ${ ticket.id };`;

    await database.query(queryString);
  }

  public async resolveTicket (ticket: Ticket): Promise<void> {
    const database = await this.getDatabase();

    const queryString = `UPDATE ${ this.databaseName }."Incidencias"
SET "observaciones" = '${ ticket.details.toPrimitives() }',
"estado" = '${ ticket.status }',
"ultimaActualizacion" = NOW()
WHERE "idTicket" = ${ ticket.id };`;

    await database.query(queryString);
  }

  public async unassignTicket (ticket: Ticket): Promise<void> {
    const database = await this.getDatabase();

    const queryString = `UPDATE ${ this.databaseName }."Incidencias"
SET "observaciones" = '${ ticket.details.toPrimitives() }',
"estado" = '${ ticket.status }',
"ultimaActualizacion" = NOW()
WHERE "idTicket" = ${ ticket.id };`;

    await database.query(queryString);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async saveElectoralResults (electoralTableId: number, result: any): Promise<void> {
    const scrutinyId = await this.saveScrutinyReport(electoralTableId, result);

    await this.saveReportDetails(scrutinyId, result.valoresTotalizadosPositivos);
  }

  private async getContactWithRegion (contactData: ContactData): Promise<Nullable<Contact>> {
    if (contactData.provinceId) {
      return null;
    }

    if (contactData.departmentId) {
      return await this.getContactWithRegionByDepartmentId(contactData);
    }

    if (contactData.circuitId) {
      return await this.getContactWithRegionByCircuitId(contactData);
    }

    if (contactData.schoolId) {
      return await this.getContactWithRegionBySchoolId(contactData);
    }

    if (contactData.tableId) {
      return await this.getContactWithRegionByTableId(contactData);
    }
  }

  private async getContactWithRegionByDepartmentId (contactData: ContactData): Promise<Nullable<Contact>> {
    const database = await this.getDatabase();

    const queryString = `SELECT d."descripcion" as "departmentName", bt.idBloque as "regionId", bt.nombreBloque as "regionName"
FROM ${ this.databaseName }."Departamento" d
LEFT JOIN ${ this.databaseName }."BloqueTerritorial" bt ON bt.idBloque = d.idBloque
WHERE d."idDepartamento" = ${ contactData.departmentId }
LIMIT 1;`;

    const { rows } = await database.query(queryString);

    if (rows.length === 0) {
      return null;
    }

    return new Contact({
      department: {
        id: rows[0].departmentId,
        name: rows[0].departmentName
      },
      dni: contactData.dni.toPrimitives(),
      email: contactData.email ? contactData.email.toPrimitives() : null,
      firstName: contactData.firstName.toPrimitives(),
      id: contactData.id,
      lastName: contactData.lastName.toPrimitives(),
      phone: contactData.phone.toPrimitives(),
      region: {
        id: rows[0].regionId,
        name: rows[0].regionName
      }
    });
  }

  private async getContactWithRegionByCircuitId (contactData: ContactData): Promise<Nullable<Contact>> {
    const database = await this.getDatabase();

    const queryString = `SELECT d."descripcion" as "departmentName", bt.idBloque as "regionId", bt.nombreBloque as "regionName"
FROM ${ this.databaseName }."CircuitoElectoral" ce
LEFT JOIN ${ this.databaseName }."Departamento" d ON d."idDepartamento" = ce."idDepartamento"
LEFT JOIN ${ this.databaseName }."BloqueTerritorial" bt ON bt.idBloque = d.idBloque
WHERE ce."idCircuito" = ${ contactData.circuitId }
LIMIT 1;`;

    const { rows } = await database.query(queryString);

    if (rows.length === 0) {
      return null;
    }

    return new Contact({
      department: {
        id: rows[0].departmentId,
        name: rows[0].departmentName
      },
      dni: contactData.dni.toPrimitives(),
      email: contactData.email ? contactData.email.toPrimitives() : null,
      firstName: contactData.firstName.toPrimitives(),
      id: contactData.id,
      lastName: contactData.lastName.toPrimitives(),
      phone: contactData.phone.toPrimitives(),
      region: {
        id: rows[0].regionId,
        name: rows[0].regionName
      }
    });
  }

  private async getContactWithRegionBySchoolId (contactData: ContactData): Promise<Nullable<Contact>> {
    const database = await this.getDatabase();

    const queryString = `SELECT d."descripcion" as "departmentName", bt.idBloque as "regionId", bt.nombreBloque as "regionName"
FROM ${ this.databaseName }."Escuelas" e
LEFT JOIN ${ this.databaseName }."CircuitoElectoral" ce ON ce."idCircuito" = e."idCircuito"
LEFT JOIN ${ this.databaseName }."Departamento" d ON d."idDepartamento" = ce."idDepartamento"
LEFT JOIN ${ this.databaseName }."BloqueTerritorial" bt ON bt.idBloque = d.idBloque
WHERE e."idEscuela" = ${ contactData.schoolId }
LIMIT 1;`;

    const { rows } = await database.query(queryString);

    if (rows.length === 0) {
      return null;
    }

    return new Contact({
      department: {
        id: rows[0].departmentId,
        name: rows[0].departmentName
      },
      dni: contactData.dni.toPrimitives(),
      email: contactData.email ? contactData.email.toPrimitives() : null,
      firstName: contactData.firstName.toPrimitives(),
      id: contactData.id,
      lastName: contactData.lastName.toPrimitives(),
      phone: contactData.phone.toPrimitives(),
      region: {
        id: rows[0].regionId,
        name: rows[0].regionName
      }
    });
  }

  private async getContactWithRegionByTableId (contactData: ContactData): Promise<Nullable<Contact>> {
    const database = await this.getDatabase();

    const queryString = `SELECT d."descripcion" as "departmentName", bt.idBloque as "regionId", bt.nombreBloque as "regionName"
FROM ${ this.databaseName }."Mesas" m
LEFT JOIN ${ this.databaseName }."Escuelas" e ON e."idEscuela" = m."idEscuela"
LEFT JOIN ${ this.databaseName }."CircuitoElectoral" ce ON ce."idCircuito" = e."idCircuito"
LEFT JOIN ${ this.databaseName }."Departamento" d ON d."idDepartamento" = ce."idDepartamento"
LEFT JOIN ${ this.databaseName }."BloqueTerritorial" bt ON bt.idBloque = d.idBloque
WHERE m."idMesa" = ${ contactData.tableId }
LIMIT 1;`;

    const { rows } = await database.query(queryString);

    if (rows.length === 0) {
      return null;
    }

    return new Contact({
      department: {
        id: rows[0].departmentId,
        name: rows[0].departmentName
      },
      dni: contactData.dni.toPrimitives(),
      email: contactData.email ? contactData.email.toPrimitives() : null,
      firstName: contactData.firstName.toPrimitives(),
      id: contactData.id,
      lastName: contactData.lastName.toPrimitives(),
      phone: contactData.phone.toPrimitives(),
      region: {
        id: rows[0].regionId,
        name: rows[0].regionName
      }
    });
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
