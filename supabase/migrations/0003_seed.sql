-- Dados de exemplo para o ambiente de desenvolvimento funcionar
-- "out of the box". A Von deve editar/substituir estes valores no painel
-- admin (Gestão de Serviços / Gestão de Disponibilidade) em produção.
-- Usamos UUIDs fixos para que esta migração seja idempotente.

insert into services (id, nome, descricao, duracao_minutos, preco, ativo)
values
  ('a0000000-0000-4000-8000-000000000001', 'Manicure Gel', 'Manicure completa com aplicação de verniz em gel de longa duração.', 60, 25.00, true),
  ('a0000000-0000-4000-8000-000000000002', 'Pedicure Spa', 'Pedicure spa com esfoliação, hidratação e verniz à escolha.', 75, 30.00, true),
  ('a0000000-0000-4000-8000-000000000003', 'Nail Art', 'Design personalizado com desenhos, pedrarias ou efeitos especiais.', 45, 15.00, true),
  ('a0000000-0000-4000-8000-000000000004', 'Alongamento em Gel', 'Alongamento de unhas em gel com molde, acabamento natural ou glamour.', 120, 45.00, true),
  ('a0000000-0000-4000-8000-000000000005', 'Verniz Semipermanente', 'Aplicação de verniz semipermanente com brilho e duração prolongada.', 40, 18.00, true),
  ('a0000000-0000-4000-8000-000000000006', 'Remoção', 'Remoção segura de gel, acrílico ou semipermanente.', 30, 10.00, true)
on conflict (id) do nothing;

-- Horário de funcionamento: Segunda a Sexta 10:00–19:00, Sábado 10:00–15:00
insert into availability_rules (id, dia_da_semana, hora_inicio, hora_fim, ativo)
values
  ('b0000000-0000-4000-8000-000000000001', 1, '10:00', '19:00', true), -- segunda
  ('b0000000-0000-4000-8000-000000000002', 2, '10:00', '19:00', true), -- terça
  ('b0000000-0000-4000-8000-000000000003', 3, '10:00', '19:00', true), -- quarta
  ('b0000000-0000-4000-8000-000000000004', 4, '10:00', '19:00', true), -- quinta
  ('b0000000-0000-4000-8000-000000000005', 5, '10:00', '19:00', true), -- sexta
  ('b0000000-0000-4000-8000-000000000006', 6, '10:00', '15:00', true)  -- sábado
on conflict (id) do nothing;

-- Configuração geral: 15 minutos de intervalo entre marcações
insert into app_settings (id, buffer_minutos)
values ('c0000000-0000-4000-8000-000000000001', 15)
on conflict (id) do nothing;

-- Exemplo de bloqueio pontual (feriado) — opcional, ilustra a funcionalidade
insert into blocked_slots (id, data, hora_inicio, hora_fim, motivo)
values ('d0000000-0000-4000-8000-000000000001', '2026-12-25', null, null, 'Feriado — Natal')
on conflict (id) do nothing;
