# Projeto Segurança — Guia de Banco de Dados Seguro

Este projeto usa Next.js com autenticação via cookie HTTP-only e uma rota segura para buscar usuários no banco relacional (SQLite por padrão). O foco é demonstrar mitigação contra SQL Injection e boas práticas de configuração.

## Dependências

```bash
npm install
```

Inclui `better-sqlite3` para um banco local simples. Em produção, prefira Postgres/MySQL com TLS.

## Variáveis de Ambiente

Crie `.env.local` na raiz:

```bash
# Caminho do banco SQLite (padrão: ./data/app.db)
DATABASE_URL=./data/app.db

# Segredos necessários para JWT/NextAuth
JWT_SECRET=troque-este-segredo
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## Inicialização do Banco

O schema é criado automaticamente em `src/lib/db.ts` no primeiro acesso.

- Tabela `users(id, email UNIQUE, passwordHash, level, createdAt)`
- Índice em `email` para buscas

Para popular rapidamente (exemplo):

```js
// Exemplo rápido (não incluído por padrão):
// Use um script separado para inserir usuários com senha bcrypt hash
```

## Rota Segura de Usuários

- Endpoint: `GET /api/users`
- Query params suportados:
  - `id`: busca determinística por ID (ex.: `/api/users?id=1`)
  - `email`: busca por email com LIKE parametrizado (ex.: `/api/users?email=admin`)
  - `limit` e `offset` com validação numérica
- Autenticação: requer cookie `app_token` válido.

Proteções aplicadas no código (`src/app/api/users/route.ts` e `src/lib/db.ts`):

- Uso de statements parametrizados (`?`) e bind seguro de variáveis
- Escaping de curingas em buscas `LIKE` com `ESCAPE '\'`
- Validação e clamp de `limit/offset` (evita injeção e abusos)
- Campos sensíveis como `passwordHash` nunca são retornados na API

## Boas Práticas de Segurança no Banco

- Use usuários de banco com privilégio mínimo (apenas o necessário para SELECT/INSERT/UPDATE)
- Habilite TLS entre app e banco (Postgres/MySQL em produção)
- Guarde credenciais somente em variáveis de ambiente (nunca em repositório)
- Sempre use consultas preparadas/parametrizadas
- Faça hash de senhas com `bcrypt`/`argon2`; nunca armazene senhas em texto puro
- Configure backups e política de rotação de logs e segredos
- Monitore tentativas anômalas de consulta e limite taxas de acesso

## Executando o Projeto

```bash
npm run dev
```

Acesse `http://localhost:3000`. Para a rota segura, autentique-se e use:

- `GET http://localhost:3000/api/users?id=1`
- `GET http://localhost:3000/api/users?email=admin&limit=10&offset=0`

## Produção (Postgres/MySQL)

- Configure `DATABASE_URL` para o driver/host do seu banco e ajuste a lib/ORM (ex.: Prisma/pg/mysql2)
- Exija TLS, use rotas privadas (ex.: VPC/peering), e rotacione credenciais periodicamente
- Aplique migrations auditáveis e backups automáticos
