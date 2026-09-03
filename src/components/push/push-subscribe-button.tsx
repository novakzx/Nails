"use client";

import { useEffect, useState, useTransition } from "react";
import { Bell, BellRing, Loader2 } from "lucide-react";
import { isPushSupported, subscribeToPush } from "@/lib/push/subscribe";

interface Props {
  label: string;
  activeLabel: string;
  onSubscribe: (subscription: PushSubscriptionJSON) => Promise<{ error?: string; success?: boolean }>;
  className?: string;
}

export default function PushSubscribeButton({ label, activeLabel, onSubscribe, className }: Props) {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSupported(isPushSupported());
    if (isPushSupported()) {
      navigator.serviceWorker.getRegistration().then(async (reg) => {
        const existing = await reg?.pushManager.getSubscription();
        if (existing) setSubscribed(true);
      });
    }
  }, []);

  if (!supported) return null;

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const subscription = await subscribeToPush();
      if (!subscription) {
        setError("Permissão de notificações não concedida.");
        return;
      }
      const result = await onSubscribe(subscription);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSubscribed(true);
    });
  }

  if (subscribed) {
    return (
      <span className={`inline-flex items-center gap-2 text-sm font-medium text-green-600 ${className ?? ""}`}>
        <BellRing className="h-4 w-4" aria-hidden="true" />
        {activeLabel}
      </span>
    );
  }

  return (
    <div className={className}>
      <button type="button" onClick={handleClick} disabled={isPending} className="btn-secondary">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Bell className="h-4 w-4" aria-hidden="true" />}
        {label}
      </button>
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
