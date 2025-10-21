import { Contact } from '@communication/domain/dto/Contact.js';
import { EVENTS } from '@communication/domain/type/Events.js';
import { DNI } from '@communication/domain/valueObject/DNI.js';
import { Ticket } from '@communication/infrastructure/lla/dto/Ticket.js';
import { Nullable } from '@core/domain/type/Nullable.js';
import { Phone } from '@core/domain/valueObject/Phone.js';

export interface PartyElectoralData {
  assignAgentToTicket (ticket: Ticket): Promise<void>
  createTicket (ticket: Ticket): Promise<void>
  getCategoryIdByName (event: EVENTS): Promise<Nullable<number>>
  getContactByDni (dni: DNI): Promise<Nullable<Contact>>
  getContactByPhone (phone: Phone): Promise<Nullable<Contact>>
  getTicketByConversationId (conversationId: number): Promise<Nullable<Ticket>>
  resolveTicket (ticket: Ticket): Promise<void>
}

export const PARTY_ELECTORAL_DATA = Symbol.for('PartyElectoralData');
