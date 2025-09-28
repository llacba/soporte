import { StartSupport } from '@communication/application/StartSupport.js';
import { HTTP_SUCCESS_CODES } from '@core/domain/type/HttpCodes.js';
import { Phone } from '@core/domain/valueObject/Phone.js';
import { dependencyContainer } from '@src/dependencyContainer.js';
import { NextFunction, Request, Response } from 'express';

export default async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const { id, inbox_id } = request.body;

    const inboxId = inbox_id as number;
    const contactId = id as number;
    const conversationId = request.body.messages[0].conversation_id as number;
    const phone = new Phone(request.body.meta.sender.phone_number as string);

    const startSupport = dependencyContainer.get<StartSupport>(StartSupport);

    await startSupport.run({
      contactId,
      conversationId,
      inboxId,
      phone
    });

    response.status(HTTP_SUCCESS_CODES.OK).send('Support request started successfully.');
  } catch (error) {
    next(error);
  }
};
