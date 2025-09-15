import { REGION_NAMES } from '@communication/domain/type/RegionNames.js';

export interface RegionPrimitives {
  id: number;
  name: REGION_NAMES;
}

export class Region {
  public id: number;
  public name: REGION_NAMES;

  public constructor (primitives: RegionPrimitives) {
    this.id = primitives.id;
    this.name = primitives.name;
  }

  public toPrimitives (): RegionPrimitives {
    return {
      id: this.id,
      name: this.name
    };
  }
}
