import { Marquee } from "@/components/motion/marquee";

const ITEMS = [
  "Manicure Gel",
  "Pedicure Spa",
  "Nail Art",
  "Alongamento em Gel",
  "Verniz Semipermanente",
  "Marcação Online em 1 Minuto",
];

export default function MarqueeStrip() {
  return (
    <div className="border-y border-rose-400/30 bg-rose-500 py-3 text-sm font-semibold uppercase tracking-wide text-white">
      <Marquee items={ITEMS} duration={26} />
    </div>
  );
}
