import { TrimmedString } from '@core/domain/valueObject/TrimmedString.js';

export interface DepartmentPrimitives {
  id: number;
  name: string;
}

export class Department {
  public id: number;
  public name: TrimmedString;

  public constructor (primitives: DepartmentPrimitives) {
    this.id = primitives.id;
    this.name = new TrimmedString(primitives.name);
  }

  public toPrimitives (): DepartmentPrimitives {
    return {
      id: this.id,
      name: this.name.toPrimitives()
    };
  }
}
