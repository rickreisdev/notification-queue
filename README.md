# Notification Queue

## Descrição

O Notification Queue é um sistema completo para envio e acompanhamento de mensagens assíncronas. O backend processa as mensagens utilizando RabbitMQ, garantindo que o processamento seja desacoplado e escalável. O frontend exibe o status das mensagens em tempo real, permitindo ao usuário acompanhar o fluxo de notificações.

### Funcionalidades

- Envio de mensagens pelo frontend
- Processamento assíncrono das mensagens no backend via RabbitMQ
- Atualização do status das mensagens no frontend conforme são processadas

## Tecnologias Utilizadas

### Backend (`notificador-backend`)

- **NestJS**: Framework Node.js para aplicações escaláveis e eficientes
- **TypeScript**: Tipagem estática para maior robustez
- **RabbitMQ**: Mensageria para processamento assíncrono
- **amqplib**: Cliente RabbitMQ para Node.js
- **Jest**: Testes automatizados
- **ESLint & Prettier**: Padronização e qualidade de código

### Frontend (`notificador-frontend`)

- **Angular**: Framework para aplicações web reativas
- **TypeScript**: Tipagem estática
- **RxJS**: Programação reativa
- **uuid**: Geração de identificadores únicos
- **Karma & Jasmine**: Testes automatizados

## Como rodar o projeto

### Pré-requisitos

- Node.js (recomendado versão 18+)
- RabbitMQ rodando localmente ou em ambiente acessível

## Observações

- Certifique-se de que o RabbitMQ está configurado corretamente e acessível pelo backend.
- Certifique-se de criar/colar o arquivo .env no diretório do backend contendo a url de conexão com o RabbitMQ.
- O frontend se comunica com o backend para enviar mensagens e receber atualizações de status.

### Backend

1. Instale as dependências:
   ```bash
   cd notificador-backend
   npm install
   ```
2. Inicie o servidor em modo desenvolvimento:
   ```bash
   npm run start:dev
   ```
   Ou em modo produção:
   ```bash
   npm run start:prod
   ```
3. Execute os testes:
   ```bash
   npm run test
   ```

### Frontend

1. Instale as dependências:
   ```bash
   cd notificador-frontend
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   ng serve
   ```
   Acesse `http://localhost:4200` no navegador para visualizar a aplicação.
3. Execute os testes unitários:
   ```bash
   ng test
   ```

## Estrutura do Projeto

```
notification-queue/
├── notificador-backend/   # Backend NestJS
└── notificador-frontend/  # Frontend Angular
```

## Recursos Adicionais

- [NestJS Documentation](https://docs.nestjs.com)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
