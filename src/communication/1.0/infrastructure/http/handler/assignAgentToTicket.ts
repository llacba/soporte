import { AssignAgentToTicket } from '@communication/application/AssignAgentToTicket.js';
import { Agent } from '@communication/domain/dto/Agent.js';
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
    const agent = new Agent(request.body.meta.assignee);
    const phone = new Phone(request.body.meta.sender.phone_number as string);
    const { contact_id, department, region } = request.body.meta.sender.custom_attributes;

    const assignAgentToTicket = dependencyContainer.get<AssignAgentToTicket>(AssignAgentToTicket);

    await assignAgentToTicket.run({
      agent,
      conversationId,
      crmContactId: crmContactId,
      customAttributes: {
        contactId: contact_id,
        department,
        region
      },
      inboxId,
      phone
    });

    response.status(HTTP_SUCCESS_CODES.CREATED).send('Ticket created successfully.');
  } catch (error) {
    next(error);
  }
};
