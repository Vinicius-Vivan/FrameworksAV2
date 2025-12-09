## Segunda Avaliacao – Frameworks Modernos (Vue 3 + Express + Supabase)

### Integrante
- Vinicius Vivan de Lima

### Descricao do sistema
Aplicacao web com login via conta Google (Supabase Auth) que protege rotas internas e expõe um CRUD de itens (titulo, descricao, status). O Pinia mantém a sessao enquanto o backend Express conversa com o Postgres do Supabase.

### Tecnologias
- Frontend: Vue 3, Vite, Vuetify 3, Vue Router, Pinia, Supabase JS.
- Backend: Express.js, Supabase JS (Postgres gerenciado), CORS, Morgan, Swagger.
- Autenticacao: Supabase Auth (Google OAuth).

### Arquitetura
- `frontend/`: app Vue com rotas `/login`, `/` (dashboard) e `/items` (CRUD). Pinia guarda sessao e dados do usuario. Consome a API via fetch.
- `backend/`: API Express em `/api/items` com CRUD completo, validacao do token Supabase e documentacao Swagger em `/docs`.

## Como configurar o Supabase
1. Crie um projeto em https://supabase.com/ e copie em **Project Settings → API**:
   - `SUPABASE_URL`
   - `anon public key` (frontend)
   - `service_role key` (backend)
2. Em **Authentication → Providers → Google**, habilite o provedor e configure o `Redirect URL` como `http://localhost:5173/`.
3. Crie a tabela principal no SQL Editor:
   ```sql
   create table public.items (
     id uuid primary key default gen_random_uuid(),
     title text not null,
     description text default '',
     status text default 'pendente',
     user_id uuid,
     created_at timestamptz default now()
   );
   ```
4. Politicas RLS: em testes, desative ou crie politica permissiva; em producao ajuste de acordo com o time.

## Variaveis de ambiente
Duplique os arquivos `.env.example` para `.env` e preencha:

### Frontend (`frontend/.env`)
```
VITE_SUPABASE_URL=<SUPABASE_URL>
VITE_SUPABASE_ANON_KEY=<anon_public_key>
VITE_API_URL=http://localhost:4000
```

### Backend (`backend/.env`)
```
PORT=4000
SUPABASE_URL=<SUPABASE_URL>
SUPABASE_SERVICE_KEY=<service_role_key>
```

## Instalacao e execucao
Pré-requisitos: Node 18+ e npm.

```bash
# Frontend
cd frontend
npm install
npm run dev       # http://localhost:5173

# Backend (outro terminal)
cd backend
npm install
npm run dev       # http://localhost:4000
```

## Documentacao (Avaliacao 3)
- Com o backend rodando, acesse `http://localhost:4000/docs` para abrir o Swagger UI.
- Todos os endpoints de `/api/items` estão descritos, incluindo schemas (`Item`, `ItemInput`), parametros de rota, codigos de resposta e a exigencia do header `Authorization: Bearer <token Supabase>`.

## Fluxo e rotas
- `/login` (publica): botao “Entrar com Google”.
- `/` (dashboard): mostra usuario logado e estatisticas do CRUD.
- `/items` (protegida): formulario + tabela para criar, editar e excluir itens.
- API REST protegida: `GET/POST/PUT/DELETE /api/items` exige token Supabase e filtra itens por usuario.

## Checklist
- [x] Integrante listado.
- [x] README com configuracao, execucao e Swagger.
- [x] Autenticacao Google via Supabase funcionando.
- [x] CRUD integrado (frontend + backend) com documentacao da API.
