/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CriarNotificacaoDto {
  @IsUUID()
  @IsNotEmpty()
  mensagemId: string;

  @IsString()
  @IsNotEmpty({ message: 'O conteúdo da mensagem não pode ser vazio.' })
  conteudoMensagem: string;
}
