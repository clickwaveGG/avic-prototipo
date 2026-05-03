import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#B8DDD2] bg-[#E6F5F0] px-3 py-1 text-xs font-medium text-[#0B7A65]">
        Sprint 1.1 · App em construção
      </span>

      <h1
        className="mb-5 text-4xl font-bold leading-tight tracking-tight text-[#0F1A14] sm:text-5xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Consultório do{" "}
        <span className="italic text-[#0B7A65]">Avicena</span>
      </h1>

      <p className="mb-10 max-w-xl text-base leading-relaxed text-[#5A6B62] sm:text-lg">
        Aqui é onde teu códice vira parecer. Login, upload e chat com Hipócrates
        em breve. Por enquanto, validando que o app subiu certinho.
      </p>

      <div className="rounded-xl border border-[#DDE5E1] bg-white p-6 text-left shadow-sm">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#8A9B92]">
          Status auth
        </p>
        {user ? (
          <p
            className="text-sm text-[#0F1A14]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ✓ logado como {user.email}
          </p>
        ) : (
          <p
            className="text-sm text-[#5A6B62]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ○ sem sessão · login Google chega no Sprint 1.2
          </p>
        )}
        <p className="mt-3 text-xs text-[#8A9B92]">
          Conexão com Supabase ativa. Próximo: aplicar SCHEMA.sql + auth Google.
        </p>
      </div>
    </section>
  );
}
