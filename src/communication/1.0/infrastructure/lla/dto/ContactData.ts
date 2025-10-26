import { DNI } from '@communication/domain/valueObject/DNI.js';
import { Email } from '@core/domain/valueObject/Email.js';
import { Phone } from '@core/domain/valueObject/Phone.js';
import { TrimmedString } from '@core/domain/valueObject/TrimmedString.js';

export interface ContactDataPrimitives {
  circuitId: number;
  departmentId: number;
  dni: string;
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  phone: string;
  provinceId: number;
  schoolId: number;
  tableId: number;
}

export class ContactData {
  public circuitId: number;
  public departmentId: number;
  public dni: DNI;
  public email: Email;
  public firstName: TrimmedString;
  public id: number;
  public lastName: TrimmedString;
  public phone: Phone;
  public provinceId: number;
  public schoolId: number;
  public tableId: number;

  public constructor (primitives: ContactDataPrimitives) {
    this.dni = new DNI(primitives.dni);
    this.email = new Email(primitives.email);
    this.firstName = new TrimmedString(primitives.firstName);
    this.id = primitives.id;
    this.lastName = new TrimmedString(primitives.lastName);
    this.phone = new Phone(primitives.phone);
    this.provinceId = primitives.provinceId;
    this.departmentId = primitives.departmentId;
    this.circuitId = primitives.circuitId;
    this.schoolId = primitives.schoolId;
    this.tableId = primitives.tableId;
  }

  public toPrimitives (): ContactDataPrimitives {
    return {
      circuitId: this.circuitId,
      departmentId: this.departmentId,
      dni: this.dni.toPrimitives(),
      email: this.email.toPrimitives(),
      firstName: this.firstName.toPrimitives(),
      id: this.id,
      lastName: this.lastName.toPrimitives(),
      phone: this.phone.toPrimitives(),
      provinceId: this.provinceId,
      schoolId: this.schoolId,
      tableId: this.tableId
    };
  }
}
