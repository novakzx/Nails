import type { BookingStatus } from "@/types/database";

const STYLES: Record<BookingStatus, string> = {
  pendente: "bg-amber-100 text-amber-700",
  confirmada: "bg-green-100 text-green-700",
  cancelada: "bg-red-100 text-red-700",
  concluida: "bg-sand-300 text-charcoal-700",
};

const LABELS: Record<BookingStatus, string> = {
  pendente: "Pendente",
  confirmada: "Confirmada",
  cancelada: "Cancelada",
  concluida: "Concluída",
};

export default function StatusBadge({ estado }: { estado: BookingStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STYLES[estado]}`}>
      {LABELS[estado]}
    </span>
  );
}
