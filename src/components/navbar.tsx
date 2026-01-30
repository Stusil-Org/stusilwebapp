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

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-black/50 border-b border-white/5">
            {/* 1. Logo on the Left */}
            <div className="flex items-center z-50 relative">
                <Link
                    href="/"
                    className="text-2xl font-bold tracking-tight text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    STUSIL
                </Link>
            </div>

            {/* 2. Container for Links + Button on the Right (Desktop) */}
            <div className="hidden md:flex items-center gap-8">
                {/* Navigation Links */}
                <div className="flex items-center space-x-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Join Now Button */}
                <Link href="/join">
                    <button className="rounded-full bg-white px-6 py-2 text-sm font-bold text-black transition-transform hover:scale-105 hover:bg-gray-100 uppercase tracking-wide">
                        Join Now
                    </button>
                </Link>
            </div>

            {/* 3. Mobile Menu Toggle */}
            <button
                className="md:hidden text-white z-50 relative p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* 4. Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl md:hidden"
                    >
                        <div className="flex flex-col items-center space-y-8 p-4 text-center">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-2xl font-bold text-gray-300 hover:text-white transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4">
                                <Link href="/join" onClick={() => setIsMobileMenuOpen(false)}>
                                    <button className="rounded-full bg-white px-8 py-3 text-lg font-bold text-black transition-transform hover:scale-105">
                                        Join Now
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
