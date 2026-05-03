"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  className?: string;
  children: ReactNode;
};

export function GoogleLoginButton({ className, children }: Props) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (e.data === "avicena-auth-ok") {
        window.location.reload();
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  async function handle() {
    if (loading) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?popup=1`,
          skipBrowserRedirect: true,
          queryParams: { access_type: "offline", prompt: "consent" },
        },
      });

      if (error || !data?.url) {
        alert(`Erro ao iniciar login: ${error?.message ?? "sem URL"}`);
        setLoading(false);
        return;
      }

      const w = 500;
      const h = 640;
      const left = window.screenX + (window.outerWidth - w) / 2;
      const top = window.screenY + (window.outerHeight - h) / 2;
      const popup = window.open(
        data.url,
        "avicena-oauth",
        `width=${w},height=${h},left=${left},top=${top},popup=yes,scrollbars=yes`
      );

      if (!popup) {
        alert("Pop-up bloqueado. Libera pop-ups pra esse site e tenta de novo.");
        setLoading(false);
        return;
      }

      const interval = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(interval);
            window.location.reload();
          }
        } catch {}
      }, 500);
    } catch (err) {
      alert(`Falha no login: ${(err as Error).message}`);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handle}
      disabled={loading}
    >
      {children}
    </button>
  );
}
