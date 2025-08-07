import { Module } from '@nestjs/common';
import { NotificacaoController } from './notificacao.controller';
import { NotificacaoService } from './notificacao.service';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';
import { ProcessadorService } from './processador.service';

@Module({
  imports: [RabbitMQModule],
  controllers: [NotificacaoController],
  providers: [NotificacaoService, ProcessadorService],
  exports: [NotificacaoService, ProcessadorService],
})
export class NotificacaoModule {}
