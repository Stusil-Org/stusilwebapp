import { createAdminClient } from "@/utils/supabase/admin";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { User, Code } from "lucide-react";

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';

export default async function CommunityPage() {
    // We need to list users regardless of auth status of the viewer
    // Note: This requires SUPABASE_SERVICE_ROLE_KEY in .env
    const supabaseAdmin = createAdminClient();

    // Fetch users. Note limit default is 50.
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
        console.error("Error fetching users:", error);
        return (
            <main className="flex min-h-screen flex-col bg-black text-white selection:bg-purple-500/30">
                <Navbar />
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
            <Navbar />

            <section className="flex-1 px-4 pt-32 pb-20 max-w-7xl mx-auto w-full">
                <div className="mb-16 text-center">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
                        Our <span className="text-purple-500">Community</span>
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Discover talented individuals, explore their portfolios, and connect with like-minded creators.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {activeUsers.map((user) => {
                        const metadata = user.user_metadata || {};
                        const name = metadata.full_name || user.email?.split('@')[0] || "User";
                        const skills = metadata.skills ? metadata.skills.split(',').slice(0, 3) : [];

                        return (
                            <Link
                                href={`/community/${user.id}`}
                                key={user.id}
                                className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-purple-900/40">
                                        {user.email?.charAt(0).toUpperCase()}
                                    </div>

                                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors mb-1">
                                        {name}
                                    </h3>

                                    <p className="text-sm text-gray-400 mb-4 line-clamp-2 min-h-[40px]">
                                        {metadata.bio || "No bio available."}
                                    </p>

                                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                                        {skills.length > 0 ? skills.map((skill: string, i: number) => (
                                            <span key={i} className="text-xs px-2 py-1 rounded-md bg-white/5 text-purple-300 border border-purple-500/20">
                                                {skill.trim()}
                                            </span>
                                        )) : (
                                            <span className="text-xs text-gray-600">No skills listed</span>
                                        )}
                                    </div>

                                    <div className="mt-auto pt-4 w-full flex items-center justify-between border-t border-white/5 text-xs text-gray-500">
                                        <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1">
                                            <Code size={12} />
                                            {metadata.projects?.length || 0} Projects
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <Footer />
        </main>
    );
}
