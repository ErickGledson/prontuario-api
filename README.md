# Prontuário Eletrônico

## Descrição

Este projeto é uma API para gerenciamento de pacientes, agendamento de consultas e anotações médicas. A API permite cadastrar, atualizar, listar e anonimizar pacientes (conforme LGPD), agendar, atualizar e excluir consultas, registrar anotações durante as consultas, além de autenticação via JWT e registro de médicos.

## Estrutura do Projeto

```
.env
.github/
.prettierignore
.prettierrc
docker-compose.yaml
Dockerfile
eslint.config.js
logs/
nodemon.json
openapi.yaml
package.json
src/
  application/
  config/
  domain/
  interfaces/
  middleware/
  tests/
  app.js
  server.js
```

## Tecnologias Utilizadas

Node.js
Express
Sequelize (ORM)
MySQL
Redis
JWT (JSON Web Token)
Docker
Jest (para testes)
Supertest (para testes de integração)
Winston (para logging)

## Padrões de Código

ESLint para linting
Prettier para formatação de código

## Configuração

Variáveis de Ambiente

As variáveis de ambiente podem ser configuradas no arquivo `.env` caso queira rodar a aplicação localmente (somente o servidor):

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=prontuario
DB_USER=root
DB_PASS=senha

REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET=secreto
PORT=3000
```

## Docker

Este projeto, para `testes` e `produção`, utiliza o conceito de distroless.

Para rodar o projeto com Docker, utilize o `docker-compose.yaml`:

Para produção

```sh
docker-compose up --build prod
```

Para desenvolvimento

```sh
docker-compose up --build dev
```

Scripts

- `npm start`: Inicia o servidor
- `npm run dev`: Inicia o servidor em modo de desenvolvimento com nodemon
- `npm run lint`: Executa o ESLint
- `npm run format`: Formata o código com Prettier

## Endpoints

Cadastro de Médico

```sh
curl -X POST http://localhost:3000/auth/signup -H "Content-Type: application/json" -d '{
  "name": "Dr. Silva",
  "email": "doctor@mail.com",
  "password": "123456"
}'
```

Login

```sh
curl -X POST http://localhost:3000/auth/signin -H "Content-Type: application/json" -d '{
  "email": "doctor@mail.com",
  "password": "123456"
}'
```

Listar Perfil Médico

```sh
curl -X GET http://localhost:3000/doctors -H "x-auth-token: Bearer <TOKEN>"
```

Atualizar Dados de Médico

```sh
curl -X PUT http://localhost:3000/doctors -H "x-auth-token: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{
  "name": "Dr. Silva Atualizado",
  "email": "doctor@mail.com",
  "password": "novaSenha123"
}'
```

Excluir Médico

```sh
curl -X DELETE http://localhost:3000/doctors -H "x-auth-token: Bearer <TOKEN>"
```

Cadastrar Paciente

```sh
curl -X POST http://localhost:3000/patients -H "x-auth-token: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{
  "name": "João Silva",
  "phone": "999999999",
  "email": "joao@email.com",
  "birthdate": "2000-01-01",
  "gender": "M",
  "height": 1.80,
  "weight": 75
}'
```

Listar Paciente

```sh
curl -X GET http://localhost:3000/patients -H "x-auth-token: Bearer <TOKEN>"
```

Atualizar Paciente

```sh
curl -X PUT http://localhost:3000/patients/{id} -H "x-auth-token: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{
  "name": "João Silva Atualizado",
  "phone": "999999999",
  "email": "joao@email.com",
  "birthdate": "2000-01-01",
  "gender": "M",
  "height": 1.80,
  "weight": 75
}'
```

Delete/Anomizar Paciente

```sh
curl -X DELETE http://localhost:3000/patients/{id} -H "x-auth-token: Bearer <TOKEN>"
```

Agendar Consulta

```sh
curl -X POST http://localhost:3000/appointments -H "x-auth-token: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{
  "patientId": 1,
  "date": "2025-03-10T14:00:00.000Z"
}'
```

Listar Consultas

```sh
curl -X GET http://localhost:3000/appointments -H "x-auth-token: Bearer <TOKEN>"
```

Atualizar Consulta

```sh
curl -X PUT http://localhost:3000/appointments/{id} -H "x-auth-token: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{
  "date": "2025-03-10T15:00:00.000Z"
}'
```

Excluir consulta

```sh
curl -X DELETE http://localhost:3000/appointments/{id} -H "x-auth-token: Bearer <TOKEN>"
```

Adicionar/Atualizar anotações da consulta

```sh
curl -X PUT http://localhost:3000/appointments/{id}/notes -H "x-auth-token: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{
  "notes": "Paciente apresentou sintomas de febre e tosse."
}'
```

## Testes

Para rodar os testes, utilize o comando

```sh
docker-compose up --build test
```

## Documentação

A documentação da API está disponível no arquivo `openapi.yaml`.

Para o MER (Modelo Entidade Relacionamento), pode consultar no arquivo `MER.png`.

## Deploy

Há configurado o `github actions` onde roda a pipeline de testes.

A parte de deploy na heroku foi comentada/removida do pipeline.