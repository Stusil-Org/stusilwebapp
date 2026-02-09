import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SettingsClient } from "./settings-client";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <main className="flex min-h-screen flex-col bg-black text-white selection:bg-purple-500/30">
            <Navbar user={user} />
            <SettingsClient user={user} />
            <Footer />
        </main>
    );
}
