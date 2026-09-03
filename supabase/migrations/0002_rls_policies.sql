-- Row Level Security — Nails Von
--
-- Regra geral:
--   * Visitantes anónimos (role "anon"): podem ler serviços ativos e as
--     regras de disponibilidade/bloqueios (necessário para calcular slots
--     livres no wizard de marcação) e podem CRIAR uma marcação — mas nunca
--     ler, editar ou apagar marcações (as suas ou de outras pessoas).
--   * Utilizadores autenticados (role "authenticated" — apenas a conta da
--     Von): acesso total de leitura/escrita a todas as tabelas.

alter table services enable row level security;
alter table availability_rules enable row level security;
alter table blocked_slots enable row level security;
alter table bookings enable row level security;
alter table app_settings enable row level security;

-- ---------------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------------
create policy "Visitantes veem serviços ativos"
  on services for select
  to anon
  using (ativo = true);

create policy "Autenticados veem todos os serviços"
  on services for select
  to authenticated
  using (true);

create policy "Autenticados gerem serviços"
  on services for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- availability_rules
-- ---------------------------------------------------------------------------
create policy "Visitantes veem regras de disponibilidade"
  on availability_rules for select
  to anon
  using (true);

create policy "Autenticados gerem disponibilidade"
  on availability_rules for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- blocked_slots
-- ---------------------------------------------------------------------------
create policy "Visitantes veem bloqueios"
  on blocked_slots for select
  to anon
  using (true);

create policy "Autenticados gerem bloqueios"
  on blocked_slots for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- bookings
-- ---------------------------------------------------------------------------
-- Visitantes só podem INSERIR (criar a sua marcação). Não há policy de
-- select/update/delete para "anon", logo essas operações ficam bloqueadas
-- por omissão — uma cliente não consegue ler marcações de ninguém.
create policy "Visitantes podem criar marcações"
  on bookings for insert
  to anon
  with check (estado = 'pendente');

create policy "Autenticados veem todas as marcações"
  on bookings for select
  to authenticated
  using (true);

create policy "Autenticados atualizam marcações"
  on bookings for update
  to authenticated
  using (true)
  with check (true);

create policy "Autenticados apagam marcações"
  on bookings for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- app_settings
-- ---------------------------------------------------------------------------
create policy "Visitantes veem definições"
  on app_settings for select
  to anon
  using (true);

create policy "Autenticados gerem definições"
  on app_settings for all
  to authenticated
  using (true)
  with check (true);
