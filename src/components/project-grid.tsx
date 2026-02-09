"use client";

import { useState } from "react";
import { X, Calendar, Image as ImageIcon, ChevronLeft, ChevronRight, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export interface Project {
    title: string;
    description: string;
    completionDate?: string;
    images?: string[];
    createdAt: string;
    author?: {
        name: string;
        avatar?: string;
        id: string;
        email?: string;
    };
}

interface ProjectGridProps {
    projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openProject = (project: Project) => {
        setSelectedProject(project);
        setCurrentImageIndex(0);
        document.body.style.overflow = "hidden";
    };

    const closeProject = () => {
        setSelectedProject(null);
        document.body.style.overflow = "unset";
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedProject?.images) {
            setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images!.length);
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedProject?.images) {
            setCurrentImageIndex((prev) => (prev - 1 + selectedProject.images!.length) % selectedProject.images!.length);
        }
    };

    if (!projects || projects.length === 0) {
        return (
            <div className="text-center py-20 rounded-3xl border border-dashed border-white/10 bg-white/5">
                <p className="text-gray-500 text-lg">No projects showcased yet.</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => openProject(project)}
                        className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-all hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col h-full cursor-pointer"
                    >
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
                                <p className="text-white font-medium text-sm flex items-center gap-2">
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
                                {project.author ? (
                                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                        <Link href={`/community/${project.author.id}`} className="flex items-center gap-2 hover:text-purple-400 transition-colors">
                                            <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-[10px] text-white">
                                                {project.author.avatar || project.author.name?.charAt(0) || "U"}
                                            </div>
                                            <span>{project.author.name}</span>
                                        </Link>
                                    </div>
                                ) : (
                                    project.images && project.images.length > 1 && (
                                        <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-gray-300">
                                            +{project.images.length - 1} more
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeProject}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-[#0A0A0A] border border-white/10 rounded-3xl w-full max-w-5xl max-h-[90vh] shadow-2xl relative overflow-hidden flex flex-col md:flex-row z-10"
                        >
                            {/* Close Button */}
                            <button
                                onClick={closeProject}
                                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors"
                            >
                                <X size={24} />
                            </button>

                            {/* Image Section */}
                            <div className="md:w-3/5 bg-black relative flex items-center justify-center bg-dots-pattern">
                                {selectedProject.images && selectedProject.images.length > 0 ? (
                                    <div className="relative w-full h-full min-h-[300px] md:min-h-full group">
                                        <img
                                            src={selectedProject.images[currentImageIndex]}
                                            alt={selectedProject.title}
                                            className="w-full h-full object-contain"
                                        />

                                        {selectedProject.images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <ChevronLeft size={24} />
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <ChevronRight size={24} />
                                                </button>

                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                                    {selectedProject.images.map((_, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/30'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-gray-500 h-64 md:h-full w-full">
                                        <ImageIcon size={64} opacity={0.2} />
                                        <p className="mt-4 text-sm">No images provided</p>
                                    </div>
                                )}
                            </div>

                            {/* Details Section */}
                            <div className="md:w-2/5 p-8 overflow-y-auto custom-scrollbar bg-[#0A0A0A]">
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between items-start gap-4 mb-2">
                                            <h2 className="text-3xl font-bold text-white leading-tight">
                                                {selectedProject.title}
                                            </h2>
                                        </div>
                                        <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                                            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                                <Calendar size={14} />
                                                {selectedProject.completionDate === 'Ongoing' ? 'In Progress' : (selectedProject.completionDate || 'No date')}
                                            </span>
                                            {selectedProject.author && (
                                                <Link href={`/community/${selectedProject.author.id}`} className="flex items-center gap-1.5 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/20 transition-colors">
                                                    <User size={14} />
                                                    {selectedProject.author.name}
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    <div className="h-px w-full bg-white/10" />

                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Description</h3>
                                        <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                            {selectedProject.description}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
