/**
 * Tipos TypeScript correspondentes ao schema Supabase definido em
 * supabase/migrations. Mantidos manualmente em sincronia com o SQL
 * (alternativa: gerar com `supabase gen types typescript`).
 *
 * IMPORTANTE: as linhas (Row/Insert/Update) usam `type` (object literal),
 * nunca `interface`. O postgrest-js exige que Row satisfaça
 * estruturalmente `Record<string, unknown>` para conseguir tipar os
 * selects — um `interface` não obtém a index signature implícita que um
 * `type` literal obtém, e a verificação falha silenciosamente para
 * `never` em todas as queries. Ver commit / discussão desta migração.
 */

export type BookingStatus = "pendente" | "confirmada" | "cancelada" | "concluida";

export type Service = {
  id: string;
  nome: string;
  descricao: string | null;
  duracao_minutos: number;
  preco: number;
  ativo: boolean;
  criado_em: string;
};

export type AvailabilityRule = {
  id: string;
  dia_da_semana: number; // 0 = domingo ... 6 = sábado
  hora_inicio: string; // "HH:MM:SS"
  hora_fim: string;
  ativo: boolean;
};

export type BlockedSlot = {
  id: string;
  data: string; // "YYYY-MM-DD"
  hora_inicio: string | null; // null = dia inteiro bloqueado
  hora_fim: string | null;
  motivo: string | null;
};

export type Booking = {
  id: string;
  service_id: string;
  nome_cliente: string;
  telefone_cliente: string;
  email_cliente: string;
  data: string; // "YYYY-MM-DD"
  hora_inicio: string; // "HH:MM:SS"
  hora_fim: string;
  notas: string | null;
  estado: BookingStatus;
  criado_em: string;
};

export type AppSettings = {
  id: string;
  buffer_minutos: number;
};

export type Database = {
  public: {
    Tables: {
      services: {
        Row: Service;
        Insert: Partial<Service> & { nome: string; duracao_minutos: number; preco: number };
        Update: Partial<Service>;
        Relationships: [];
      };
      availability_rules: {
        Row: AvailabilityRule;
        Insert: Partial<AvailabilityRule> & {
          dia_da_semana: number;
          hora_inicio: string;
          hora_fim: string;
        };
        Update: Partial<AvailabilityRule>;
        Relationships: [];
      };
      blocked_slots: {
        Row: BlockedSlot;
        Insert: Partial<BlockedSlot> & { data: string };
        Update: Partial<BlockedSlot>;
        Relationships: [];
      };
      bookings: {
        Row: Booking;
        Insert: Partial<Booking> & {
          service_id: string;
          nome_cliente: string;
          telefone_cliente: string;
          email_cliente: string;
          data: string;
          hora_inicio: string;
          hora_fim: string;
        };
        Update: Partial<Booking>;
        Relationships: [
          {
            foreignKeyName: "bookings_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      app_settings: {
        Row: AppSettings;
        Insert: Partial<AppSettings>;
        Update: Partial<AppSettings>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_booked_intervals: {
        Args: { p_data: string };
        Returns: { hora_inicio: string; hora_fim: string }[];
      };
    };
  };
};
