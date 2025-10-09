import { CRM, Crm } from '@communication/domain/Crm.js';
import { MESSAGE_SENDER, MessageSender } from '@communication/domain/MessageSender.js';
import { PARTY_ELECTORAL_DATA, PartyElectoralData } from '@communication/domain/PartyElectoralData.js';
import { Config } from '@core/Config.js';
import { LOGGER, Logger } from '@core/domain/Logger.js';
import { Phone } from '@core/domain/valueObject/Phone.js';
import { inject } from 'inversify';

export class SendSupportRequestConfirmation {
  public constructor (
    @inject(Config) private config: Config,
    @inject(LOGGER) private logger: Logger,
    @inject(CRM) private crm: Crm,
    @inject(MESSAGE_SENDER) private messageSender: MessageSender,
    @inject(PARTY_ELECTORAL_DATA) private partyElectoralData: PartyElectoralData
  ) {}

  public async run (phone: Phone): Promise<void> {
    await this.messageSender.sendSupportRequestConfirmation(phone);
  }
}
