"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { UserPlus, Search, Hammer, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const steps = [
    {
        id: 1,
        title: "Sign up & join waitlist",
        description:
            "Create your student profile and secure your spot on our exclusive early access list.",
        icon: UserPlus,
        direction: "right",
    },
    {
        id: 2,
        title: "Find teammates",
        description:
            "Discover peers based on specific skills, projects, and shared interests.",
        icon: Search,
        direction: "left",
    },
    {
        id: 3,
        title: "Collaborate",
        description:
            "Work together on real projects, hackathons, or portfolios to build something amazing.",
        icon: Hammer,
        direction: "right",
    },
    {
        id: 4,
        title: "Share & Grow",
        description:
            "Showcase your finished work to the community and watch your skills and network grow.",
        icon: Share2,
        direction: "left",
    },
];

export default function HowItWorksPage() {
    return (
        <main className="flex min-h-screen flex-col bg-black text-white selection:bg-purple-500/30">
            <Navbar />

            <section className="flex flex-1 flex-col items-center px-4 pt-32 pb-20 overflow-hidden">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-20 text-center"
                >
                    <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
                        How Stusil <span className="text-purple-500">Works</span>
                    </h1>
                    <p className="text-lg text-gray-400">
                        From idea to execution in four simple steps.
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative w-full max-w-4xl">
                    {/* Vertical Line (Left on mobile, Center on desktop) */}
                    <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-purple-500/0 via-purple-500/50 to-purple-500/0 md:left-1/2 md:-translate-x-1/2" />

                    <div className="space-y-12 md:space-y-24">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`relative flex flex-col md:flex-row md:items-center ${step.direction === "left" && index % 2 !== 0 ? "md:flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Mobile: Icon is absolute left. Desktop: Icon is absolute center. 
                                    We need to push content to the right on mobile. */}

                                {/* Icon Bubble */}
                                <div className="absolute left-6 top-0 z-20 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-purple-500/50 bg-black shadow-[0_0_20px_rgba(168,85,247,0.4)] md:left-1/2 md:top-1/2 md:-translate-y-1/2">
                                    <step.icon className="h-5 w-5 text-purple-400" />
                                </div>

                                {/* Content Side */}
                                <div className={`w-full pl-16 md:w-1/2 md:px-12 md:pl-12 ${step.direction === "left" && index % 2 !== 0 ? "" : "md:text-right md:pr-12 md:pl-0"}`}>
                                    {/* 
                                        Logic for desktop alignment:
                                        If direction is right (index 0, 2): Content is on left side (w-1/2). Text should be right aligned? 
                                        Actually originals were: 
                                        Step 1 (Right): Content? The structure was `flex-row`.
                                        Original:
                                        Content Side (w-1/2) ... Empty Side (w-1/2)
                                        If 'left' (reverse): Empty ... Content.
                                        
                                        Let's stick to the simpler structure:
                                        On mobile: Content is shifted right (pl-16).
                                        On desktop: 
                                            - Even/Right: Content is on left side of screen (text-right usually looks good near center, or text-left).
                                            - Odd/Left: Content is on right side.
                                     */}

                                    {/* RESETTING internal structure for cleaner logic */}
                                    <div className={`relative z-10 hidden md:block ${index % 2 === 0 ? "mr-auto pr-12 text-right" : "ml-auto pl-12 text-left"}`}>
                                        {/* Desktop Content Block Placeholder - we will use the actual content block below but controlled by flex */}
                                    </div>

                                    {/* 
                                        ACTUAL implementation matching previous logic but fixed for mobile:
                                        Mobile: Flex-col. Line is at left-6. Content needs pl-16.
                                        Desktop: Flex-row. Line is center.
                                     */}
                                </div>

                                {/* Re-doing the layout properly to support the zig-zag without complex logic inside the div */}
                            </motion.div>
                        ))}

                        {/* RE-WRITING THE MAP COMPLETELY FOR CLARITY */}
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className={`relative flex flex-col md:items-center ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"}`}
                            >
                                {/* Icon - Shared Position Logic */}
                                <div className="absolute left-6 top-0 z-20 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-purple-500/50 bg-black shadow-[0_0_20px_rgba(168,85,247,0.4)] md:left-1/2 md:top-1/2 md:-translate-y-1/2">
                                    <step.icon className="h-5 w-5 text-purple-400" />
                                </div>

                                {/* Left Side (Content on Desktop if Even, Empty if Odd) */}
                                <div className={`w-full pl-20 md:w-1/2 md:pl-0 md:pr-16 ${index % 2 === 1 ? "md:hidden" : ""}`}>
                                    <div className="relative z-10 rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10 md:text-right">
                                        <h3 className="mb-2 text-xl font-bold text-white">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Side (Content on Desktop if Odd, Empty if Even) */}
                                <div className={`w-full pl-20 md:w-1/2 md:pl-16 ${index % 2 === 0 ? "hidden md:block" : ""}`}>
                                    {index % 2 === 1 && (
                                        <div className="relative z-10 rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10 text-left">
                                            <h3 className="mb-2 text-xl font-bold text-white">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                                                {step.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom Button */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-24"
                >
                    <Link href="/join">
                        <button className="rounded-full bg-white px-8 py-3.5 text-base font-bold text-black shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.4)]">
                            Join Waitlist
                        </button>
                    </Link>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
