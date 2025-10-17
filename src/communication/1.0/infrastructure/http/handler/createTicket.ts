import { HTTP_SUCCESS_CODES } from '@core/domain/type/HttpCodes.js';
import { Phone } from '@core/domain/valueObject/Phone.js';
import { NextFunction, Request, Response } from 'express';

export default async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const { id, inbox_id } = request.body;

    const inboxId = inbox_id as number;
    const contactId = id as number;
    const conversationId = request.body.messages[0].conversation_id as number;
    const phone = new Phone(request.body.meta.sender.phone_number as string);

    // const createTicket = dependencyContainer.get<CreateTicket>(CreateTicket);

    // await createTicket.run({
    //   contactId,
    //   conversationId,
    //   inboxId,
    //   phone
    // });

    response.status(HTTP_SUCCESS_CODES.OK).json({
      contactId,
      conversationId,
      inboxId,
      phone
    });
    // response.status(HTTP_SUCCESS_CODES.OK).send('Ticket created successfully.');
  } catch (error) {
    next(error);
  }
};
