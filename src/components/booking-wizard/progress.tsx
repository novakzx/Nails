const STEPS = ["Serviço", "Data e Hora", "Os teus dados", "Confirmar"];

export default function Progress({ current }: { current: number }) {
  return (
    <ol className="mb-8 flex items-center justify-between" aria-label="Progresso da marcação">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const state = stepNum < current ? "done" : stepNum === current ? "current" : "upcoming";
        return (
          <li key={label} className="flex flex-1 flex-col items-center text-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                state === "done"
                  ? "bg-rose-500 text-white"
                  : state === "current"
                    ? "border-2 border-rose-500 text-rose-500"
                    : "border-2 border-sand-300 text-charcoal-300"
              }`}
              aria-current={state === "current" ? "step" : undefined}
            >
              {stepNum}
            </div>
            <span
              className={`mt-1.5 hidden text-xs sm:block ${
                state === "upcoming" ? "text-charcoal-300" : "text-charcoal-700"
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
