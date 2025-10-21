import { ReopenTicket } from '@communication/application/ReopenTicket.js';
import { Agent } from '@communication/domain/dto/Agent.js';
import { HTTP_SUCCESS_CODES } from '@core/domain/type/HttpCodes.js';
import { dependencyContainer } from '@src/dependencyContainer.js';
import { NextFunction, Request, Response } from 'express';

export default async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const conversationId = request.body.messages[0].conversation_id as number;
    const agent = request.body.meta.assignee ? new Agent(request.body.meta.assignee) : null;

    const reopenTicket = dependencyContainer.get<ReopenTicket>(ReopenTicket);

    await reopenTicket.run(conversationId, agent);

    response.status(HTTP_SUCCESS_CODES.OK).send('Ticket reopened successfully.');
  } catch (error) {
    next(error);
  }
};
