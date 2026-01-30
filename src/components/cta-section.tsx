"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function CTASection() {
    return (
        <section className="relative w-full bg-black py-20">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-6 py-24 text-center md:px-12"
                >
                    {/* Background Glow Effect */}
                    <div className="absolute left-1/2 top-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/20 blur-[100px]" />

                    <h2 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
                        Ready to start building?
                    </h2>

                    <p className="mx-auto mb-10 max-w-lg text-lg text-gray-400">
                        Join hundreds of students turning their ideas into reality. The waitlist is growing fast.
                    </p>

                    <Link href="/join">
                        <button className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-purple-500/30 transition-all hover:scale-105 hover:shadow-purple-500/50">
                            Get Early Access
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
