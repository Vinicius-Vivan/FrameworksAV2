## Segunda Avaliacao – Frameworks Modernos (Vue 3 + Express + Supabase)

### Integrante
- Vinicius Vivan de Lima

### Descricao do sistema
Aplicacao web com login via conta Google (Supabase Auth), que protege rotas internas e expõe um CRUD de itens (titulo, descricao, status). O Pinia mantém a sessao e o backend Express comunica com o Postgres do Supabase.

### Tecnologias
- Frontend: Vue 3, Vite, Vuetify 3, Vue Router, Pinia, Supabase JS.
- Backend: Express.js, Supabase JS (Postgres gerenciado), CORS, Morgan.
- Autenticacao: Supabase Auth (Google OAuth).

### Arquitetura
- `frontend/`: app Vue com rotas `/login`, `/` (dashboard) e `/items` (CRUD). Pinia guarda a sessao e dados do usuario. Consome a API via fetch.
- `backend/`: API Express em `/api/items` com CRUD completo e validacao do token Supabase (Bearer).

## Como configurar o Supabase
1. Crie um projeto em https://supabase.com/ e pegue as URLs/keys em Project Settings → API:
   - `SUPABASE_URL`
   - `anon public key` (frontend)
   - `service_role key` (backend)
2. Habilite login Google: Authentication → Providers → Google → Enable. Configure o `Redirect URL` como `http://localhost:5173/`.
3. Crie a tabela principal (SQL Editor):
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
4. Politicas RLS: para testes pode desativar ou adicionar politica permissiva. Em producao, ajuste conforme necessidade.

## Variaveis de ambiente
Copie os arquivos `.env.example` para `.env` e preencha:

### Frontend (`frontend/.env`)
```
VITE_SUPABASE_URL=<SUPABASE_URL>
VITE_SUPABASE_ANON_KEY=<anon public key>
VITE_API_URL=http://localhost:4000
```

### Backend (`backend/.env`)
```
PORT=4000
SUPABASE_URL=<SUPABASE_URL>
SUPABASE_SERVICE_KEY=<service_role key>
```

## Instalacao e execucao
Pré-requisitos: Node 18+ e npm.

```bash
# Frontend
cd frontend
npm install
npm run dev   # http://localhost:5173

# Backend (outro terminal)
cd backend
npm install
npm run dev   # http://localhost:4000
```

## Fluxo e rotas
- `/login` (publica): botão “Entrar com Google”.
- `/` (dashboard): mostra dados do usuario logado e estatisticas.
- `/items` (protegida): formulario + tabela para CRUD.
- API REST: `GET/POST/PUT/DELETE /api/items` exige `Authorization: Bearer <access_token_supabase>` e retorna dados por usuario.

## Checklist
- [x] Integrante listado (Vinicius Vivan de Lima).
- [ ] Repositorio publico no GitHub.
- [x] README com configuracao e execucao.
- [x] Autenticacao Google via Supabase funcionando.
- [x] CRUD integrado (frontend + backend).
