import { ResolveTicket } from '@communication/application/ResolveTicket.js';
import { HTTP_SUCCESS_CODES } from '@core/domain/type/HttpCodes.js';
import { dependencyContainer } from '@src/dependencyContainer.js';
import { NextFunction, Request, Response } from 'express';

export default async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const conversationId = request.body.messages[0].conversation_id as number;

    const resolveTicket = dependencyContainer.get<ResolveTicket>(ResolveTicket);

    await resolveTicket.run(conversationId);

    response.status(HTTP_SUCCESS_CODES.OK).send('Ticket resolved successfully.');
  } catch (error) {
    next(error);
  }
};
