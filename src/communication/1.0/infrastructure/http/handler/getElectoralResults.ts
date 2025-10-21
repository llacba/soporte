import { GetElectoralResults } from '@communication/application/GetElectoralResults.js';
import { HTTP_SUCCESS_CODES } from '@core/domain/type/HttpCodes.js';
import { dependencyContainer } from '@src/dependencyContainer.js';
import { NextFunction, Request, Response } from 'express';

export default async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const getElectoralResults = dependencyContainer.get<GetElectoralResults>(GetElectoralResults);

    await getElectoralResults.run();

    response.status(HTTP_SUCCESS_CODES.OK).send('All electoral tables processed successfully.');
  } catch (error) {
    next(error);
  }
};
