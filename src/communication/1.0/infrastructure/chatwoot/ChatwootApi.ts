import { CrmSendMessageData } from '@communication/domain/dto/CrmSendMessageData.js';
import { Region } from '@communication/domain/dto/Region.js';
import { Config } from '@core/Config.js';
import { LOGGER, Logger } from '@core/domain/Logger.js';
import { TrimmedString } from '@core/domain/valueObject/TrimmedString.js';
import axios, { AxiosInstance } from 'axios';
import { inject, injectable } from 'inversify';

@injectable()
export class ChatwootApi {
  public constructor (
    @inject(Config) private config: Config,
    @inject(LOGGER) private logger: Logger
  ) {}

  public async sendMessage (data: CrmSendMessageData, message: TrimmedString): Promise<void> {
    const axiosInstance = this.axiosConfig();

    const chatwootEndpoint = `inboxes/${ data.inboxId }/contacts/${ data.contactId }/conversations/${ data.conversationId }/messages`;

    const body = {
      content: message.toPrimitives()
    };

    await axiosInstance.post(chatwootEndpoint, body);
  }

  public async getTeamsList (): Promise<Array<Region>> {
    const axiosInstance = this.axiosConfig();

    const accountId = this.config.getChatwootAccountId();

    const chatwootEndpoint = `accounts/${ accountId }/teams`;

    return await axiosInstance.get(chatwootEndpoint);
  }

  public async assignTeamToConversation (conversationId: number, teamId: number): Promise<void> {
    const axiosInstance = this.axiosConfig();

    const accountId = this.config.getChatwootAccountId();

    const chatwootEndpoint = `accounts/${ accountId }/conversations/${ conversationId }/assign_team`;

    const body = {
      team_id: teamId
    };

    await axiosInstance.post(chatwootEndpoint, body);
  }

  private axiosConfig (): AxiosInstance {
    const chatwootApiKey = this.config.getChatwootApiAdminKey();

    return axios.create({
      baseURL: this.config.getChatwootApiUrl(),
      headers: {
        'api_access_token': chatwootApiKey,
        'Content-Type': 'application/json'
      }
    });
  }
}
