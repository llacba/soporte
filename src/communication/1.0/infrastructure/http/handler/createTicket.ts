import { CreateTicket } from '@communication/application/CreateTicket.js';
import { EVENTS } from '@communication/domain/type/Events.js';
import { HTTP_SUCCESS_CODES } from '@core/domain/type/HttpCodes.js';
import { Phone } from '@core/domain/valueObject/Phone.js';
import { dependencyContainer } from '@src/dependencyContainer.js';
import { NextFunction, Request, Response } from 'express';

export default async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const { inbox_id } = request.body;

    const inboxId = inbox_id as number;
    const crmContactId = request.body.meta.sender.id as number;
    const conversationId = request.body.messages[0].conversation_id as number;
    const message = request.body.messages[0].content as EVENTS;
    const phone = new Phone(request.body.meta.sender.phone_number as string);
    const { contact_id, department, region } = request.body.meta.sender.custom_attributes;

    const createTicket = dependencyContainer.get<CreateTicket>(CreateTicket);

    await createTicket.run({
      conversationId,
      crmContactId: crmContactId,
      customAttributes: {
        contactId: contact_id,
        department,
        region
      },
      inboxId,
      message,
      phone
    });

    response.status(HTTP_SUCCESS_CODES.OK).send('Ticket created successfully.');
  } catch (error) {
    next(error);
  }
};
