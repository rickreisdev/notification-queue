/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

interface MensagemDTO {
  mensagemId: string;
  conteudoMensagem: string;
}

@Injectable()
export class ProcessadorService implements OnModuleInit {
  private readonly filaEntrada = 'fila.notificacao.entrada.rick';
  private readonly filaStatus = 'fila.notificacao.status.rick';
  private readonly statusMap = new Map<string, string>(); // Armazena status em memória

  constructor(private readonly rabbitMQ: RabbitMQService) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async onModuleInit() {
    this.rabbitMQ.consumeQueue(this.filaEntrada, async (msg) => {
      const data: MensagemDTO = JSON.parse(msg.content.toString());

      // Simula processamento assíncrono (1-2s)
      await new Promise((res) => setTimeout(res, 1000 + Math.random() * 1000));

      // 20% de chance de falha
      const sucesso = Math.floor(Math.random() * 10) + 1 > 2;

      const status = sucesso ? 'PROCESSADO_SUCESSO' : 'FALHA_PROCESSAMENTO';

      // Armazena em memória
      this.statusMap.set(data.mensagemId, status);

      // Publica na fila de status
      await this.rabbitMQ.publishToQueue(this.filaStatus, {
        mensagemId: data.mensagemId,
        status,
      });

      console.log(`[Processador] ${data.mensagemId} => ${status}`);
    });
  }

  getStatus(mensagemId: string): string | null {
    return this.statusMap.get(mensagemId) || null;
  }
}
