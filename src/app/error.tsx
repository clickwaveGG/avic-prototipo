"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "var(--font-body)",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontSize: "5rem",
          fontWeight: 700,
          color: "var(--vital-red)",
          lineHeight: 1,
          marginBottom: "0.5rem",
          fontFamily: "var(--font-display)",
        }}
      >
        Erro
      </p>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          marginBottom: "0.75rem",
        }}
      >
        Algo deu errado
      </h1>
      <p
        style={{
          color: "var(--text-secondary)",
          marginBottom: "2rem",
          maxWidth: "28rem",
        }}
      >
        O Hipocrates encontrou um problema inesperado. Tente novamente ou
        retorne ao inicio.
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={reset}
          style={{
            background: "var(--primary)",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "0.875rem",
          }}
        >
          Tentar novamente
        </button>
        <a
          href="/"
          style={{
            background: "transparent",
            color: "var(--primary)",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            border: "1px solid var(--border)",
            textDecoration: "none",
            fontWeight: 500,
            fontSize: "0.875rem",
          }}
        >
          Voltar ao inicio
        </a>
      </div>
    </div>
  );
}
