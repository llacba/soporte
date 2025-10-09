import { SendEventsList } from '@communication/application/SendEventsList.js';
import { HTTP_SUCCESS_CODES } from '@core/domain/type/HttpCodes.js';
import { Phone } from '@core/domain/valueObject/Phone.js';
import { dependencyContainer } from '@src/dependencyContainer.js';
import { NextFunction, Request, Response } from 'express';

export default async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const { phone_number } = request.body.meta.sender;

    const sendEventsList = dependencyContainer.get<SendEventsList>(SendEventsList);

    await sendEventsList.run(new Phone(phone_number));

    response.status(HTTP_SUCCESS_CODES.OK).send('Events list sent successfully.');
  } catch (error) {
    next(error);
  }
};
