"use client";

import { useState, useTransition } from "react";
import { Loader2, Save } from "lucide-react";
import { updateBufferMinutos } from "@/app/admin/actions";

export default function BufferForm({ id, bufferMinutos }: { id: string; bufferMinutos: number }) {
  const [value, setValue] = useState(bufferMinutos);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <form
      className="card flex flex-wrap items-end gap-3 p-5"
      onSubmit={(e) => {
        e.preventDefault();
        setSaved(false);
        startTransition(async () => {
          await updateBufferMinutos(id, value);
          setSaved(true);
        });
      }}
    >
      <div>
        <label htmlFor="buffer" className="label-field">
          Intervalo entre marcações (minutos)
        </label>
        <input
          id="buffer"
          type="number"
          min={0}
          step={5}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="input-field w-40"
        />
      </div>
      <button type="submit" className="btn-secondary" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Guardar
      </button>
      {saved && !isPending && <span className="text-sm text-green-600">Guardado!</span>}
    </form>
  );
}
