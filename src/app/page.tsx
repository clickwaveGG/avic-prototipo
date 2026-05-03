import { createClient } from "@/lib/supabase/server";
import { Landing } from "@/components/landing";
import { Workspace } from "@/components/workspace";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <Landing />;
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("display_name, tier")
    .eq("id", user.id)
    .single();

  return <Workspace email={user.email ?? ""} profile={profile} />;
}
