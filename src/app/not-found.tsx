import Link from "next/link";

export default function NotFound() {
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
          color: "var(--primary)",
          lineHeight: 1,
          marginBottom: "0.5rem",
          fontFamily: "var(--font-display)",
        }}
      >
        404
      </p>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          marginBottom: "0.75rem",
        }}
      >
        Pagina nao encontrada
      </h1>
      <p
        style={{
          color: "var(--text-secondary)",
          marginBottom: "2rem",
          maxWidth: "28rem",
        }}
      >
        O codice que voce procura nao esta neste compendio. Verifique o endereco
        ou retorne ao consultorio.
      </p>
      <Link
        href="/"
        style={{
          background: "var(--primary)",
          color: "white",
          padding: "0.75rem 1.5rem",
          borderRadius: "0.5rem",
          textDecoration: "none",
          fontWeight: 500,
          fontSize: "0.875rem",
        }}
      >
        Voltar ao inicio
      </Link>
    </div>
  );
}
