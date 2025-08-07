/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const url = this.configService.get<string>('RABBITMQ_URL');

    this.connection = await amqp.connect(url);
    this.channel = await this.connection.createChannel();
    console.log('[RabbitMQ] Conectado com sucesso.');
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }

  async publishToQueue(queue: string, message: any) {
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    console.log(`[RabbitMQ] Mensagem publicada na fila ${queue}:`, message);
  }

  async consumeQueue(
    queue: string,
    onMessage: (msg: amqp.ConsumeMessage) => Promise<void>,
  ) {
    await this.connect();
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.consume(queue, async (msg) => {
      if (msg) {
        try {
          await onMessage(msg);
          this.channel.ack(msg);
        } catch (err) {
          this.channel.nack(msg, false, false);
          console.error(err);
          // descarta mensagem em caso de erro
        }
      }
    });
  }

  async connect() {
    const url = this.configService.get<string>('RABBITMQ_URL');

    if (!this.connection) {
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
    }
  }
}
