"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Community", href: "/community" },
    { name: "Portfolio", href: "/portfolio" },
];

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Prevent body scroll when menu is open
    if (typeof window !== "undefined") {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-black/60 border-b border-white/5 transition-all duration-300">
            {/* 1. Logo on the Left */}
            <div className="flex items-center z-50 relative">
                <Link
                    href="/"
                    className="text-2xl font-bold tracking-tight text-white hover:text-purple-400 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    STUSIL
                </Link>
            </div>

            {/* 2. Container for Links + Button on the Right (Desktop) */}
            <div className="hidden md:flex items-center gap-8">
                {/* Navigation Links */}
                <div className="flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="relative text-sm font-medium text-gray-400 transition-colors hover:text-white group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span>
                        </Link>
                    ))}
                </div>

                {/* Join Now Button */}
                <Link href="/join">
                    <button className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black transition-all hover:scale-105 hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] uppercase tracking-wide">
                        Join Now
                    </button>
                </Link>
            </div>

            {/* 3. Mobile Menu Toggle */}
            <button
                className="md:hidden text-white z-50 relative p-2 focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
            >
                <div className="relative w-6 h-6 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {isMobileMenuOpen ? (
                            <motion.div
                                key="close"
                                initial={{ opacity: 0, rotate: -90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: 90 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X size={28} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="open"
                                initial={{ opacity: 0, rotate: 90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: -90 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Menu size={28} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </button>

            {/* 4. Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl md:hidden"
                    >
                        {/* Background subtle gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black pointer-events-none" />

                        <motion.div
                            className="relative z-10 flex flex-col items-center space-y-8 w-full max-w-sm px-6"
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={{
                                open: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
                                closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
                            }}
                        >
                            {navLinks.map((link) => (
                                <motion.div
                                    key={link.name}
                                    variants={{
                                        open: { y: 0, opacity: 1 },
                                        closed: { y: 20, opacity: 0 }
                                    }}
                                    className="w-full"
                                >
                                    <Link
                                        href={link.href}
                                        className="block w-full text-center text-3xl font-bold text-gray-400 hover:text-white transition-colors py-2 border-b border-white/5 hover:border-purple-500/50"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.div
                                variants={{
                                    open: { y: 0, opacity: 1 },
                                    closed: { y: 20, opacity: 0 }
                                }}
                                className="pt-8 w-full"
                            >
                                <Link href="/join" onClick={() => setIsMobileMenuOpen(false)} className="block w-full">
                                    <button className="w-full rounded-full bg-white py-4 text-lg font-bold text-black transition-all active:scale-95 shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]">
                                        Join Now
                                    </button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
