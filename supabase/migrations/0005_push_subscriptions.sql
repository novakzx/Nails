-- Subscrições de notificações push (Web Push API).
--
-- Dois tipos de subscrição:
--   'admin'   — a Von subscreve no painel admin para ser avisada de novas
--               marcações pendentes.
--   'cliente' — uma cliente pode subscrever no ecrã de confirmação da sua
--               marcação para ser avisada quando o estado mudar
--               (confirmada/cancelada/concluída). Fica associada a essa
--               marcação específica via booking_id.

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('admin', 'cliente')),
  booking_id uuid references bookings (id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  criado_em timestamptz not null default now(),
  constraint push_subscriptions_cliente_tem_booking check (
    (tipo = 'cliente' and booking_id is not null) or (tipo = 'admin')
  )
);

comment on table push_subscriptions is 'Subscrições Web Push — admin (novas marcações) e clientes (atualizações da sua marcação).';

create index if not exists idx_push_subscriptions_booking on push_subscriptions (booking_id);

alter table push_subscriptions enable row level security;

-- Visitantes podem criar a sua própria subscrição (cliente) ou a Von a sua
-- (admin, feita a partir do painel já autenticado — mas o insert em si não
-- precisa de estar restrito a authenticated, o acesso ao painel já está).
create policy "Visitantes podem criar subscrições"
  on push_subscriptions for insert
  to anon
  with check (true);

create policy "Autenticados gerem subscrições"
  on push_subscriptions for all
  to authenticated
  using (true)
  with check (true);

-- Função security-definer que devolve as subscrições da Von (tipo=admin)
-- para que o fluxo público de marcação (que corre como "anon") consiga
-- notificá-la de uma nova marcação sem que "anon" tenha uma policy de
-- SELECT direta sobre push_subscriptions (evita expor subscrições de
-- outras clientes).
create or replace function get_admin_push_subscriptions()
returns table (endpoint text, p256dh text, auth text)
language sql
security definer
set search_path = public
stable
as $$
  select endpoint, p256dh, auth from push_subscriptions where tipo = 'admin';
$$;

revoke all on function get_admin_push_subscriptions() from public;
grant execute on function get_admin_push_subscriptions() to anon, authenticated;
