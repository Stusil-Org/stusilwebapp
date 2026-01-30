"use client";

import { Users, Zap, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        title: "Find Your Tribe",
        description:
            "Connect with students who share your passion and complement your skillset perfectly.",
        icon: Users,
        iconColor: "text-purple-500",
    },
    {
        title: "Launch Faster",
        description:
            "Stop looking for tutorials and start building. With the right team, execution becomes easy.",
        icon: Zap,
        iconColor: "text-purple-400",
    },
    {
        title: "Build Portfolio",
        description:
            "Create tangible projects that showcase your abilities to future employers and investors.",
        icon: Briefcase,
        iconColor: "text-blue-500",
    },
];

export function Features() {
    return (
        <section className="relative z-10 w-full bg-black py-24">
            <div className="container mx-auto px-6">
                <div className="grid gap-8 md:grid-cols-3">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:border-purple-500/30 hover:bg-white/10"
                        >
                            <div className="mb-6 inline-flex rounded-xl bg-white/5 p-3 ring-1 ring-white/10 transition-colors group-hover:bg-purple-500/10 group-hover:ring-purple-500/30">
                                <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                            </div>

                            <h3 className="mb-3 text-xl font-bold text-white">
                                {feature.title}
                            </h3>

                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Subtle gradient glow effect on hover */}
                            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-purple-500/20 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
