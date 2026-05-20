"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="pt-BR">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F7F9F8",
          color: "#0F1A14",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
          textAlign: "center",
          margin: 0,
        }}
      >
        <p style={{ fontSize: "5rem", fontWeight: 700, color: "#D4373F", lineHeight: 1, marginBottom: "0.5rem" }}>
          Erro critico
        </p>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.75rem" }}>
          Algo deu muito errado
        </h1>
        <p style={{ color: "#5A6B62", marginBottom: "2rem", maxWidth: "28rem" }}>
          O sistema encontrou um erro critico. Tente recarregar a pagina.
        </p>
        <button
          onClick={reset}
          style={{
            background: "#0B7A65",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "0.875rem",
          }}
        >
          Recarregar
        </button>
      </body>
    </html>
  );
}
