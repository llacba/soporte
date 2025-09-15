import { SendMessageTemplate } from '@communication/infrastructure/whatsapp/SendMessageTemplate.js';
import { WhatsAppData } from '@communication/infrastructure/whatsapp/WhatsAppData.js';
import { HTTP_SUCCESS_CODES } from '@core/domain/type/HttpCodes.js';
import { dependencyContainer } from '@src/dependencyContainer.js';
import { NextFunction, Request, Response } from 'express';

export default async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const { phone_number } = request.body.meta.sender;

    const sendMessageTemplate = dependencyContainer.get<SendMessageTemplate>(SendMessageTemplate);

    const whatsAppData = new WhatsAppData({
      targetPhoneNumber: phone_number as string,
      templateData: {
        components: [],
        name: 'event_options'
      }
    });

    await sendMessageTemplate.run(whatsAppData);

    response.status(HTTP_SUCCESS_CODES.OK).send('Message sent successfully.');
  } catch (error) {
    next(error);
  }
};
