import { WhatsAppTemplateData, WhatsAppTemplateDataPrimitives } from '@communication/infrastructure/whatsapp/WhatsAppTemplateData.js';
import { Phone } from '@core/domain/valueObject/Phone.js';

export interface WhatsAppDataPrimitives {
  targetPhoneNumber: string
  templateData: WhatsAppTemplateDataPrimitives
}

export class WhatsAppData {
  public targetPhoneNumber: Phone;
  public templateData: WhatsAppTemplateData;

  public constructor (primitives: WhatsAppDataPrimitives) {
    this.targetPhoneNumber = new Phone(primitives.targetPhoneNumber);
    this.templateData = new WhatsAppTemplateData(primitives.templateData);
  }

  public toPrimitives (): WhatsAppDataPrimitives {
    return {
      targetPhoneNumber: this.targetPhoneNumber.toPrimitives(),
      templateData: this.templateData.toPrimitives()
    };
  }
}
