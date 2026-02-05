"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, User as UserIcon, LogOut, Settings, Trash, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Community", href: "/community" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Messages", href: "/messages" },
];

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        setIsUserMenuOpen(false); // Close menu
        setIsMobileMenuOpen(false); // Close mobile menu if open
        await supabase.auth.signOut();
        setUser(null);
        router.push("/login"); // Redirect to login after sign out
        router.refresh();
    };


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

                {/* Join Now Button OR User Menu */}
                {user ? (
                    <div className="relative">
                        <button
                            onClick={() => {
                                setIsUserMenuOpen(!isUserMenuOpen);
                                setShowSignOutConfirm(false);
                            }}
                            className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/20"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white">
                                {user.email?.charAt(0).toUpperCase() || <UserIcon size={16} />}
                            </div>
                            <span className="max-w-[100px] truncate">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                        </button>

                        <AnimatePresence>
                            {isUserMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-black/90 text-sm shadow-xl backdrop-blur-xl"
                                >
                                    <div className="p-2">
                                        <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-widest font-bold">
                                            Account
                                        </div>
                                        <div className="px-3 py-2 text-gray-300 truncate border-b border-white/5 mb-2">
                                            {user.email}
                                        </div>
                                        <Link
                                            href="/settings"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                                        >
                                            <Settings size={16} />
                                            Settings
                                        </Link>
                                        {!showSignOutConfirm ? (
                                            <button
                                                onClick={() => setShowSignOutConfirm(true)}
                                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                                            >
                                                <LogOut size={16} />
                                                Sign Out
                                            </button>
                                        ) : (
                                            <div className="px-1 py-1 space-y-2">
                                                <p className="text-xs text-center text-gray-400">Are you sure?</p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setShowSignOutConfirm(false)}
                                                        className="flex-1 rounded-md bg-gray-700 py-1 text-xs font-medium text-white hover:bg-gray-600"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleSignOut}
                                                        className="flex-1 rounded-md bg-red-600 py-1 text-xs font-medium text-white hover:bg-red-700"
                                                    >
                                                        Yes
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <Link href="/join">
                        <button className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black transition-all hover:scale-105 hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] uppercase tracking-wide">
                            Join Now
                        </button>
                    </Link>
                )}
            </div>

            {/* 3. Mobile Menu Toggle */}
            <button
                className="md:hidden text-white z-[60] relative p-2 focus:outline-none"
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
                        className="fixed inset-0 z-[55] flex flex-col items-center justify-center h-[100dvh] bg-black md:hidden overflow-y-auto"
                    >
                        {/* Background subtle gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black pointer-events-none" />

                        <motion.div
                            className="relative z-10 flex flex-col items-center space-y-8 w-full max-w-sm px-6 py-12"
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
                                        className="block w-full text-center text-3xl font-bold text-gray-300 hover:text-white transition-colors py-3 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10"
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
                                {user ? (
                                    <div className="w-full space-y-4">
                                        <div className="flex items-center justify-center gap-3 text-xl font-bold text-white">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600">
                                                {user.email?.charAt(0).toUpperCase() || <UserIcon size={20} />}
                                            </div>
                                            {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                        </div>
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full rounded-full bg-red-500/10 border border-red-500/20 py-4 text-lg font-bold text-red-400 transition-all active:scale-95"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <Link href="/join" onClick={() => setIsMobileMenuOpen(false)} className="block w-full">
                                        <button className="w-full rounded-full bg-white py-4 text-lg font-bold text-black transition-all active:scale-95 shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.5)]">
                                            Join Now
                                        </button>
                                    </Link>
                                )}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
