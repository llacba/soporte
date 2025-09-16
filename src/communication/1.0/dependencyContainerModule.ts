import { AssignPhoneRegion } from '@communication/application/AssignPhoneRegion.js';
import { Subscribe } from '@communication/application/Subscribe.js';
import { CRM, Crm } from '@communication/domain/Crm.js';
import { PARTY_ELECTORAL_DATA, PartyElectoralData } from '@communication/domain/PartyElectoralData.js';
import { ChatwootApi } from '@communication/infrastructure/chatwoot/ChatwootApi.js';
import { CrmChatwoot } from '@communication/infrastructure/chatwoot/CrmChatwoot.js';
import { LLAApi } from '@communication/infrastructure/lla/LLAApi.js';
import { PartyElectoralDataLLA } from '@communication/infrastructure/lla/PartyElectoralDataLLA.js';
import { SendMessageTemplate } from '@communication/infrastructure/whatsapp/SendMessageTemplate.js';
import { ContainerModule, ContainerModuleLoadOptions } from 'inversify';

export default new ContainerModule((options: ContainerModuleLoadOptions) => {
  options.bind<SendMessageTemplate>(SendMessageTemplate).toSelf();
  options.bind<ChatwootApi>(ChatwootApi).toSelf().inSingletonScope();
  options.bind<PartyElectoralData>(PARTY_ELECTORAL_DATA).to(PartyElectoralDataLLA);
  options.bind<LLAApi>(LLAApi).toSelf().inSingletonScope();
  options.bind<Crm>(CRM).to(CrmChatwoot);
  options.bind<Subscribe>(Subscribe).toSelf();
  options.bind<AssignPhoneRegion>(AssignPhoneRegion).toSelf();
});
