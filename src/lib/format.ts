export function formatPreco(value: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(value);
}

export function formatDataLonga(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("pt-PT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatDataCurta(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
  });
}
