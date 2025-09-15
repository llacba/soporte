import { TrimmedString } from '@core/domain/valueObject/TrimmedString.js';

export interface WhatsAppTemplateDataPrimitives {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components: Array<any>
  name: string
}

export class WhatsAppTemplateData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public components: Array<any>;
  public name: TrimmedString;

  public constructor (primitives: WhatsAppTemplateDataPrimitives) {
    this.components = primitives.components;
    this.name = new TrimmedString(primitives.name);
  }

  public toPrimitives (): WhatsAppTemplateDataPrimitives {
    return {
      components: this.components,
      name: this.name.toPrimitives()
    };
  }
}
