import { Subscribe } from '@communication/application/Subscribe.js';
import { SendMessageTemplate } from '@communication/infrastructure/whatsapp/SendMessageTemplate.js';
import { ContainerModule, ContainerModuleLoadOptions } from 'inversify';

export default new ContainerModule((options: ContainerModuleLoadOptions) => {
  options.bind<SendMessageTemplate>(SendMessageTemplate).toSelf();
  options.bind<Subscribe>(Subscribe).toSelf();
});
