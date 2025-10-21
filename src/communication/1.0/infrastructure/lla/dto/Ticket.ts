import { TICKET_STATUSES } from '@communication/domain/type/TicketStatus.js';
import { TrimmedString } from '@core/domain/valueObject/TrimmedString.js';

export interface TicketPrimitives {
  categoryId: number;
  createdAt: Date;
  crmContactId?: number;
  details: string;
  id?: number;
  status: TICKET_STATUSES;
  updatedAt: Date;
  userId: number;
}

export class Ticket {
  public categoryId: number;
  public createdAt: Date;
  public crmContactId?: number;
  public details: TrimmedString;
  public id?: number;
  public status: TICKET_STATUSES;
  public updatedAt: Date;
  public userId: number;

  public constructor (primitives: TicketPrimitives) {
    this.categoryId = primitives.categoryId;
    this.createdAt = primitives.createdAt;
    this.details = new TrimmedString(primitives.details);
    this.id = primitives.id;
    this.status = primitives.status;
    this.updatedAt = primitives.updatedAt;
    this.userId = primitives.userId;
    this.crmContactId = primitives.crmContactId ?? undefined;
  }

  public toPrimitives (): TicketPrimitives {
    return {
      categoryId: this.categoryId,
      createdAt: this.createdAt,
      crmContactId: this.crmContactId ?? undefined,
      details: this.details.toPrimitives(),
      id: this.id,
      status: this.status,
      updatedAt: this.updatedAt,
      userId: this.userId
    };
  }
}
