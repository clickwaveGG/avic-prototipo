"use server";

import { createClient } from "@/lib/supabase/server";

export type ChatSessionRow = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export type ChatMessageRow = {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

/**
 * Carrega todas as sessoes do usuario (sem mensagens), ordenadas por updated_at DESC.
 */
export async function loadSessions(): Promise<ChatSessionRow[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("chat_sessions")
    .select("id, title, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[chat] loadSessions error:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Carrega mensagens de uma sessao especifica.
 */
export async function loadMessages(sessionId: string): Promise<ChatMessageRow[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, session_id, role, content, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[chat] loadMessages error:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Cria uma nova sessao de chat e retorna o id.
 */
export async function createSession(title: string): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({ user_id: user.id, title })
    .select("id")
    .single();

  if (error) {
    console.error("[chat] createSession error:", error.message);
    return null;
  }
  return data.id;
}

/**
 * Salva uma mensagem na sessao. Retorna o id da mensagem.
 */
export async function saveMessage(
  sessionId: string,
  role: "user" | "assistant",
  content: string
): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({ session_id: sessionId, role, content })
    .select("id")
    .single();

  if (error) {
    console.error("[chat] saveMessage error:", error.message);
    return null;
  }
  return data.id;
}

/**
 * Atualiza o titulo de uma sessao.
 */
export async function updateSessionTitle(
  sessionId: string,
  title: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("chat_sessions")
    .update({ title })
    .eq("id", sessionId);

  if (error) {
    console.error("[chat] updateSessionTitle error:", error.message);
  }
}
