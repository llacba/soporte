import { StartSupport } from '@communication/application/StartSupport.js';
import { HTTP_SUCCESS_CODES } from '@core/domain/type/HttpCodes.js';
import { Phone } from '@core/domain/valueObject/Phone.js';
import { dependencyContainer } from '@src/dependencyContainer.js';
import { NextFunction, Request, Response } from 'express';

export default async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const { id, inbox_id } = request.body;

    const inboxId = inbox_id as number;
    const crmContactId = id as number;
    const conversationId = request.body.messages[0].conversation_id as number;
    const phone = new Phone(request.body.meta.sender.phone_number as string);
    const { contact_id, department } = request.body.meta.sender.custom_attributes;

    const startSupport = dependencyContainer.get<StartSupport>(StartSupport);

    await startSupport.run({
      conversationId,
      crmContactId,
      customAttributes: {
        contactId: contact_id,
        department
      },
      inboxId,
      phone
    });

    response.status(HTTP_SUCCESS_CODES.OK).send(`Support request started successfully for phone ${ phone }.`);
  } catch (error) {
    next(error);
  }
};
