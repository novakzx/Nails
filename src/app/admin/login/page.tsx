"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Sparkles } from "lucide-react";
import { loginAction, type FormActionState } from "../actions";

const initialState: FormActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      Entrar
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand-100 px-4">
      <div className="card w-full max-w-sm p-8">
        <div className="flex flex-col items-center text-center">
          <Sparkles className="h-8 w-8 text-rose-500" aria-hidden="true" />
          <h1 className="heading-display mt-3 text-2xl">Área reservada</h1>
          <p className="mt-1 text-sm text-charcoal-500">Acesso exclusivo Nails Von</p>
        </div>

        <form action={formAction} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="label-field">
              Email
            </label>
            <input id="email" name="email" type="email" autoComplete="email" required className="input-field" />
          </div>
          <div>
            <label htmlFor="password" className="label-field">
              Palavra-passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="input-field"
            />
          </div>

          {state?.error && (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {state.error}
            </p>
          )}

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
