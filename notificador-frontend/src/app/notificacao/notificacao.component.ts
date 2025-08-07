import { Component } from '@angular/core';
import { NotificacaoService, Notificacao } from '../notificacao.service';
import { v4 as uuidv4 } from 'uuid';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notificacao',
  templateUrl: './notificacao.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class NotificacaoComponent {
  conteudoMensagem = '';
  notificacoes: Notificacao[] = [];

  constructor(private notificacaoService: NotificacaoService) {}

  enviar() {
    if (!this.conteudoMensagem.trim()) return;
    const mensagemId = uuidv4();
    const nova: Notificacao = {
      mensagemId,
      conteudoMensagem: this.conteudoMensagem,
      status: 'AGUARDANDO PROCESSAMENTO',
    };
    this.notificacoes.unshift(nova);

    this.notificacaoService
      .enviarNotificacao(this.conteudoMensagem, mensagemId)
      .subscribe(() => {
        this.iniciarPolling(nova);
      });

    this.conteudoMensagem = '';
  }

  iniciarPolling(notificacao: Notificacao) {
    const interval = setInterval(() => {
      this.notificacaoService
        .consultarStatus(notificacao.mensagemId)
        .subscribe((res) => {
          notificacao.status = res.status;
          if (res.status !== 'AGUARDANDO PROCESSAMENTO') {
            clearInterval(interval);
          }
        });
    }, 3000);
  }
}
