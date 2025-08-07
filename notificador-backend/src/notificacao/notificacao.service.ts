import { Injectable } from '@nestjs/common';
import { CriarNotificacaoDto } from './dto/notificacao.dto';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';

@Injectable()
export class NotificacaoService {
  private readonly filaEntrada = 'fila.notificacao.entrada.rick';

  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async enviarNotificacao(dto: CriarNotificacaoDto): Promise<void> {
    await this.rabbitMQService.publishToQueue(this.filaEntrada, dto);
    console.log('Mensagem recebida para envio:', dto);
  }
}
