-- Função auxiliar para o cálculo de disponibilidade no lado público do site.
--
-- A tabela "bookings" não tem policy de SELECT para "anon" (ver
-- 0002_rls_policies.sql) — uma visitante não deve conseguir ler nomes,
-- telefones ou emails de outras clientes. No entanto, o wizard de marcação
-- precisa de saber que intervalos de tempo já estão ocupados num dado dia
-- para não mostrar esses horários como livres.
--
-- Esta função "security definer" resolve isso com o mínimo de exposição:
-- devolve apenas hora_inicio/hora_fim (nenhum dado pessoal) das marcações
-- não canceladas de uma data.

create or replace function get_booked_intervals(p_data date)
returns table (hora_inicio time, hora_fim time)
language sql
security definer
set search_path = public
stable
as $$
  select hora_inicio, hora_fim
  from bookings
  where data = p_data
    and estado <> 'cancelada';
$$;

revoke all on function get_booked_intervals(date) from public;
grant execute on function get_booked_intervals(date) to anon, authenticated;
