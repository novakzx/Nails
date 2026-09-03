# Nails Von

Site do estúdio de nail design **Nails Von** (Almada, distrito de Setúbal), com marcação de
horário online como funcionalidade principal, e um painel administrativo privado para a Von
gerir marcações, serviços e disponibilidade.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + **Framer Motion** (animações e transições)
- **Supabase** (Postgres, Auth, Row Level Security)
- **React Hook Form + Zod** (validação client/server)
- **Resend** (emails transacionais)
- **Web Push** (notificações push nativas do browser) + **PWA** (instalável no ecrã inicial)
- Link `wa.me` pré-preenchido para contacto via WhatsApp
- **Playwright** (testes E2E)

## 1. Correr localmente

```bash
npm install
cp .env.example .env.local
# edita .env.local com as tuas chaves Supabase/Resend (ver secção 2)
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

> **Modo de demonstração:** sem `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY`
> configuradas, o site funciona na mesma com serviços e horários de exemplo (ver
> [`lib/demo-data.ts`](src/lib/demo-data.ts)) — útil para apresentar o design e o fluxo de
> marcação antes de ligar a base de dados a sério. Nesse modo, o passo final do wizard simula uma
> marcação com sucesso mas não grava nada. Assim que definires as variáveis do Supabase (secção
> 2), tudo passa a usar dados reais automaticamente, sem alterar código.

## 2. Configurar o Supabase

### 2.1. Criar o projeto

1. Cria um projeto em [supabase.com](https://supabase.com) (ou usa o Supabase CLI localmente — ver 2.4).
2. Em **Project Settings → API**, copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (opcional, só para scripts pontuais — nunca é exposta ao browser)

### 2.2. Correr as migrações

As migrações estão em `supabase/migrations/`, por ordem:

| Ficheiro | O que faz |
|---|---|
| `0001_init.sql` | Cria as tabelas (`services`, `availability_rules`, `blocked_slots`, `bookings`, `app_settings`) e a proteção anti-dupla-marcação (exclusion constraint) |
| `0002_rls_policies.sql` | Ativa Row Level Security e define as políticas de acesso |
| `0003_seed.sql` | Dados de exemplo (serviços, horário, 1 bloqueio) para o site funcionar de imediato |
| `0004_availability_function.sql` | Função auxiliar usada pelo wizard público para calcular disponibilidade sem expor dados pessoais de outras clientes |
| `0005_push_subscriptions.sql` | Tabela de subscrições de notificações push (admin + clientes) |

**Opção A — via Supabase Studio (SQL Editor):** copia e cola o conteúdo de cada ficheiro, por
ordem, no SQL Editor do teu projeto e executa.

**Opção B — via Supabase CLI:**

```bash
npx supabase link --project-ref <o-teu-project-ref>
npx supabase db push
```

### 2.3. Criar a conta da Von (login do painel admin)

O admin usa Supabase Auth (email/password), sem registo público. Cria o utilizador manualmente:

1. Supabase Studio → **Authentication → Users → Add user** (define email + password).
2. Usa esse email/password em `/admin/login`.

### 2.4. Desenvolvimento local com Supabase (opcional, sem precisar de conta cloud)

Se tiveres Docker instalado, podes correr o Supabase inteiramente local:

```bash
npx supabase start
```

No fim, o comando mostra a `API URL` e a `anon key` locais — usa-as no `.env.local`. Para
aplicar as migrações + seed a essa instância local:

```bash
npx supabase db reset
```

## 3. Variáveis de ambiente

Ver [`.env.example`](.env.example) para a lista completa e comentada. Resumo:

| Variável | Obrigatória | Descrição |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | Chave pública (anon) |
| `SUPABASE_SERVICE_ROLE_KEY` | Não | Só para scripts admin pontuais |
| `RESEND_API_KEY` | Não* | Envio de emails de confirmação. Sem ela, os emails ficam só registados na consola (útil em dev) |
| `RESEND_FROM_EMAIL` | Não | Remetente dos emails |
| `ADMIN_NOTIFICATION_EMAIL` | Não | Email da Von para receber notificações de novas marcações |
| `NEXT_PUBLIC_SITE_URL` | Sim (produção) | URL pública do site, usada em SEO/sitemap/JSON-LD |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` | Não | Notificações push (ver secção 9). Sem elas, o push fica simplesmente desativado |
| `VAPID_SUBJECT` | Não | Contacto associado às chaves push (`mailto:...`), exigido pela spec Web Push |

*Recomendado em produção para os emails de confirmação funcionarem de facto.

## 4. Estrutura do projeto

