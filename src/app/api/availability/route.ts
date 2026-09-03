import { NextResponse, type NextRequest } from "next/server";
import { getFreeSlotsForDate } from "@/lib/availability";

/**
 * GET /api/availability?data=YYYY-MM-DD&servico=<uuid>
 * Devolve os horários livres (array de "HH:MM") para o wizard de marcação.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const data = searchParams.get("data");
  const servico = searchParams.get("servico");

  if (!data || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return NextResponse.json({ error: "Parâmetro 'data' inválido." }, { status: 400 });
  }
  if (!servico) {
    return NextResponse.json({ error: "Parâmetro 'servico' em falta." }, { status: 400 });
  }

  try {
    const slots = await getFreeSlotsForDate(data, servico);
    return NextResponse.json({ slots });
  } catch (error) {
    console.error("[api/availability]", error);
    return NextResponse.json({ error: "Não foi possível calcular a disponibilidade." }, { status: 500 });
  }
}
