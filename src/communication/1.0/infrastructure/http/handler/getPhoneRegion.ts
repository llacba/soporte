import { GetPhoneRegion } from '@communication/application/GetPhoneRegion.js';
import { HTTP_SUCCESS_CODES } from '@core/domain/type/HttpCodes.js';
import { Phone } from '@core/domain/valueObject/Phone.js';
import { dependencyContainer } from '@src/dependencyContainer.js';
import { NextFunction, Request, Response } from 'express';

export default async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const { phone_number } = request.body.meta.sender;
    const phoneNumber = new Phone(phone_number as string);

    const getPhoneRegion = dependencyContainer.get<GetPhoneRegion>(GetPhoneRegion);

    await getPhoneRegion.run(phoneNumber);

    response.status(HTTP_SUCCESS_CODES.OK).send('Phone region set successfully.');
  } catch (error) {
    next(error);
  }
};
