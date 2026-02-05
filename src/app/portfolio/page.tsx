import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/utils/supabase/server";
import { PortfolioClient } from "./portfolio-client";
import { redirect } from "next/navigation";

export default async function PortfolioPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <main className="flex min-h-screen flex-col bg-black text-white selection:bg-purple-500/30">
            <Navbar />
            <PortfolioClient user={user} />
            <Footer />
        </main>
    );
}
