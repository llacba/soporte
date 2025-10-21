import { SendSupportRequestConfirmation } from '@communication/application/SendSupportRequestConfirmation.js';
import { HTTP_SUCCESS_CODES } from '@core/domain/type/HttpCodes.js';
import { Phone } from '@core/domain/valueObject/Phone.js';
import { dependencyContainer } from '@src/dependencyContainer.js';
import { NextFunction, Request, Response } from 'express';

export default async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const { phone_number } = request.body.meta.sender;
    const phone = new Phone(phone_number);

    const sendSupportRequestConfirmation = dependencyContainer.get<SendSupportRequestConfirmation>(SendSupportRequestConfirmation);

    await sendSupportRequestConfirmation.run(phone);

    response.status(HTTP_SUCCESS_CODES.OK).send(`Support confirmation message sent successfully to phone ${ phone }.`);
  } catch (error) {
    next(error);
  }
};
