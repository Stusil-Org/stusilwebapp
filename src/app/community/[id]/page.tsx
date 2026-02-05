import { createAdminClient } from "@/utils/supabase/admin";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { User, Code, Image as ImageIcon, Calendar, MessageSquare } from "lucide-react";
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

                        {projects.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {projects.map((project, index) => (
                                    <div key={index} className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-all hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col h-full">
                                        {/* Image Gallery Preview */}
                                        <div className="aspect-video bg-black/50 relative overflow-hidden group">
                                            {project.images && project.images.length > 0 ? (
                                                <img
                                                    src={project.images[0]}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                    <ImageIcon size={40} opacity={0.5} />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                                <p className="text-white font-medium text-sm">
                                                    View details
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                                                    {project.title}
                                                </h3>
                                                {project.completionDate && (
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-md border ${project.completionDate === 'Ongoing' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                                                        {project.completionDate === 'Ongoing' ? 'In Progress' : project.completionDate}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-4">
                                                {project.description}
                                            </p>

                                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5 text-xs text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={12} />
                                                    <span>Added {new Date(project.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 rounded-3xl border border-dashed border-white/10 bg-white/5">
                                <p className="text-gray-500 text-lg">No projects showcased yet.</p>
                            </div>
                        )}
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
