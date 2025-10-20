import { Contact } from '@communication/domain/dto/Contact.js';
import { PartyElectoralData } from '@communication/domain/PartyElectoralData.js';
import { EVENTS } from '@communication/domain/type/Events.js';
import { DNI } from '@communication/domain/valueObject/DNI.js';
import { Ticket } from '@communication/infrastructure/lla/dto/Ticket.js';
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

  public async getContactByDni (dni: DNI): Promise<Nullable<Contact>> {
    return await this.llaApi.getContactByDni(dni);
  }

  public async getContactByPhone (phone: Phone): Promise<Nullable<Contact>> {
    return await this.llaApi.getContactByPhone(phone);
  }

  public async getCategoryIdByName (eventName: EVENTS): Promise<Nullable<number>> {
    return await this.llaApi.getCategoryIdByName(eventName);
  }

  public async createTicket (ticket: Ticket): Promise<void> {
    await this.llaApi.createTicket(ticket);
  }
}
