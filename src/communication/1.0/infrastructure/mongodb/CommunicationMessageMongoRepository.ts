import { CommunicationMessageRepository } from '@communication/domain/CommunicationMessageRepository.js';
import { Message, MessagePrimitives } from '@communication/domain/entity/Message.js';
import { Config } from '@core/Config.js';
import { Logger, LOGGER } from '@core/domain/Logger.js';
import { DateRange } from '@core/domain/type/DateRange.js';
import { Nullable } from '@core/domain/type/Nullable.js';
import { Uuid } from '@core/domain/valueObject/Uuid.js';
import { MongoConnection } from '@core/infrastructure/MongoConnection.js';
import { inject, injectable } from 'inversify';
import * as mongodb from 'mongodb';

@injectable()
export class CommunicationMessageMongoRepository implements CommunicationMessageRepository {
  public constructor (
    @inject(Config) private config: Config,
    @inject(LOGGER) private logger: Logger,
    @inject(MongoConnection) private mongoConnection: MongoConnection
  ) {}

  public async findAll (): Promise<Array<Message>> {
    const collection = await this.getCollection();

    this.logger.debug('Searching all messages...');

    const messageDocuments = await collection.find().toArray() as unknown as Array<MessagePrimitives>;

    const messages = messageDocuments.map((messageDocument: MessagePrimitives) => {
      return new Message(messageDocument);
    });

    this.logger.info(`Found ${ messages.length } messages.`);

    return messages;
  }

  public async findByDateRange ({ fromDate, toDate }: DateRange): Promise<Array<Message>> {
    const collection = await this.getCollection();

    const fromDateString = `${ fromDate.getFullYear() }/${ fromDate.getMonth() }/${ fromDate.getDate() }`;
    const toDateString = `${ toDate.getFullYear() }/${ toDate.getMonth() }/${ toDate.getDate() }`;

    this.logger.debug(`Searching Messages sent between ${ fromDateString } and ${ toDateString }...`);

    const messageDocumentList = (await collection.find({ sendDate: {
      $gte: fromDateString,
      $lt: toDateString
    } })) as unknown as Array<MessagePrimitives>;

    const messages = messageDocumentList.map((messageDocument: MessagePrimitives) => {
      const message = new Message(messageDocument);

      return message;
    });

    return messages;
  }

  public async findById (messageId: Uuid): Promise<Nullable<Message>> {
    const collection = await this.getCollection();

    this.logger.debug(`Searching message by id ${ messageId }...`);

    const messageDocument = (await collection.findOne({ id: messageId.toPrimitives() })) as unknown as MessagePrimitives;

    if (!messageDocument) {
      this.logger.info('Message not found.');

      return null;
    }

    const message = new Message(messageDocument);

    this.logger.info(`Message found with id ${ message.id.toString() }.`);

    return message;
  }

  public async save (message: Message): Promise<void> {
    const collection = await this.getCollection();
    const messageId = message.id.toPrimitives();

    this.logger.debug(`Saving message ${ messageId }...`);

    const result: mongodb.UpdateResult = await collection.updateOne(
      { id: messageId },
      {
        $set: { ...message.toPrimitives() as object, updated_at: new Date().getTime() },
        $setOnInsert: { created_at: new Date().getTime() }
      },
      { upsert: true }
    );

    if (result.acknowledged) {
      this.logger.info(`Message ${ messageId } saved successfully.`);
    }
  }

  private async getCollection (): Promise<mongodb.Collection> {
    const database = await this.mongoConnection.getDatabase();
    const collection = database.collection('messages');

    return collection;
  }
}
