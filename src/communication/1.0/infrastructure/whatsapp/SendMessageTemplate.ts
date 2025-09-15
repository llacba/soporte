import { WhatsAppBody } from '@communication/infrastructure/whatsapp/WhatsAppBody.js';
import { WhatsAppData } from '@communication/infrastructure/whatsapp/WhatsAppData.js';
import { Config } from '@core/Config.js';
import { ServerError } from '@core/domain/error/ServerError.js';
import { Logger, LOGGER } from '@core/domain/Logger.js';
import { HTTP_SUCCESS_CODES } from '@core/domain/type/HttpCodes.js';
import { Phone } from '@core/domain/valueObject/Phone.js';
import axios from 'axios';
import { inject, injectable } from 'inversify';

@injectable()
export class SendMessageTemplate {
  public constructor (
    @inject(Config) private config: Config,
    @inject(LOGGER) private logger: Logger
  ) {}

  public async run (data: WhatsAppData): Promise<void> {
    const metaGraphApiUrl = this.config.getMetaGraphApiUrl();
    const metaGraphApiVersion = this.config.getMetaGraphApiVersion();
    const fromPhoneNumberId = this.config.getMetaWhatsAppPhoneId();
    const token = `Bearer ${ this.config.getMetaWhatsAppAdminToken() }`;

    const metaApiUrl = `${ metaGraphApiUrl }/${ metaGraphApiVersion }/${ fromPhoneNumberId }/messages`;
    const languageCode = this.config.getMetaWhatsAppEncoding();

    const targetPhoneNumber = this.getRecipientPhone(data.targetPhoneNumber);

    const body: WhatsAppBody = {
      'messaging_product': 'whatsapp',
      'template': {
        'language': {
          'code': languageCode
        },
        'name': data.templateData.name.toPrimitives()
      },
      'to': targetPhoneNumber.toPrimitives().replace('+', ''),
      'type': 'template'
    };

    if (data.templateData.components.length) {
      body.template.components = data.templateData.components;
    }

    const response = await axios.post(metaApiUrl,
      body,
      {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

    this.logger.debug('WhatsApp response', [response.data]);

    if (response.status === HTTP_SUCCESS_CODES.OK) {
      this.logger.info(`WhatsApp to ${ targetPhoneNumber.toPrimitives() } sent successfully.`);

      return;
    }

    throw new ServerError('Error sending WhatsApp message template.');
  }

  private getRecipientPhone (phone: Phone): Phone {
    const getDebugRecipientEnabled = this.config.getDebugRecipientEnabled();

    if (!getDebugRecipientEnabled) {
      return phone;
    }

    const debugRecipient = this.config.getDebugRecipient();

    if (!debugRecipient) {
      throw new ServerError('No recipient or debug recipient found.');
    }

    return debugRecipient.phone;
  }
}
