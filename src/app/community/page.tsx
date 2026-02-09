import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CommunityTabs } from "./community-tabs";

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';

export default async function CommunityPage() {
    const supabase = await createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    // We need to list users regardless of auth status of the viewer
    // Note: This requires SUPABASE_SERVICE_ROLE_KEY in .env
    const supabaseAdmin = createAdminClient();

    // Fetch users. Note limit default is 50.
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
        console.error("Error fetching users:", error);
        return (
            <main className="flex min-h-screen flex-col bg-black text-white selection:bg-purple-500/30">
                <Navbar user={currentUser} />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-red-400">Failed to load community members. Please check configuration.</p>
                </div>
                <Footer />
            </main>
        );
    }

    // Filter users who might not have metadata set up yet or are deleted
    const activeUsers = users.filter(u => u.user_metadata && !u.banned_until);

    return (
        <main className="flex min-h-screen flex-col bg-black text-white selection:bg-purple-500/30">
            <Navbar user={currentUser} />

            <section className="flex-1 px-4 pt-32 pb-20 max-w-7xl mx-auto w-full">
                <div className="mb-16 text-center">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
                        Our <span className="text-purple-500">Community</span>
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Discover talented individuals, explore their portfolios, and connect with like-minded creators.
                    </p>
                </div>

                <CommunityTabs users={activeUsers} />
            </section>

            <Footer />
        </main>
    );
}
