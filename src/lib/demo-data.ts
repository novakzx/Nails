import "server-only";
import type { Service } from "@/types/database";

/**
 * Modo de demonstração: enquanto o Supabase não estiver configurado (sem
 * NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY), o site mostra
 * dados de exemplo em vez de secções vazias — útil para apresentar o
 * design/fluxo antes de ligar a base de dados a sério. Assim que as
 * variáveis de ambiente forem definidas, tudo passa a usar dados reais
 * automaticamente, sem precisar de tocar em código.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );
}

// Mesmos IDs/dados de supabase/migrations/0003_seed.sql — assim, quando o
// Supabase for ligado a sério com esse seed aplicado, os ids coincidem.
export const DEMO_SERVICES: Service[] = [
  {
    id: "a0000000-0000-4000-8000-000000000001",
    nome: "Manicure Gel",
    descricao: "Manicure completa com aplicação de verniz em gel de longa duração.",
    duracao_minutos: 60,
    preco: 25,
    ativo: true,
    criado_em: new Date().toISOString(),
  },
  {
    id: "a0000000-0000-4000-8000-000000000002",
    nome: "Pedicure Spa",
    descricao: "Pedicure spa com esfoliação, hidratação e verniz à escolha.",
    duracao_minutos: 75,
    preco: 30,
    ativo: true,
    criado_em: new Date().toISOString(),
  },
  {
    id: "a0000000-0000-4000-8000-000000000003",
    nome: "Nail Art",
    descricao: "Design personalizado com desenhos, pedrarias ou efeitos especiais.",
    duracao_minutos: 45,
    preco: 15,
    ativo: true,
    criado_em: new Date().toISOString(),
  },
  {
    id: "a0000000-0000-4000-8000-000000000004",
    nome: "Alongamento em Gel",
    descricao: "Alongamento de unhas em gel com molde, acabamento natural ou glamour.",
    duracao_minutos: 120,
    preco: 45,
    ativo: true,
    criado_em: new Date().toISOString(),
  },
  {
    id: "a0000000-0000-4000-8000-000000000005",
    nome: "Verniz Semipermanente",
    descricao: "Aplicação de verniz semipermanente com brilho e duração prolongada.",
    duracao_minutos: 40,
    preco: 18,
    ativo: true,
    criado_em: new Date().toISOString(),
  },
  {
    id: "a0000000-0000-4000-8000-000000000006",
    nome: "Remoção",
    descricao: "Remoção segura de gel, acrílico ou semipermanente.",
    duracao_minutos: 30,
    preco: 10,
    ativo: true,
    criado_em: new Date().toISOString(),
  },
];

/** Horários de exemplo — usados quando não há Supabase para calcular disponibilidade real. */
export const DEMO_SLOTS = ["10:00", "10:30", "11:30", "14:00", "14:30", "15:30", "16:30", "17:00"];
