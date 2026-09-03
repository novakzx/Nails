-- Nails Von — schema inicial
-- Tabelas: services, availability_rules, blocked_slots, bookings, app_settings

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ============================================================================
-- services
-- ============================================================================
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  duracao_minutos integer not null check (duracao_minutos > 0),
  preco numeric(10, 2) not null check (preco >= 0),
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

comment on table services is 'Serviços do estúdio (manicure, pedicure, nail art, etc.), editáveis pela Von no painel admin.';

-- ============================================================================
-- availability_rules — horário de funcionamento recorrente por dia da semana
-- ============================================================================
create table if not exists availability_rules (
  id uuid primary key default gen_random_uuid(),
  dia_da_semana integer not null check (dia_da_semana between 0 and 6), -- 0 = domingo
  hora_inicio time not null,
  hora_fim time not null check (hora_fim > hora_inicio),
  ativo boolean not null default true
);

comment on table availability_rules is 'Janelas de horário de funcionamento por dia da semana (0=domingo .. 6=sábado).';

create index if not exists idx_availability_rules_dia on availability_rules (dia_da_semana);

-- ============================================================================
-- blocked_slots — bloqueios pontuais (férias, folgas, feriados)
-- ============================================================================
create table if not exists blocked_slots (
  id uuid primary key default gen_random_uuid(),
  data date not null,
  hora_inicio time, -- null = dia inteiro bloqueado
  hora_fim time,
  motivo text,
  constraint blocked_slots_horas_validas check (
    (hora_inicio is null and hora_fim is null) or (hora_fim > hora_inicio)
  )
);

comment on table blocked_slots is 'Bloqueios pontuais de disponibilidade (férias, folgas, feriados).';

create index if not exists idx_blocked_slots_data on blocked_slots (data);

-- ============================================================================
-- app_settings — configuração única (buffer entre marcações, etc.)
-- ============================================================================
create table if not exists app_settings (
  id uuid primary key default gen_random_uuid(),
  buffer_minutos integer not null default 15 check (buffer_minutos >= 0)
);

comment on table app_settings is 'Configurações gerais do estúdio. Deve conter exatamente uma linha.';

-- ============================================================================
-- bookings — marcações
-- ============================================================================
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services (id) on delete restrict,
  nome_cliente text not null check (char_length(trim(nome_cliente)) > 0),
  telefone_cliente text not null check (char_length(trim(telefone_cliente)) > 0),
  email_cliente text not null check (email_cliente ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  data date not null,
  hora_inicio time not null,
  hora_fim time not null,
  notas text,
  estado text not null default 'pendente'
    check (estado in ('pendente', 'confirmada', 'cancelada', 'concluida')),
  criado_em timestamptz not null default now(),
  -- Intervalo de tempo ocupado pela marcação, calculado automaticamente.
  -- Usado pela exclusion constraint abaixo para impedir sobreposições.
  periodo tsrange generated always as (
    tsrange((data + hora_inicio), (data + hora_fim), '[)')
  ) stored
);

comment on table bookings is 'Marcações de clientes. estado: pendente | confirmada | cancelada | concluida.';

create index if not exists idx_bookings_data on bookings (data);
create index if not exists idx_bookings_service_id on bookings (service_id);
create index if not exists idx_bookings_estado on bookings (estado);

-- Recalcula sempre hora_fim a partir da duração real do serviço no servidor,
-- para que um pedido não possa manipular hora_fim e "roubar" ou encolher
-- o intervalo real ocupado pela marcação.
create or replace function set_booking_hora_fim()
returns trigger as $$
declare
  duracao integer;
begin
  select duracao_minutos into duracao from services where id = new.service_id and ativo = true;

  if duracao is null then
    raise exception 'Serviço inválido ou inativo.' using errcode = '22023';
  end if;

  new.hora_fim := new.hora_inicio + (duracao || ' minutes')::interval;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_set_booking_hora_fim on bookings;
create trigger trg_set_booking_hora_fim
  before insert or update of service_id, hora_inicio on bookings
  for each row execute function set_booking_hora_fim();

-- Impede duas marcações com intervalos sobrepostos (exceto as canceladas).
-- Isto é a garantia definitiva contra dupla-marcação, ao nível da base de
-- dados, independente de qualquer validação feita na aplicação.
alter table bookings
  drop constraint if exists bookings_no_overlap;
alter table bookings
  add constraint bookings_no_overlap
  exclude using gist (periodo with &&)
  where (estado <> 'cancelada');
