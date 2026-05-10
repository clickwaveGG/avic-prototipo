import postgres from "postgres";

/**
 * Aplica idempotentemente a migration do onboarding no Supabase.
 * Cacheada em memória pra não rodar a cada request (por instance Vercel).
 *
 * IMPORTANTE: depois do ALTER TABLE, dispara NOTIFY pgrst,'reload schema'
 * pra que o PostgREST do Supabase invalide o schema cache e enxergue as
 * novas colunas. Sem isso, supabase-js continua dizendo "column not found"
 * mesmo a coluna existindo no banco.
 *
 * Versão do schema: incrementar SCHEMA_VERSION quando a migration mudar,
 * pra forçar nova execução em deploys futuros.
 */

const SCHEMA_VERSION = "v3-pgrst-reload";
let applied: string | null = null;
let inFlight: Promise<void> | null = null;

const MIGRATION_SQL = `
  ALTER TABLE public.user_profiles
    ADD COLUMN IF NOT EXISTS course        text,
    ADD COLUMN IF NOT EXISTS period        text,
    ADD COLUMN IF NOT EXISTS cohort        text,
    ADD COLUMN IF NOT EXISTS academy       text,
    ADD COLUMN IF NOT EXISTS pronouns      text,
    ADD COLUMN IF NOT EXISTS onboarded_at  timestamptz;

  CREATE INDEX IF NOT EXISTS user_profiles_onboarded_idx
    ON public.user_profiles (onboarded_at)
    WHERE onboarded_at IS NOT NULL;

  NOTIFY pgrst, 'reload schema';
`;

export async function ensureOnboardingSchema(): Promise<void> {
  if (applied === SCHEMA_VERSION) return;
  if (inFlight) return inFlight;

  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn("[ensure-schema] DATABASE_URL ausente — pulando migration");
    applied = SCHEMA_VERSION;
    return;
  }

  inFlight = (async () => {
    const sql = postgres(url, {
      max: 1,
      idle_timeout: 5,
      connect_timeout: 10,
      prepare: false,
    });
    try {
      await sql.unsafe(MIGRATION_SQL);
      applied = SCHEMA_VERSION;
      console.log(`[ensure-schema] ${SCHEMA_VERSION} aplicado · pgrst notificado`);
    } catch (err) {
      console.error("[ensure-schema] falhou:", err);
      // Não throw — degradação graciosa. Próxima request tenta de novo.
    } finally {
      await sql.end({ timeout: 5 });
      inFlight = null;
    }
  })();

  return inFlight;
}

/**
 * Força reload do schema cache do PostgREST sem rodar ALTER.
 * Útil se algum admin alterar o schema fora do code.
 */
export async function reloadPostgrestSchema(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) return;
  const sql = postgres(url, { max: 1, idle_timeout: 5, prepare: false });
  try {
    await sql.unsafe("NOTIFY pgrst, 'reload schema';");
    console.log("[ensure-schema] pgrst reload disparado");
  } catch (err) {
    console.error("[ensure-schema] reload falhou:", err);
  } finally {
    await sql.end({ timeout: 5 });
  }
}
