## Segunda Avaliacao – Frameworks Modernos (Vue 3 + Express + Supabase)

### Integrantes
- Nome 1 (preencher)
- Nome 2 (preencher)
- Nome 3 (preencher)

### Descricao do sistema
Aplicacao web com login via conta Google (Supabase Auth), que protege rotas internas e expoe um CRUD de itens (titulo, descricao, status). Estado de sessao e mantido no Pinia; o backend Express conversa com o Postgres do Supabase.

### Tecnologias
- Frontend: Vue 3, Vite, Vuetify 3, Vue Router, Pinia, Supabase JS.
- Backend: Express.js, Supabase JS (Postgres gerenciado), CORS, Morgan.
- Autenticacao: Supabase Auth (Google OAuth).

### Arquitetura
- `frontend/`: app Vue (rotas: `/login`, `/` dashboard, `/items` CRUD). Pinia guarda sessao e dados do usuario. API REST consumida via fetch.
- `backend/`: API Express em `/api/items` com CRUD completo e validacao do token Supabase (Bearer).

## Como configurar o Supabase
1. Crie um projeto em https://supabase.com/ e pegue as URLs/keys em Project Settings -> API:
   - `SUPABASE_URL`
   - `anon public key` (frontend)
   - `service_role key` (backend)
2. Habilite login Google: Authentication -> Providers -> Google -> Enable. Configure o `Redirect URL` como `http://localhost:5173/`.
3. Crie a tabela principal (SQL no Supabase -> SQL Editor):
   ```sql
   create table public.items (
     id uuid primary key default gen_random_uuid(),
     title text not null,
     description text default '',
     status text default 'pending',
     user_id uuid,
     created_at timestamptz default now()
   );
   ```
4. Politicas RLS (opcional para testes locais, ja usamos service role no backend): Authentication -> Policies -> disable RLS ou adicione politica permissiva. Em producao, ajuste as politicas conforme o time.

## Variaveis de ambiente
Crie arquivos a partir dos exemplos:

### Frontend (`frontend/.env`)
```
VITE_SUPABASE_URL=...          # do passo 1
VITE_SUPABASE_ANON_KEY=...     # anon public key
VITE_API_URL=http://localhost:4000
```

### Backend (`backend/.env`)
```
PORT=4000
SUPABASE_URL=...               # do passo 1
SUPABASE_SERVICE_KEY=...       # service_role key
```

## Instalacao e execucao
Pre-requisitos: Node 18+ e npm.

```bash
# Frontend
cd frontend
npm install
npm run dev   # roda em http://localhost:5173

# Backend (em outro terminal)
cd backend
npm install
npm run dev   # roda em http://localhost:4000
```

## Fluxo e rotas
- `/login` (publica): botao "Entrar com Google".
- `/` (dashboard, protegida): mostra usuario logado e link para CRUD.
- `/items` (protegida): formulario + tabela para criar, listar, editar e excluir itens.
- API REST protegida: `GET/POST/PUT/DELETE /api/items` exige `Authorization: Bearer <access_token_supabase>`.

## Endpoints principais (backend)
- `GET /api/items` – lista itens (ordenados por `created_at desc`).
- `GET /api/items/:id` – obtem item especifico.
- `POST /api/items` – cria item `{ title, description?, status? }`.
- `PUT /api/items/:id` – atualiza item.
- `DELETE /api/items/:id` – remove item.

## Checklist de entrega
- [ ] Nomes dos integrantes preenchidos acima.
- [ ] Projeto publicamente acessivel no GitHub.
- [ ] README atualizado com instrucoes (este arquivo).
- [ ] Autenticacao Google funcionando (Supabase).
- [ ] CRUD de itens funcional (frontend + backend).
