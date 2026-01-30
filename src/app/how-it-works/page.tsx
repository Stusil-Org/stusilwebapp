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
                    {/* Central Line */}
                    <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-purple-500/0 via-purple-500/50 to-purple-500/0 md:block hidden" />

                    <div className="space-y-12 md:space-y-24">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className={`relative flex flex-col items-center md:flex-row ${step.direction === "left" ? "md:flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Content Side */}
                                <div className="mb-8 w-full md:mb-0 md:w-1/2 md:px-12">
                                    <div className="relative z-10 rounded-2xl border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/10">
                                        <h3 className="mb-3 text-xl font-bold text-white">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-400 leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Center Icon */}
                                <div className="absolute left-1/2 top-0 z-20 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-purple-500/50 bg-black shadow-[0_0_20px_rgba(168,85,247,0.4)] md:top-1/2 md:-translate-y-1/2">
                                    <step.icon className="h-5 w-5 text-purple-400" />
                                </div>

                                {/* Empty Side for Layout Balance */}
                                <div className="hidden w-1/2 md:block" />
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
