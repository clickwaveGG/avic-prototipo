-- ══════════════════════════════════════════════════════════════
-- Migration: Chat History (sessions + messages)
-- Avicena — persistencia de anamneses
-- ══════════════════════════════════════════════════════════════

-- Sessoes de chat (anamneses)
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text NOT NULL DEFAULT 'Nova anamnese',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chat_sessions_user_idx
  ON public.chat_sessions (user_id, updated_at DESC);

-- Mensagens individuais
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  uuid NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role        text NOT NULL CHECK (role IN ('user', 'assistant')),
  content     text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chat_messages_session_idx
  ON public.chat_messages (session_id, created_at ASC);

-- ══════════════════════════════════════════════════════════════
-- RLS — Row Level Security
-- ══════════════════════════════════════════════════════════════

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Usuarios so veem suas proprias sessoes
CREATE POLICY "Users see own sessions"
  ON public.chat_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own sessions"
  ON public.chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own sessions"
  ON public.chat_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own sessions"
  ON public.chat_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Usuarios so veem mensagens de suas proprias sessoes
CREATE POLICY "Users see own messages"
  ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions
      WHERE id = chat_messages.session_id
        AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users insert own messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_sessions
      WHERE id = chat_messages.session_id
        AND user_id = auth.uid()
    )
  );

-- Trigger para atualizar updated_at na sessao quando nova mensagem chegar
CREATE OR REPLACE FUNCTION public.touch_session_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chat_sessions
  SET updated_at = now()
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_touch_session ON public.chat_messages;
CREATE TRIGGER trg_touch_session
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_session_updated_at();

-- Notifica PostgREST para recarregar schema
NOTIFY pgrst, 'reload schema';
