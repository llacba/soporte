// import { CommunicationController } from '@communication/application/CommunicationController.js';
// import { Config } from '@core/Config.js';
// import { HttpRouter } from '@core/domain/HttpRouter.js';
// import { Logger, LOGGER } from '@core/domain/Logger.js';
// import { NextFunction, Request, Response, Router } from 'express';
// import { inject, injectable } from 'inversify';

// @injectable()
// export class CommunicationRouterExpress implements HttpRouter {
//   private appName: string;
//   private basePath: string;
//   private router: Router;

//   public constructor (
//     @inject(Config) private config: Config,
//     @inject(LOGGER) private logger: Logger,
//     @inject(CommunicationController) private communicationController: CommunicationController
//   ) {
//     this.router = Router();
//     this.appName = config.getApiName();
//     this.basePath = 'communication';
//   }

//   public getBasePath (): string {
//     return this.basePath;
//   }

//   public async registerRoutes (): Promise<Router> {
//     this.router.get('/', async (request: Request, response: Response, _next: NextFunction) => {
//       try {
//         response.status(200).send(`${ this.appName } - Communication home page`);
//       } catch (error) {
//         _next(error);
//       }
//     });

//     this.router.get(
//       '/whatsapp/webhook',
//       async (request: Request, response: Response, _next: NextFunction) => {
//         try {
//           const mode = 'subscribe';
//           const token = '3becf7c989100dad23c00c93b5b4f475e0c04933';

//           const hubMode = request.query['hub.mode'];
//           const hubChallenge = request.query['hub.challenge'];
//           const hubToken = request.query['hub.verify_token'];

//           const isModeCorrect = hubMode === mode;
//           const isTokenCorrect = hubToken === token;

//           this.logger.debug('webhook payload', [request.body]);

//           if (isModeCorrect && isTokenCorrect) {
//             response.status(200).send(hubChallenge);
//           }

//           response.status(400).send('Payload incorrect');
//         } catch (error) {
//           _next(error);
//         }
//       }
//     );

//     this.router.post(
//       '/whatsapp/webhook',
//       async (request: Request, response: Response, _next: NextFunction) => {
//         try {
//           const payload = request.body;

//           await this.communicationController.processIncomingMessage(payload);

//           response.sendStatus(200);
//         } catch (error) {
//           _next(error);
//         }
//       }
//     );

//     this.router.post(
//       '/whatsapp/template/send',
//       async (request: Request, response: Response, _next: NextFunction) => {
//         try {
//           const targetPhoneNumber = request.body.targetPhoneNumber;
//           const templateData = request.body.templateData;

//           await this.communicationController.sendWhatsAppTemplate({
//             targetPhoneNumber,
//             templateData
//           });

//           response.status(200).send('Message sent successfully.');
//         } catch (error) {
//           _next(error);
//         }
//       }
//     );

//     return this.router;
//   }
// }
