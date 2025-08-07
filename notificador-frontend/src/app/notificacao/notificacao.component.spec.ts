import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NotificacaoComponent } from './notificacao.component';
import { NotificacaoService } from '../notificacao.service';
import { FormsModule } from '@angular/forms';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { v4 as uuidv4 } from 'uuid';

describe('NotificacaoComponent', () => {
  let component: NotificacaoComponent;
  let fixture: ComponentFixture<NotificacaoComponent>;
  let httpMock: HttpTestingController;
  let notificacaoService: NotificacaoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacaoComponent, FormsModule, HttpClientTestingModule],
      providers: [NotificacaoService],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificacaoComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    notificacaoService = TestBed.inject(NotificacaoService);
    fixture.detectChanges();
  });

  it('deve gerar um mensagemId e adicionar notificação com status AGUARDANDO PROCESSAMENTO', () => {
    component.conteudoMensagem = 'Teste';
    spyOn<any>(uuidv4, 'apply').and.returnValue('fake-uuid');
    component.enviar();
    const req = httpMock.expectOne('http://localhost:3000/api/notificar');
    req.flush({});
    expect(component.notificacoes.length).toBe(1);
    expect(component.notificacoes[0].status).toBe('AGUARDANDO PROCESSAMENTO');
    expect(component.notificacoes[0].conteudoMensagem).toBe('Teste');
  });

  it('deve enviar requisição POST ao backend', () => {
    component.conteudoMensagem = 'Teste';
    component.enviar();
    const req = httpMock.expectOne('http://localhost:3000/api/notificar');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('deve atualizar o status da notificação via polling', fakeAsync(() => {
    component.conteudoMensagem = 'Teste';
    component.enviar();
    const req = httpMock.expectOne('http://localhost:3000/api/notificar');
    req.flush({});
    tick(3000);
    const statusReq = httpMock.expectOne((req) =>
      req.url.includes('/api/notificar/status/')
    );
    statusReq.flush({ status: 'PROCESSADO_SUCESSO' });
    tick(3000);
    expect(component.notificacoes[0].status).toBe('PROCESSADO_SUCESSO');
  }));

  afterEach(() => {
    httpMock.verify();
  });
});
