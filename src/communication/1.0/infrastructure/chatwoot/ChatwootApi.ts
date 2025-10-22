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

    const chatwootEndpoint = `api/v1/accounts/${ data.accountId }/conversations/${ data.conversationId }/messages`;

    const body = {
      content: message.toPrimitives()
    };

    this.logger.info(JSON.stringify({
      body,
      chatwootEndpoint,
      data
    }, null, 2));

    await axiosInstance.post(chatwootEndpoint, body);
  }

  public async getTeamsList (): Promise<Array<Region>> {
    const axiosInstance = this.axiosConfig();

    const accountId = this.config.getChatwootAccountId();

    const chatwootEndpoint = `api/v1/accounts/${ accountId }/teams`;

    const response = await axiosInstance.get(chatwootEndpoint);

    return response.data;
  }

  public async assignTeamToConversation (conversationId: number, teamId: number): Promise<void> {
    const axiosInstance = this.axiosConfig();

    const accountId = this.config.getChatwootAccountId();

    const chatwootEndpoint = `api/v1/accounts/${ accountId }/conversations/${ conversationId }/assignments`;

    const body = {
      team_id: teamId
    };

    await axiosInstance.post(chatwootEndpoint, body);
  }

  public async updateContactData (crmContactId: number, contact: Contact): Promise<void> {
    const axiosInstance = this.axiosConfig();

    const accountId = this.config.getChatwootAccountId();

    const chatwootEndpoint = `api/v1/accounts/${ accountId }/contacts/${ crmContactId }`;

    const body = {
      custom_attributes: {
        contact_id: contact.id,
        department: contact.department ? contact.department.name.toPrimitives() : null,
        phone_not_found: false,
        region: contact.region ? contact.region.name : null
      }
    };

    await axiosInstance.put(chatwootEndpoint, body);
  }

  public async setPhoneNotFound (crmContactId: number): Promise<void> {
    const axiosInstance = this.axiosConfig();

    const accountId = this.config.getChatwootAccountId();

    const chatwootEndpoint = `api/v1/accounts/${ accountId }/contacts/${ crmContactId }`;

    const body = {
      custom_attributes: {
        phone_not_found: true
      }
    };

    await axiosInstance.put(chatwootEndpoint, body);
  }

  private axiosConfig (): AxiosInstance {
    const chatwootApiKey = this.config.getChatwootApiAdminKey();

    return axios.create({
      baseURL: this.config.getChatwootApiUrl(),
      headers: {
        'api_access_token': chatwootApiKey,
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  }
}
