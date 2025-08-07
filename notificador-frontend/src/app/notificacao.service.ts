import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notificacao {
  mensagemId: string;
  conteudoMensagem: string;
  status?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificacaoService {
  private apiUrl = 'http://localhost:3000/api/notificar';

  constructor(private http: HttpClient) {}

  enviarNotificacao(
    conteudoMensagem: string,
    mensagemId: string
  ): Observable<any> {
    return this.http.post(this.apiUrl, { conteudoMensagem, mensagemId });
  }

  consultarStatus(
    mensagemId: string
  ): Observable<{ mensagemId: string; status: string }> {
    return this.http.get<{ mensagemId: string; status: string }>(
      `${this.apiUrl}/status/${mensagemId}`
    );
  }
}
