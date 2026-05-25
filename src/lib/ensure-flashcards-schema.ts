import postgres from "postgres";

const SCHEMA_VERSION = "v1-flashcards";
let applied: string | null = null;
let inFlight: Promise<void> | null = null;

const MIGRATION_SQL = `
  CREATE TABLE IF NOT EXISTS public.flashcards (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    front         text NOT NULL,
    back          text NOT NULL,
    topic         text NOT NULL DEFAULT '',
    source        text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'chat', 'quiz_error')),
    source_id     uuid,
    ease_factor   real NOT NULL DEFAULT 2.5,
    interval_days integer NOT NULL DEFAULT 0,
    repetitions   integer NOT NULL DEFAULT 0,
    next_review   timestamptz NOT NULL DEFAULT now(),
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS flashcards_user_idx ON public.flashcards (user_id, next_review ASC);
  CREATE INDEX IF NOT EXISTS flashcards_due_idx ON public.flashcards (user_id, next_review) WHERE next_review <= now();
  CREATE INDEX IF NOT EXISTS flashcards_topic_idx ON public.flashcards (user_id, topic);

  CREATE TABLE IF NOT EXISTS public.review_log (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    flashcard_id  uuid NOT NULL REFERENCES public.flashcards(id) ON DELETE CASCADE,
    user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    grade         integer NOT NULL CHECK (grade BETWEEN 0 AND 5),
    ease_before   real NOT NULL,
    ease_after    real NOT NULL,
    interval_before integer NOT NULL,
    interval_after  integer NOT NULL,
    reviewed_at   timestamptz NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS review_log_user_idx ON public.review_log (user_id, reviewed_at DESC);
  CREATE INDEX IF NOT EXISTS review_log_card_idx ON public.review_log (flashcard_id, reviewed_at DESC);

  ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.review_log ENABLE ROW LEVEL SECURITY;

  DO $$ BEGIN CREATE POLICY "Users see own flashcards" ON public.flashcards FOR SELECT USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN CREATE POLICY "Users insert own flashcards" ON public.flashcards FOR INSERT WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN CREATE POLICY "Users update own flashcards" ON public.flashcards FOR UPDATE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN CREATE POLICY "Users delete own flashcards" ON public.flashcards FOR DELETE USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN CREATE POLICY "Users see own reviews" ON public.review_log FOR SELECT USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN CREATE POLICY "Users insert own reviews" ON public.review_log FOR INSERT WITH CHECK (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  NOTIFY pgrst, 'reload schema';
`;

export async function ensureFlashcardsSchema(): Promise<void> {
  if (applied === SCHEMA_VERSION) return;
  if (inFlight) return inFlight;

  const url = process.env.DATABASE_URL;
  if (!url) { applied = SCHEMA_VERSION; return; }

  inFlight = (async () => {
    const sql = postgres(url, { max: 1, idle_timeout: 5, connect_timeout: 10, prepare: false });
    try {
      await sql.unsafe(MIGRATION_SQL);
      applied = SCHEMA_VERSION;
      console.log(`[ensure-flashcards-schema] ${SCHEMA_VERSION} aplicado`);
    } catch (err) {
      console.error("[ensure-flashcards-schema] falhou:", err);
    } finally {
      await sql.end({ timeout: 5 });
      inFlight = null;
    }
  })();
  return inFlight;
}
