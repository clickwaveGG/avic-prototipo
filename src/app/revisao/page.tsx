import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RevisaoView } from "./revisao-view";

export default async function RevisaoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("display_name, tier")
    .eq("id", user.id)
    .single();

  if (!profile?.display_name) redirect("/bem-vindo");

  return <RevisaoView email={user.email ?? ""} profile={profile} />;
}
