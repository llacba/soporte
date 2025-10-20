import { SetRegionByDni } from '@communication/application/SetRegionByDni.js';
import { DNI } from '@communication/domain/valueObject/DNI.js';
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
    const message = new DNI(request.body.messages[0].content as string);
    const phone = new Phone(request.body.meta.sender.phone_number as string);
    const { contact_id, department, region } = request.body.meta.sender.custom_attributes;

    const setRegionByDni = dependencyContainer.get<SetRegionByDni>(SetRegionByDni);

    await setRegionByDni.run({
      conversationId,
      crmContactId,
      customAttributes: {
        contactId: contact_id,
        department,
        region
      },
      dni: message,
      inboxId,
      phone
    });

    response.status(HTTP_SUCCESS_CODES.OK).send(`DNI ${ message } processed successfully.`);
  } catch (error) {
    next(error);
  }
};
