"use server";

import { createClient } from "@/lib/supabase/server";

export type DashboardStats = {
  totalSessions: number;
  sessionsThisWeek: number;
  streakDays: number;
  lastSession: {
    title: string;
    lastMessage: string;
    updatedAt: string;
  } | null;
};

/**
 * Busca estatísticas reais do dashboard baseadas no uso do chat.
 */
export async function loadDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { totalSessions: 0, sessionsThisWeek: 0, streakDays: 0, lastSession: null };
  }

  // Total de sessões
  const { count: totalSessions } = await supabase
    .from("chat_sessions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Sessões desta semana
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const { count: sessionsThisWeek } = await supabase
    .from("chat_sessions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", weekAgo.toISOString());

  // Última sessão com última mensagem
  const { data: lastSessionData } = await supabase
    .from("chat_sessions")
    .select("id, title, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  let lastSession: DashboardStats["lastSession"] = null;
  if (lastSessionData) {
    const { data: lastMsg } = await supabase
      .from("chat_messages")
      .select("content")
      .eq("session_id", lastSessionData.id)
      .eq("role", "user")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    lastSession = {
      title: lastSessionData.title,
      lastMessage: lastMsg?.content?.slice(0, 100) ?? "",
      updatedAt: lastSessionData.updated_at,
    };
  }

  // Streak: dias consecutivos com sessões (simplificado)
  const { data: recentSessions } = await supabase
    .from("chat_sessions")
    .select("created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(90);

  let streakDays = 0;
  if (recentSessions && recentSessions.length > 0) {
    const days = new Set(
      recentSessions.map((s) =>
        new Date(s.created_at).toISOString().split("T")[0]
      )
    );
    const today = new Date();
    for (let i = 0; i < 90; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      if (days.has(key)) {
        streakDays++;
      } else if (i > 0) {
        break;
      }
    }
  }

  return {
    totalSessions: totalSessions ?? 0,
    sessionsThisWeek: sessionsThisWeek ?? 0,
    streakDays,
    lastSession,
  };
}
