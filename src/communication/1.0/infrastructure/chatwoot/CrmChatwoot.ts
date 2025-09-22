import { Crm } from '@communication/domain/Crm.js';
import { CrmSendMessageData } from '@communication/domain/dto/CrmSendMessageData.js';
import { Region } from '@communication/domain/dto/Region.js';
import { ChatwootApi } from '@communication/infrastructure/chatwoot/ChatwootApi.js';
import { Config } from '@core/Config.js';
import { NotFound } from '@core/domain/error/NotFound.js';
import { Logger, LOGGER } from '@core/domain/Logger.js';
import { TrimmedString } from '@core/domain/valueObject/TrimmedString.js';
import { inject, injectable } from 'inversify';

export interface ChatWootData {
  contactId: string;
  conversationId: string;
  inboxId: string;
}

@injectable()
export class CrmChatwoot implements Crm {
  public constructor (
    @inject(Config) private config: Config,
    @inject(LOGGER) private logger: Logger,
    @inject(ChatwootApi) private chatwootApi: ChatwootApi
  ) {}

  public async askForDNI (data: CrmSendMessageData): Promise<void> {
    const message = new TrimmedString('No encontramos tu número de teléfono. Por favor, indícanos tu región enviando tu DNI.');

    await this.chatwootApi.sendMessage(data, message);
  }

  public async getTeamByName (name: TrimmedString): Promise<Region> {
    const teams = await this.chatwootApi.getTeamsList();

    const team = teams.find(team => team.name === name.toPrimitives());

    if (!team) {
      throw new NotFound(`Team with name ${ name.toPrimitives() }`);
    }

    return team;
  }

  public async assignTeamToConversation (conversationId: number, region: number): Promise<void> {
    await this.chatwootApi.assignTeamToConversation(conversationId, region);
  }
}
