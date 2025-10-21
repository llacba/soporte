import { Department, DepartmentPrimitives } from '@communication/domain/dto/Department.js';
import { Region, RegionPrimitives } from '@communication/domain/dto/Region.js';
import { DNI } from '@communication/domain/valueObject/DNI.js';
import { Nullable } from '@core/domain/type/Nullable.js';
import { Email } from '@core/domain/valueObject/Email.js';
import { Phone } from '@core/domain/valueObject/Phone.js';
import { TrimmedString } from '@core/domain/valueObject/TrimmedString.js';

export interface ContactPrimitives {
  department: DepartmentPrimitives;
  dni: Nullable<string>;
  email: Nullable<string>;
  firstName: Nullable<string>;
  id: number;
  lastName: Nullable<string>;
  phone: Nullable<string>;
  region: RegionPrimitives;
}

export class Contact {
  public department: Department;
  public dni: Nullable<DNI>;
  public email: Nullable<Email>;
  public firstName: Nullable<TrimmedString>;
  public id: number;
  public lastName: Nullable<TrimmedString>;
  public phone: Nullable<Phone>;
  public region: Region;

  public constructor (primitives: ContactPrimitives) {
    this.department = new Department(primitives.department);
    this.dni = primitives.dni ? new DNI(primitives.dni) : null;
    this.email = primitives.email ? new Email(primitives.email) : null;
    this.firstName = primitives.firstName ? new TrimmedString(primitives.firstName) : null;
    this.id = primitives.id;
    this.lastName = primitives.lastName ? new TrimmedString(primitives.lastName) : null;
    this.phone = primitives.phone ? new Phone(primitives.phone) : null;
    this.region = new Region(primitives.region);
  }

  public toPrimitives (): ContactPrimitives {
    return {
      department: this.department.toPrimitives(),
      dni: this.dni ? this.dni.toPrimitives() : null,
      email: this.email ? this.email.toPrimitives() : null,
      firstName: this.firstName ? this.firstName.toPrimitives() : null,
      id: this.id,
      lastName: this.lastName ? this.lastName.toPrimitives() : null,
      phone: this.phone ? this.phone.toPrimitives() : null,
      region: this.region.toPrimitives()
    };
  }
}
