# Controle Financeiro

Aplicativo mobile de finanças pessoais para registrar receitas e despesas e acompanhar indicadores em um dashboard com gráficos.

**Integrante:** Karina Meier
**Disciplina:** Codificar Acesso | **Professor:** Gabriel Caixeta

## Funcionalidades

- Autenticação (cadastro, login e logout) com Supabase Auth
- CRUD de receitas e de despesas (descrição, valor, categoria e data)
- Dashboard com total de receitas, total de despesas e saldo atual
- Gráfico de pizza com despesas por categoria
- Gráfico de barras com receitas e despesas por mês
- Indicadores: maior categoria de gasto, quantidade de lançamentos e percentual de despesas sobre receitas
- Validações nos formulários e interface responsiva

**Desafios extras:** modo escuro e filtro por período.

## Tecnologias

- Ionic Framework (Ionic Vue)
- Vue 3 (Composition API) e TypeScript
- Capacitor (empacotamento para Android)
- Supabase (Auth, PostgreSQL e Row Level Security)
- Vue ApexCharts
- Git e GitHub

## Como executar

1. Clone o repositório e instale as dependências:

```bash
git clone https://github.com/karinameier01/app_financas
cd app_financas
npm install
```

2. Crie um projeto no [Supabase](https://supabase.com) e rode o SQL da seção [Banco de dados](#banco-de-dados) no **SQL Editor**.

3. Em **Authentication → Providers → Email**, desative **Confirm email** para desenvolvimento. O serviço de e-mail padrão do Supabase tem limite baixo de envios por hora e, sem essa opção desativada, o cadastro pode falhar com o erro `email rate limit exceeded`. Em produção, configure um SMTP próprio e reative a confirmação.

4. Copie `.env.example` para `.env` e preencha com a URL do projeto e a publishable key:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

> O arquivo `.env` não deve ser enviado ao GitHub. Confirme que ele está no `.gitignore`.

5. Inicie o app no navegador:

```bash
ionic serve
```

## Executar no Android

Pré-requisito: [Android Studio](https://developer.android.com/studio) instalado.

```bash
npm run build
npx cap add android
npx cap sync
npx cap open android
```

O `cap add android` só é necessário na primeira vez. Depois, a cada alteração no código, rode `npm run build` e `npx cap sync` antes de executar no Android Studio. O dispositivo ou emulador precisa de internet para acessar o Supabase.

## Banco de dados

```sql
create table receitas (
  id uuid primary key default gen_random_uuid(),
  descricao text not null,
  valor numeric not null check (valor > 0),
  categoria text not null,
  data date not null,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade
);

create table despesas (
  id uuid primary key default gen_random_uuid(),
  descricao text not null,
  valor numeric not null check (valor > 0),
  categoria text not null,
  data date not null,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade
);

alter table receitas enable row level security;
alter table despesas enable row level security;

create policy "receitas do usuario" on receitas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "despesas do usuario" on despesas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

O Row Level Security garante que cada usuário acessa apenas os próprios dados.

## Estrutura do projeto

```
src/
├── components/   LancamentoForm, LancamentoList, SummaryCard
├── composables/  useAuth, useLancamentos, useDashboard, useTema
├── lib/          supabase.ts
├── router/       rotas e guarda de autenticação
├── types/        tipos e categorias
├── utils/        formatadores de valor e data
└── views/        telas do aplicativo
```

Receitas e despesas compartilham os mesmos componentes e o mesmo composable (`useLancamentos`), que recebe o nome da tabela como parâmetro.