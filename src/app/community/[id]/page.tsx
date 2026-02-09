import { createAdminClient } from "@/utils/supabase/admin";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { User, Code, Image as ImageIcon, Calendar, MessageSquare } from "lucide-react";
import { ProjectGrid } from "@/components/project-grid";
import Link from "next/link";
import { notFound } from "next/navigation";

// Force dynamic
export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function UserProfilePage({ params }: Props) {
    const { id } = await params;
    const supabaseAdmin = createAdminClient();

    const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserById(id);

    if (error || !user) {
        notFound();
    }

    const metadata = user.user_metadata || {};
    const name = metadata.full_name || user.email?.split('@')[0] || "User";
    const skills = metadata.skills ? metadata.skills.split(',').map((s: string) => s.trim()) : [];
    const projects = (metadata.projects || []) as any[];

    return (
        <main className="flex min-h-screen flex-col bg-black text-white selection:bg-purple-500/30">
            <Navbar />

            <section className="flex-1 pt-32 pb-20 px-4">
                <div className="max-w-6xl mx-auto space-y-12">

                    {/* Header Profile Card */}
                    <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12 overflow-hidden backdrop-blur-sm">
                        {/* Decorative background */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-4xl font-bold text-white shadow-2xl shadow-purple-900/50 ring-4 ring-black">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>

                            <div className="flex-1">
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{name}</h1>
                                <div className="flex items-center gap-4 mb-6">
                                    <p className="text-xl text-purple-400">{user.email}</p>
                                    <Link
                                        href={`/messages/${id}`}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-bold text-white border border-white/10"
                                    >
                                        <MessageSquare size={16} />
                                        Send Message
                                    </Link>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">About</h3>
                                        <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                                            {metadata.bio || "This user hasn't added a bio yet."}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.length > 0 ? skills.map((skill: string, i: number) => (
                                                <span key={i} className="px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/10 font-medium">
                                                    {skill}
                                                </span>
                                            )) : (
                                                <span className="text-gray-500 italic">No skills listed</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Projects Grid */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                                <Code size={24} />
                            </div>
                            <h2 className="text-3xl font-bold">Projects</h2>
                            <span className="bg-white/10 px-3 py-1 rounded-full text-sm font-bold text-gray-300">
                                {projects.length}
                            </span>
                        </div>

                        <ProjectGrid projects={projects} />
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
