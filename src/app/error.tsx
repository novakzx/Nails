"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-site flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <AlertTriangle className="h-12 w-12 text-rose-500" aria-hidden="true" />
      <h1 className="heading-display mt-4 text-2xl">Ocorreu um erro</h1>
      <p className="mt-2 max-w-sm text-charcoal-500">
        Algo correu mal ao carregar esta página. Podes tentar novamente ou voltar mais tarde.
      </p>
      <button type="button" onClick={reset} className="btn-primary mt-6">
        Tentar novamente
      </button>
    </div>
  );
}
