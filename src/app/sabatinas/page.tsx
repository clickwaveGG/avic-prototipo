import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SabatinasView } from "./sabatinas-view";

export default async function SabatinasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("display_name, tier")
    .eq("id", user.id)
    .single();

  if (!profile?.display_name) redirect("/bem-vindo");

  return (
    <SabatinasView
      email={user.email ?? ""}
      profile={profile}
    />
  );
}
