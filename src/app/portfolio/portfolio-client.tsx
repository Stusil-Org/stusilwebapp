"use client";

import { useState } from "react";
import { User, Eye, Code, Save, Plus, Edit2, X, Image as ImageIcon, Loader2, ChevronDown } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { updateProfile, addProject } from "./actions";
import { useRouter } from "next/navigation";

interface PortfolioClientProps {
    user: SupabaseUser | null;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { label: string; value: string | number }[];
    placeholder: string;
    disabled?: boolean;
}

function CustomSelect({ value, onChange, options, placeholder, disabled }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative min-w-[140px]">
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left outline-none focus:border-purple-500 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}`}
            >
                <span className={`text-sm ${value ? "text-white" : "text-gray-500"}`}>
                    {options.find(o => o.value.toString() === value)?.label || placeholder}
                </span>
                <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-[#0A0A0A] border border-white/10 rounded-xl z-50 shadow-2xl py-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value.toString());
                                    setIsOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-purple-600/20 hover:text-white transition-colors flex items-center gap-2"
                            >
                                {value === option.value.toString() && <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                                <span className={value === option.value.toString() ? "font-bold text-white" : ""}>
                                    {option.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export function PortfolioClient({ user }: PortfolioClientProps) {
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isAddingProject, setIsAddingProject] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Profile State
    const [profileData, setProfileData] = useState({
        bio: user?.user_metadata?.bio || "",
        skills: user?.user_metadata?.skills || "",
    });

    // Project State
    const [projectData, setProjectData] = useState({
        title: "",
        description: "",
        completionDate: "",
        isOngoing: false,
        images: [] as File[]
    });

    const router = useRouter();

    const skillsList = (user?.user_metadata?.skills?.split(",") || [])
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);

    // projects stored in metadata?
    const projectsList = (user?.user_metadata?.projects || []) as any[];

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append("bio", profileData.bio);
        formData.append("skills", profileData.skills);

        const result = await updateProfile(formData);
        setIsLoading(false);

        if (result.error) {
            setMessage({ type: 'error', text: result.error });
        } else {
            setIsEditingProfile(false);
            setMessage({ type: 'success', text: "Profile updated!" });
            router.refresh(); // Refresh to show new metadata
        }
    };

    const handleProjectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append("title", projectData.title);
        formData.append("description", projectData.description);

        if (projectData.isOngoing) {
            formData.append("completionDate", "Ongoing");
        } else {
            formData.append("completionDate", projectData.completionDate);
        }

        projectData.images.forEach(img => formData.append("images", img));

        const result = await addProject(formData);
        setIsLoading(false);

        if (result.error) {
            setMessage({ type: 'error', text: result.error });
        } else {
            setIsAddingProject(false);
            setProjectData({ title: "", description: "", completionDate: "", isOngoing: false, images: [] });
            setMessage({ type: 'success', text: "Project added!" });
            router.refresh();
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            // Limit to 8
            setProjectData(prev => ({
                ...prev,
                images: [...prev.images, ...newFiles].slice(0, 8)
            }));
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-gray-400 mb-4">You need to be logged in to manage your portfolio.</p>
            </div>
        );
    }

    return (
        <section className="flex flex-1 flex-col items-center px-4 pt-32 pb-20">
            <div className="w-full max-w-6xl">

                {/* Header Area */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-white">
                            My <span className="text-purple-500">Portfolio</span>
                        </h1>
                        <p className="text-gray-400 mt-2">Manage your profile and showcase your best work.</p>
                    </div>
                </div>

                {message && (
                    <div className={`mb-8 p-4 rounded-xl text-center ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {message.text}
                    </div>
                )}

                {/* Profile Section */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-12 relative overflow-hidden backdrop-blur-sm">
                    {/* decorative bg */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-purple-500/20">
                                    {user.email?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{user.user_metadata?.full_name || user.email?.split('@')[0]}</h2>
                                    <p className="text-gray-400">{user.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditingProfile(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
                            >
                                <Edit2 size={16} />
                                Edit Profile
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">About Me</h3>
                                <p className="text-gray-300 leading-relaxed min-h-[60px]">
                                    {user.user_metadata?.bio || <span className="text-gray-600 italic">No bio added yet. Click edit to add one.</span>}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skillsList.length > 0 ? skillsList.map((skill: string, i: number) => (
                                        <span key={i} className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-sm">
                                            {skill}
                                        </span>
                                    )) : (
                                        <span className="text-gray-600 italic">No skills listed.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Projects Section */}
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Projects</h2>
                    <button
                        onClick={() => setIsAddingProject(true)}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 transition-all font-bold shadow-lg shadow-purple-500/25"
                    >
                        <Plus size={18} />
                        Add Project
                    </button>
                </div>

                {projectsList && projectsList.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projectsList.map((project, index) => (
                            <div key={index} className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-purple-500/30 transition-all hover:shadow-2xl hover:shadow-purple-500/10">
                                {/* Image Preview (First image or placeholder) */}
                                <div className="aspect-video bg-black/50 relative overflow-hidden">
                                    {project.images && project.images.length > 0 ? (
                                        <img
                                            src={project.images[0]}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                                            <ImageIcon size={32} opacity={0.5} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">{project.title}</h3>
                                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">{project.description}</p>

                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span>{project.images?.length || 0} images</span>
                                        <span>•</span>
                                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 rounded-3xl border border-dashed border-white/10 bg-white/5">
                        <div className="inline-flex p-4 rounded-full bg-white/5 mb-4 text-gray-500">
                            <Code size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No projects yet</h3>
                        <p className="text-gray-400 mb-6 max-w-md mx-auto">Showcase your work by adding your first project. It helps others understand your skills better.</p>
                        <button
                            onClick={() => setIsAddingProject(true)}
                            className="text-purple-400 hover:text-purple-300 font-bold hover:underline"
                        >
                            Create a Project
                        </button>
                    </div>
                )}
            </div>

            {/* Edit Profile Modal */}
            {isEditingProfile && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
                        <button
                            onClick={() => setIsEditingProfile(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                        <h3 className="text-2xl font-bold mb-6">Edit Profile</h3>
                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">Bio</label>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                                    rows={4}
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">Skills (comma separated)</label>
                                <input
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                                    value={profileData.skills}
                                    onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                                    placeholder="React, Design, Marketing..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditingProfile(false)}
                                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Project Modal */}
            {isAddingProject && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative my-auto">
                        <button
                            onClick={() => setIsAddingProject(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                        <h3 className="text-2xl font-bold mb-6">Add New Project</h3>
                        <form onSubmit={handleProjectSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">Project Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                                    value={projectData.title}
                                    onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                                    placeholder="My Awesome Project"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
                                <textarea
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                                    rows={5}
                                    value={projectData.description}
                                    onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                                    placeholder="Describe what you built, technologies used, etc."
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="block text-sm font-bold text-gray-300">Completion Date</label>
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex gap-2">
                                        <select
                                            className="bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 disabled:opacity-50 appearance-none cursor-pointer hover:bg-white/5 transition-colors"
                                            value={projectData.completionDate ? projectData.completionDate.split('-')[1] : ""}
                                            onChange={(e) => {
                                                const year = projectData.completionDate ? projectData.completionDate.split('-')[0] : new Date().getFullYear().toString();
                                                setProjectData({ ...projectData, completionDate: `${year}-${e.target.value}` });
                                            }}
                                            disabled={projectData.isOngoing}
                                            required={!projectData.isOngoing}
                                        >
                                            <option value="" disabled>Month</option>
                                            {Array.from({ length: 12 }, (_, i) => {
                                                const month = (i + 1).toString().padStart(2, '0');
                                                return <option key={month} value={month}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                                            })}
                                        </select>

                                        <select
                                            className="bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 disabled:opacity-50 appearance-none cursor-pointer hover:bg-white/5 transition-colors"
                                            value={projectData.completionDate ? projectData.completionDate.split('-')[0] : ""}
                                            onChange={(e) => {
                                                const month = projectData.completionDate ? projectData.completionDate.split('-')[1] : "01";
                                                setProjectData({ ...projectData, completionDate: `${e.target.value}-${month}` });
                                            }}
                                            disabled={projectData.isOngoing}
                                            required={!projectData.isOngoing}
                                        >
                                            <option value="" disabled>Year</option>
                                            {Array.from({ length: 30 }, (_, i) => {
                                                const year = new Date().getFullYear() - i;
                                                return <option key={year} value={year}>{year}</option>
                                            })}
                                        </select>
                                    </div>

                                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-300 hover:text-white select-none whitespace-nowrap">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${projectData.isOngoing ? 'bg-purple-600 border-purple-600' : 'border-white/20 bg-white/5'}`}>
                                            {projectData.isOngoing && <div className="w-2 h-2 bg-white rounded-sm" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={projectData.isOngoing}
                                            onChange={(e) => setProjectData({
                                                ...projectData,
                                                isOngoing: e.target.checked,
                                                // If turning ongoing ON, clear date? or keep? let's keep it but greyed out.
                                                // Actually if ongoing, we might want to ensure date is valid if they toggle back.
                                                completionDate: e.target.checked ? projectData.completionDate : (projectData.completionDate || `${new Date().getFullYear()}-01`)
                                            })}
                                        />
                                        Not Yet (Ongoing)
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">Project Images (Max 8)</label>
                                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 hover:bg-white/5 transition-colors text-center cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        disabled={projectData.images.length >= 8}
                                    />
                                    <ImageIcon className="mx-auto h-10 w-10 text-gray-500 mb-2" />
                                    <p className="text-sm text-gray-400">Drag & drop or click to upload</p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {projectData.images.length} / 8 selected
                                    </p>
                                </div>
                                {projectData.images.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {projectData.images.map((file, i) => (
                                            <div key={i} className="relative h-16 w-16 bg-white/10 rounded-lg overflow-hidden group">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt="preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setProjectData({
                                                        ...projectData,
                                                        images: projectData.images.filter((_, idx) => idx !== i)
                                                    })}
                                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddingProject(false)}
                                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Publish Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
