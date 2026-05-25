import postgres from "postgres";

const SCHEMA_VERSION = "v1-cases";
let applied: string | null = null;
let inFlight: Promise<void> | null = null;

const MIGRATION_SQL = `
  CREATE TABLE IF NOT EXISTS public.clinical_cases (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title         text NOT NULL,
    specialty     text NOT NULL DEFAULT '',
    difficulty    text NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    source        text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'chat')),
    session_id    uuid REFERENCES public.chat_sessions(id) ON DELETE SET NULL,
    total_steps   integer NOT NULL DEFAULT 0,
    created_at    timestamptz NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS clinical_cases_user_idx ON public.clinical_cases (user_id, created_at DESC);
  CREATE INDEX IF NOT EXISTS clinical_cases_specialty_idx ON public.clinical_cases (specialty);

  CREATE TABLE IF NOT EXISTS public.case_steps (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id     uuid NOT NULL REFERENCES public.clinical_cases(id) ON DELETE CASCADE,
    position    integer NOT NULL,
    phase       text NOT NULL CHECK (phase IN ('identification', 'complaint', 'history', 'exam', 'labs', 'hypothesis', 'management')),
    title       text NOT NULL,
    content     text NOT NULL,
    question    text,
    options     jsonb,
    correct_key text,
    explanation text,
    created_at  timestamptz NOT NULL DEFAULT now(),
    UNIQUE (case_id, position)
  );
  CREATE INDEX IF NOT EXISTS case_steps_case_idx ON public.case_steps (case_id, position ASC);

  CREATE TABLE IF NOT EXISTS public.case_attempts (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id     uuid NOT NULL REFERENCES public.clinical_cases(id) ON DELETE CASCADE,
    user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    answers     jsonb NOT NULL DEFAULT '{}',
    score       integer NOT NULL DEFAULT 0,
    total       integer NOT NULL DEFAULT 0,
    completed_at timestamptz,
    created_at  timestamptz NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS case_attempts_user_idx ON public.case_attempts (user_id, created_at DESC);

  ALTER TABLE public.clinical_cases ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.case_steps ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.case_attempts ENABLE ROW LEVEL SECURITY;

  DO $$ BEGIN CREATE POLICY "Users see own cases" ON public.clinical_cases FOR SELECT USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN CREATE POLICY "Users insert own cases" ON public.clinical_cases FOR INSERT WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN CREATE POLICY "Users delete own cases" ON public.clinical_cases FOR DELETE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN CREATE POLICY "Users see own case steps" ON public.case_steps FOR SELECT USING (EXISTS (SELECT 1 FROM public.clinical_cases WHERE id = case_steps.case_id AND user_id = auth.uid())); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN CREATE POLICY "Users insert own case steps" ON public.case_steps FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.clinical_cases WHERE id = case_steps.case_id AND user_id = auth.uid())); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN CREATE POLICY "Users see own case attempts" ON public.case_attempts FOR SELECT USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN CREATE POLICY "Users insert own case attempts" ON public.case_attempts FOR INSERT WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN CREATE POLICY "Users update own case attempts" ON public.case_attempts FOR UPDATE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  NOTIFY pgrst, 'reload schema';
`;

export async function ensureCasesSchema(): Promise<void> {
  if (applied === SCHEMA_VERSION) return;
  if (inFlight) return inFlight;

  const url = process.env.DATABASE_URL;
  if (!url) {
    applied = SCHEMA_VERSION;
    return;
  }

  inFlight = (async () => {
    const sql = postgres(url, { max: 1, idle_timeout: 5, connect_timeout: 10, prepare: false });
    try {
      await sql.unsafe(MIGRATION_SQL);
      applied = SCHEMA_VERSION;
      console.log(`[ensure-cases-schema] ${SCHEMA_VERSION} aplicado`);
    } catch (err) {
      console.error("[ensure-cases-schema] falhou:", err);
    } finally {
      await sql.end({ timeout: 5 });
      inFlight = null;
    }
  })();

  return inFlight;
}
