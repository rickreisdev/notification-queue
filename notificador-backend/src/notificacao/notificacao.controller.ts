import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CriarNotificacaoDto } from './dto/notificacao.dto';
import { NotificacaoService } from './notificacao.service';
import { ProcessadorService } from './processador.service';

@Controller('api/notificar')
export class NotificacaoController {
  constructor(
    private readonly notificacaoService: NotificacaoService,
    private readonly processadorService: ProcessadorService,
  ) {}

  @Post()
  @HttpCode(202) // HTTP 202 Accepted
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async notificar(@Body() dto: CriarNotificacaoDto) {
    await this.notificacaoService.enviarNotificacao(dto);
    return {
      mensagem: 'Notificação recebida para processamento',
      mensagemId: dto.mensagemId,
    };
  }

  @Get('status/:mensagemId')
  getStatus(@Param('mensagemId') mensagemId: string) {
    const status = this.processadorService.getStatus(mensagemId);
    return { mensagemId, status: status ?? 'AGUARDANDO PROCESSAMENTO' };
  }
}
