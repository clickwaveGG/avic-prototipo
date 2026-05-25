import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CasosView } from "./casos-view";

export default async function CasosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("display_name, tier")
    .eq("id", user.id)
    .single();

  if (!profile?.display_name) redirect("/bem-vindo");

  return <CasosView email={user.email ?? ""} profile={profile} />;
}
