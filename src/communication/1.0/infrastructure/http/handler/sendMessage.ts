import { SendMessageTemplate } from '@communication/infrastructure/whatsapp/SendMessageTemplate.js';
import { WhatsAppData } from '@communication/infrastructure/whatsapp/WhatsAppData.js';
import { HTTP_SUCCESS_CODES } from '@core/domain/type/HttpCodes.js';
import { dependencyContainer } from '@src/dependencyContainer.js';
import { NextFunction, Request, Response } from 'express';

export default async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const { targetPhoneNumber, templateData } = request.body;

    const sendMessageTemplate = dependencyContainer.get<SendMessageTemplate>(SendMessageTemplate);

    const whatsAppData = new WhatsAppData({
      targetPhoneNumber,
      templateData
    });

    await sendMessageTemplate.run(whatsAppData);

    response.status(HTTP_SUCCESS_CODES.OK).send('Message sent successfully.');
  } catch (error) {
    next(error);
  }
};