```
src/
  app/                    Páginas (App Router) + Server Actions
    marcar/               Wizard de marcação (página + actions.ts)
    admin/                Painel admin (protegido por middleware)
    api/availability/     Route Handler usado pelo wizard para obter slots livres
  components/
    booking-wizard/       Passos do wizard de marcação
    admin/                Componentes do painel admin
    layout/, site/         Navbar, footer, secções da homepage
  lib/
    supabase/             Clientes Supabase (browser, server, admin, middleware)
    validations/          Schemas Zod
    availability.ts       Cálculo de slots livres (função pura + integração Supabase)
    email/resend.ts        Templates e envio de email
    push/                  Subscrição (browser) e envio (servidor) de notificações push
    constants.ts           Dados do negócio (morada, contactos, horário)
    site-images.ts          Fotos de unhas (Hero, Galeria, Sobre)
  types/database.ts        Tipos TypeScript do schema Supabase
public/sw.js                Service worker (push + PWA)
scripts/generate-icons.mjs  Gera favicon/ícones PWA a partir de src/app/icon.svg
supabase/migrations/        Migrações SQL
e2e/                         Testes Playwright
```

## 5. Substituir conteúdo placeholder

Antes de publicar, a Von deve:

- Editar os dados do negócio em [`src/lib/constants.ts`](src/lib/constants.ts) (morada real,
  telefone, Instagram, `mapEmbedSrc` do Google Maps).
- Substituir as fotos de stock (Unsplash) em
  [`src/lib/site-images.ts`](src/lib/site-images.ts) por fotos reais dos trabalhos do estúdio —
  atualmente são fotos genéricas de nail art, não trabalhos da Von.
- Rever/editar os textos de [`/sobre`](src/app/sobre/page.tsx) (história, certificações).
- Editar/adicionar serviços reais no painel admin (`/admin/servicos`) em vez dos dados de seed.
- Configurar o horário real em `/admin/disponibilidade`.

## 6. Testes

```bash
npm run test:e2e       # corre os testes Playwright (arranca o dev server automaticamente)
npm run test:e2e:ui    # modo interativo
```

Os testes em `e2e/booking.spec.ts` pressupõem que a base de dados tem o seed aplicado (serviço
"Manicure Gel" ativo e disponibilidade configurada). Os testes de login com credenciais válidas em
`e2e/admin-login.spec.ts` só correm se definires `TEST_ADMIN_EMAIL`/`TEST_ADMIN_PASSWORD` no
ambiente, apontando para um utilizador de teste.

## 7. Deploy na Vercel

1. Importa o repositório na Vercel.
2. Define as variáveis de ambiente da secção 3 em **Project Settings → Environment Variables**
   (inclui `NEXT_PUBLIC_SITE_URL` com o domínio final).
3. Deploy. O Next.js App Router, Server Actions e Route Handlers funcionam nativamente na Vercel,
   sem configuração adicional.
4. Confirma que as migrações Supabase (secção 2.2) já foram aplicadas ao projeto Supabase usado
   em produção antes do primeiro acesso.

## 8. Notificações push

A Von pode ativar notificações push no dashboard admin (botão "Ativar notificações") para ser
avisada de novas marcações; uma cliente pode ativá-las no ecrã de confirmação da sua marcação
para saber quando o estado mudar. Sem chaves VAPID configuradas, esta funcionalidade fica só
desativada — o resto do site continua a funcionar normalmente.

Para ativar:

```bash
npx web-push generate-vapid-keys
```

Copia a chave pública para `NEXT_PUBLIC_VAPID_PUBLIC_KEY` e a privada para `VAPID_PRIVATE_KEY`
(nunca a exponhas ao browser). Funciona só em HTTPS (ou `localhost` em desenvolvimento).

## 9. PWA — instalar no ecrã inicial

O site é instalável como app (manifest + service worker em `public/sw.js`). Um banner de
instalação aparece automaticamente (Android/Chrome via `beforeinstallprompt`; iOS Safari mostra
instruções manuais, já que o iOS não suporta esse evento). Os ícones ficam em `public/icon-*.png`
e `src/app/icon.svg` — para gerar um novo conjunto a partir de `public/favicon.svg`:

```bash
node scripts/generate-icons.mjs
```

## 10. Cookies

O site mostra um banner simples de consentimento (`src/components/layout/cookie-consent.tsx`) na
primeira visita. Atualmente só usa cookies essenciais (sessão do Supabase Auth no admin) — sem
publicidade nem analytics de terceiros. Se um dia adicionares analytics/marketing, ajusta este
banner para bloquear esses scripts até haver consentimento explícito.

## 11. Notas de segurança

- RLS está ativo em todas as tabelas. Visitantes anónimos só conseguem **ler** serviços ativos,
  disponibilidade e bloqueios, e **criar** marcações — nunca leem/editam marcações existentes
  (suas ou de outras clientes).
- A disponibilidade (slots livres) é calculada no servidor a partir da função SQL
  `get_booked_intervals`, que devolve apenas intervalos de tempo (sem nomes, telefones ou
  emails), evitando expor dados pessoais a visitantes.
- A submissão de marcações revalida a disponibilidade no servidor (nunca confia apenas na
  validação do cliente) e a base de dados tem uma *exclusion constraint* que impede fisicamente
  duas marcações sobrepostas, mesmo em caso de concorrência/corrida.
