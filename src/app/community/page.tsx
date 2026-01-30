"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Search, User, Briefcase, Code } from "lucide-react";
import Link from "next/link";

const members = [
    {
        name: "Member HiybnF",
        role: "Developer",
        roleIcon: Code,
        tags: ["TypeScript", "React"],
        bio: "I build things",
        color: "purple",
    },
    {
        name: "Tanisha",
        role: "Founder",
        roleIcon: Briefcase,
        tags: ["Entrepreneurship"],
        bio: "I love exploring innovation and business",
        color: "indigo",
    },
    // Adding more placeholders to fill the grid
    {
        name: "Alex Designer",
        role: "Designer",
        roleIcon: User,
        tags: ["Figma", "UI/UX"],
        bio: "Designing intuitive user experiences.",
        color: "pink",
    },
    {
        name: "Sam Coder",
        role: "Full Stack",
        roleIcon: Code,
        tags: ["Next.js", "Node.js"],
        bio: "Full stack enthusiast building web apps.",
        color: "blue",
    },
];

export default function CommunityPage() {
    return (
        <main className="flex min-h-screen flex-col bg-black text-white selection:bg-purple-500/30">
            <Navbar />

            <section className="flex flex-1 flex-col items-center px-4 pt-32 pb-20">
                <div className="w-full max-w-5xl">
                    {/* Header Section */}
                    <div className="mb-12 text-center">
                        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
                            Student <span className="text-purple-500">Community</span>
                        </h1>
                        <p className="mb-8 text-lg text-gray-400">
                            Discover peers, join projects, and collaborate with motivated
                            students.
                        </p>

                        <Link href="/join">
                            <button className="rounded-full bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-3 font-bold text-white shadow-lg shadow-purple-500/30 transition-transform hover:scale-105 hover:shadow-purple-500/50">
                                Join Community
                            </button>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="mx-auto mb-16 max-w-2xl relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <Search className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by skills, role, or name..."
                            className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                    </div>

                    {/* Members Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {members.map((member, index) => (
                            <div
                                key={index}
                                className="group relative flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10"
                            >
                                <div className="mb-6 flex items-start justify-between">
                                    {/* Avatar Placeholder */}
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-900/30 text-purple-400 ring-1 ring-purple-500/30">
                                        <User className="h-6 w-6" />
                                    </div>

                                    {/* Role Badge */}
                                    <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-medium text-gray-300">
                                        <member.roleIcon className="h-3 w-3" />
                                        {member.role}
                                    </div>
                                </div>

                                <h3 className="mb-2 text-xl font-bold text-white">
                                    {member.name}
                                </h3>

                                {/* Tags */}
                                <div className="mb-4 flex flex-wrap gap-2">
                                    {member.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-md bg-white/5 px-2.5 py-1 text-xs font-medium text-gray-400 ring-1 ring-white/10"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <p className="text-sm text-gray-500">
                                    {member.bio}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
