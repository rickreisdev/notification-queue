/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { RabbitMQService } from './rabbitmq.service';
import * as amqp from 'amqplib';

jest.mock('amqplib');

describe('RabbitMQService', () => {
  let service: RabbitMQService;
  let mockChannel: any;
  let mockConfigService: any;

  beforeEach(async () => {
    mockChannel = {
      assertQueue: jest.fn(),
      sendToQueue: jest.fn(),
    };
    (amqp.connect as jest.Mock).mockResolvedValue({
      createChannel: jest.fn().mockResolvedValue(mockChannel),
    });

    mockConfigService = {
      get: jest.fn().mockReturnValue('amqp://test-url'),
    };

    service = new RabbitMQService(mockConfigService);
    await service.connect();
  });

  it('deve publicar mensagem na fila com os argumentos corretos', async () => {
    const queue = 'fila.notificacao.entrada.teste';
    const message = { mensagemId: '123', conteudoMensagem: 'Olá' };

    await service.publishToQueue(queue, message);

    expect(mockChannel.assertQueue).toHaveBeenCalledWith(queue, {
      durable: true,
    });
    expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
      queue,
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    );
  });
});
