"use client";

import { useState } from "react";
import Link from "next/link";
import { Code, User, Rocket, Users, FolderOpen } from "lucide-react";
import { ProjectGrid, Project } from "@/components/project-grid";

interface CommunityTabsProps {
    users: any[];
}

export function CommunityTabs({ users }: CommunityTabsProps) {
    const [activeTab, setActiveTab] = useState<'members' | 'projects' | 'open'>('members');

    // Aggregate projects
    const allProjects: Project[] = users.flatMap(user => {
        const metadata = user.user_metadata || {};
        const userProjects = (metadata.projects || []) as any[];
        const name = metadata.full_name || user.email?.split('@')[0] || "User";

        return userProjects.map(p => ({
            ...p,
            author: {
                name: name,
                id: user.id,
                email: user.email,
                avatar: user.email?.charAt(0).toUpperCase()
            }
        }));
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="w-full">
            {/* Tabs */}
            <div className="flex justify-center mb-12">
                <div className="flex p-1 bg-white/5 border border-white/10 rounded-full gap-1">
                    <button
                        onClick={() => setActiveTab('members')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'members' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Users size={16} />
                        Members
                    </button>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'projects' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Rocket size={16} />
                        Showcase
                    </button>
                    <button
                        onClick={() => setActiveTab('open')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'open' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <FolderOpen size={16} />
                        Open Projects
                    </button>
                </div>
            </div>

            {/* Content */}
            {activeTab === 'members' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {users.map((user) => {
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
            )}

            {activeTab === 'projects' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ProjectGrid projects={allProjects} />
                </div>
            )}

            {activeTab === 'open' && (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <FolderOpen size={48} className="text-purple-500 opacity-50" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Open Projects</h3>
                    <p className="text-gray-400 max-w-md">
                        This section contains open-source projects inviting collaboration.
                        No open projects are available at the moment. Check back soon!
                    </p>
                </div>
            )}
        </div>
    );
}
