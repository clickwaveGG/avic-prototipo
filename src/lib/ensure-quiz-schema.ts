import postgres from "postgres";

const SCHEMA_VERSION = "v1-quizzes";
let applied: string | null = null;
let inFlight: Promise<void> | null = null;

const MIGRATION_SQL = `
  CREATE TABLE IF NOT EXISTS public.quizzes (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title       text NOT NULL,
    topic       text NOT NULL DEFAULT '',
    source      text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'chat', 'scheduled')),
    session_id  uuid REFERENCES public.chat_sessions(id) ON DELETE SET NULL,
    total_questions integer NOT NULL DEFAULT 5,
    created_at  timestamptz NOT NULL DEFAULT now()
  );

  CREATE INDEX IF NOT EXISTS quizzes_user_idx
    ON public.quizzes (user_id, created_at DESC);

  CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id     uuid NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    position    integer NOT NULL,
    stem        text NOT NULL,
    options     jsonb NOT NULL DEFAULT '[]',
    correct_key text NOT NULL,
    explanation text NOT NULL DEFAULT '',
    created_at  timestamptz NOT NULL DEFAULT now(),
    UNIQUE (quiz_id, position)
  );

  CREATE INDEX IF NOT EXISTS quiz_questions_quiz_idx
    ON public.quiz_questions (quiz_id, position ASC);

  CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id     uuid NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    answers     jsonb NOT NULL DEFAULT '{}',
    score       integer NOT NULL DEFAULT 0,
    total       integer NOT NULL DEFAULT 0,
    completed_at timestamptz,
    created_at  timestamptz NOT NULL DEFAULT now()
  );

  CREATE INDEX IF NOT EXISTS quiz_attempts_user_idx
    ON public.quiz_attempts (user_id, created_at DESC);

  CREATE INDEX IF NOT EXISTS quiz_attempts_quiz_idx
    ON public.quiz_attempts (quiz_id);

  ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

  DO $$ BEGIN
    CREATE POLICY "Users see own quizzes" ON public.quizzes FOR SELECT USING (auth.uid() = user_id);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    CREATE POLICY "Users insert own quizzes" ON public.quizzes FOR INSERT WITH CHECK (auth.uid() = user_id);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    CREATE POLICY "Users delete own quizzes" ON public.quizzes FOR DELETE USING (auth.uid() = user_id);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    CREATE POLICY "Users see own quiz questions" ON public.quiz_questions FOR SELECT
      USING (EXISTS (SELECT 1 FROM public.quizzes WHERE id = quiz_questions.quiz_id AND user_id = auth.uid()));
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    CREATE POLICY "Users insert own quiz questions" ON public.quiz_questions FOR INSERT
      WITH CHECK (EXISTS (SELECT 1 FROM public.quizzes WHERE id = quiz_questions.quiz_id AND user_id = auth.uid()));
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    CREATE POLICY "Users see own attempts" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    CREATE POLICY "Users insert own attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    CREATE POLICY "Users update own attempts" ON public.quiz_attempts FOR UPDATE USING (auth.uid() = user_id);
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  NOTIFY pgrst, 'reload schema';
`;

export async function ensureQuizSchema(): Promise<void> {
  if (applied === SCHEMA_VERSION) return;
  if (inFlight) return inFlight;

  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn("[ensure-quiz-schema] DATABASE_URL ausente — pulando migration");
    applied = SCHEMA_VERSION;
    return;
  }

  inFlight = (async () => {
    const sql = postgres(url, { max: 1, idle_timeout: 5, connect_timeout: 10, prepare: false });
    try {
      await sql.unsafe(MIGRATION_SQL);
      applied = SCHEMA_VERSION;
      console.log(`[ensure-quiz-schema] ${SCHEMA_VERSION} aplicado`);
    } catch (err) {
      console.error("[ensure-quiz-schema] falhou:", err);
    } finally {
      await sql.end({ timeout: 5 });
      inFlight = null;
    }
  })();

  return inFlight;
}
