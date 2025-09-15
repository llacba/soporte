import { TrimmedString } from '@core/domain/valueObject/TrimmedString.js';
import { Uuid } from '@core/domain/valueObject/Uuid.js';

export interface MessagePrimitives {
  body: string
  id: string
  sendDate: Date
}

export class Message {
  public body: TrimmedString;
  public id: Uuid;
  public sendDate: Date;

  public constructor (primitives: MessagePrimitives) {
    this.id = new Uuid(primitives.id);
    this.sendDate = primitives.sendDate;
    this.body = new TrimmedString(primitives.body);
  }

  public toPrimitives (): MessagePrimitives {
    return {
      body: this.body.toPrimitives(),
      id: this.id.toPrimitives(),
      sendDate: this.sendDate
    };
  }
}
