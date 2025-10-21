import { Contact } from '@communication/domain/dto/Contact.js';
import { CrmPayload } from '@communication/domain/dto/CrmPayload.js';
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

  public async sendMessage (data: CrmPayload, message: TrimmedString): Promise<void> {
    const axiosInstance = this.axiosConfig();

    const chatwootEndpoint = `inboxes/${ data.inboxId }/contacts/${ data.crmContactId }/conversations/${ data.conversationId }/messages`;

    const body = {
      content: message.toPrimitives()
    };

    await axiosInstance.post(chatwootEndpoint, body);
  }

  public async getTeamsList (): Promise<Array<Region>> {
    const axiosInstance = this.axiosConfig();

    const accountId = this.config.getChatwootAccountId();

    const chatwootEndpoint = `accounts/${ accountId }/teams`;

    const response = await axiosInstance.get(chatwootEndpoint);

    return response.data;
  }

  public async assignTeamToConversation (conversationId: number, teamId: number): Promise<void> {
    const axiosInstance = this.axiosConfig();

    const accountId = this.config.getChatwootAccountId();

    const chatwootEndpoint = `accounts/${ accountId }/conversations/${ conversationId }/assignments`;

    const body = {
      team_id: teamId
    };

    await axiosInstance.post(chatwootEndpoint, body);
  }

  public async updateContactData (contactId: number, contact: Contact): Promise<void> {
    const axiosInstance = this.axiosConfig();

    const accountId = this.config.getChatwootAccountId();

    const chatwootEndpoint = `accounts/${ accountId }/contacts/${ contactId }`;

    const body = JSON.stringify({
      custom_attributes: {
        contact_id: contact.id,
        department: contact.department ? contact.department.name.toPrimitives() : null,
        region: contact.region ? contact.region.name : null
      }
    });

    const response = await axiosInstance.put(chatwootEndpoint, body, {
      headers: {
        ...(axiosInstance.defaults.headers as Record<string, string>),
        'Content-Length': Buffer.byteLength(body).toString()
      },
      transformRequest: [(d): typeof d => d]
    });

    this.logger.info(JSON.stringify(response.data));
  }

  private axiosConfig (): AxiosInstance {
    const chatwootApiKey = this.config.getChatwootApiAdminKey();

    return axios.create({
      baseURL: this.config.getChatwootApiUrl(),
      headers: {
        'Accept': 'application/json',
        'api_access_token': chatwootApiKey,
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  }
}
