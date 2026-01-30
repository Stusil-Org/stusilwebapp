"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { User, Eye, Code, Save } from "lucide-react";

export default function PortfolioPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        bio: "",
        skills: "",
        projects: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const skillsList = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    const projectsList = formData.projects
        .split("\n")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

    return (
        <main className="flex min-h-screen flex-col bg-black text-white selection:bg-purple-500/30">
            <Navbar />

            <section className="flex flex-1 flex-col items-center px-4 pt-32 pb-20">
                <div className="w-full max-w-6xl">
                    {/* Header */}
                    <div className="mb-16 text-center">
                        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
                            Portfolio <span className="text-purple-500">Builder</span>
                        </h1>
                        <p className="text-lg text-gray-400">
                            Create your professional portfolio in minutes and showcase your
                            skills.
                        </p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Left Column: Form */}
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
                            <div className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
                                <Code className="h-6 w-6 text-purple-500" />
                                <h2>Build Your Portfolio</h2>
                            </div>

                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                {/* Full Name */}
                                <div className="space-y-2">
                                    <label htmlFor="fullName" className="text-sm font-bold text-gray-300">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-bold text-gray-300">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@university.edu"
                                        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    />
                                </div>

                                {/* Bio */}
                                <div className="space-y-2">
                                    <label htmlFor="bio" className="text-sm font-bold text-gray-300">
                                        Bio
                                    </label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Tell the world about yourself..."
                                        className="w-full resize-none rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    />
                                </div>

                                {/* Skills */}
                                <div className="space-y-2">
                                    <label htmlFor="skills" className="text-sm font-bold text-gray-300">
                                        Skills
                                    </label>
                                    <input
                                        type="text"
                                        id="skills"
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleChange}
                                        placeholder="React, Node.js, Python, UI/UX..."
                                        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    />
                                    <p className="text-xs text-gray-500">Separate skills with commas</p>
                                </div>

                                {/* Projects */}
                                <div className="space-y-2">
                                    <label htmlFor="projects" className="text-sm font-bold text-gray-300">
                                        Projects
                                    </label>
                                    <textarea
                                        id="projects"
                                        name="projects"
                                        value={formData.projects}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Project 1 - Description&#10;Project 2 - Description&#10;Project 3 - Description"
                                        className="w-full resize-none rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    />
                                    <p className="text-xs text-gray-500">One project per line</p>
                                </div>

                                {/* Save Button */}
                                <button
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3.5 text-base font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02] hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
                                >
                                    <Save className="h-5 w-5" />
                                    Save Portfolio
                                </button>
                            </form>
                        </div>

                        {/* Right Column: Preview */}
                        <div className="relative">
                            <div className="sticky top-24 rounded-3xl border border-white/10 bg-black p-6 md:p-8 shadow-2xl">
                                <div className="mb-8 flex items-center gap-2 text-xl font-bold text-white">
                                    <Eye className="h-6 w-6 text-purple-500" />
                                    <h2>Live Preview</h2>
                                </div>

                                {/* Profile Header */}
                                <div className="mb-8 flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-purple-400 ring-1 ring-purple-500/30">
                                        <User className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">
                                            {formData.fullName || "Your Name"}
                                        </h3>
                                        <p className="text-gray-400">
                                            {formData.email || "your@email.com"}
                                        </p>
                                    </div>
                                </div>

                                {/* About Section */}
                                <div className="mb-8">
                                    <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-gray-500">
                                        About
                                    </h4>
                                    <p className="text-gray-300 leading-relaxed">
                                        {formData.bio || "Your bio will appear here..."}
                                    </p>
                                </div>

                                {/* Skills Section */}
                                <div className="mb-8">
                                    <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">
                                        Skills
                                    </h4>
                                    {skillsList.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {skillsList.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="rounded-md bg-white/5 px-3 py-1 text-sm font-medium text-purple-300 ring-1 ring-purple-500/20"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-600 italic">Add skills above...</p>
                                    )}
                                </div>

                                {/* Projects Section */}
                                <div>
                                    <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">
                                        Projects
                                    </h4>
                                    {projectsList.length > 0 ? (
                                        <ul className="space-y-3">
                                            {projectsList.map((project, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                                                    <span className="text-gray-300">{project}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-600 italic">Add projects above...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
