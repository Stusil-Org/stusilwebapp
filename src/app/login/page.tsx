"use client";

import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { login } from "./actions";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Footer } from "@/components/footer";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        try {
            const result = await login(formData);
            if (result?.error) {
                setError(result.error);
                setIsLoading(false);
            }
        } catch (e) {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen flex-col bg-black text-white selection:bg-purple-500/30">
            <Navbar />

            <section className="flex flex-1 items-center justify-center px-4 py-32 relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-[60%] -translate-y-[40%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-[40%] -translate-y-[60%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

                <div className="w-full max-w-sm mx-auto rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm md:p-12 z-10">
                    <div className="mb-8 text-center">
                        <h1 className="mb-3 text-3xl font-bold tracking-tight text-white">
                            Welcome Back
                        </h1>
                        <p className="text-gray-400">
                            Sign in to continue to Stusil
                        </p>
                    </div>

                    <form action={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-bold text-white">
                                Email Address
                            </label>
                            <input
                                required
                                name="email"
                                type="email"
                                id="email"
                                placeholder="john@university.edu"
                                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-bold text-white">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    required
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 pr-10 text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={isLoading}
                            type="submit"
                            className="mt-4 w-full rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 py-3.5 text-base font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02] hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>

                        <div className="text-center md:text-sm mt-4">
                            <span className="text-gray-400">Don't have an account? </span>
                            <Link href="/join" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors hover:underline">
                                Join Now
                            </Link>
                        </div>
                    </form>
                </div>
            </section>

            <Footer />
        </main>
    );
}
