"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { signup } from "./actions";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function JoinPage() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        skills: [] as string[],
        otherSkill: "",
        interests: ""
    });

    // Step 1: Predefined Skills List
    const PREDEFINED_SKILLS = [
        "Development", "Marketing", "Design", "Business",
        "Data Science", "AI/ML", "Video Editing", "Writing",
        "Photography", "Sales", "Finance", "Legal"
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleSkill = (skill: string) => {
        if (formData.skills.includes(skill)) {
            setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
        } else {
            setFormData({ ...formData, skills: [...formData.skills, skill] });
        }
    };

    const handleNextStep = () => {
        setError(null);
        if (step === 1) {
            if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
                setError("Please fill in all fields.");
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
            if (formData.password.length < 6) {
                setError("Password must be at least 6 characters.");
                return;
            }
        }
        setStep(step + 1);
    };

    const handlePrevStep = () => {
        setError(null);
        setStep(step - 1);
    };

    async function handleSubmit() {
        setIsLoading(true);
        setError(null);

        // Prepare data for server action
        const finalSkills = [...formData.skills];
        if (formData.otherSkill.trim()) {
            finalSkills.push(formData.otherSkill.trim());
        }

        const data = new FormData();
        data.append("fullName", formData.fullName);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("skills", finalSkills.join(", "));
        data.append("interests", formData.interests);

        try {
            const result = await signup(data);
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

                <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm md:p-12 z-10 transition-all duration-300">

                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="mb-3 text-4xl font-bold tracking-tight text-white">
                            Join <span className="text-purple-500">Stusil</span>
                        </h1>
                        <p className="text-gray-400">
                            {step === 1 && "Start your journey. Create an account."}
                            {step === 2 && "What are you good at?"}
                            {step === 3 && "What do you want to build?"}
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex gap-2 mb-8">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-purple-500' : 'bg-white/10'}`}
                            />
                        ))}
                    </div>

                    <div className="space-y-5">
                        {error && (
                            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}

                        {/* STEP 1: Account Details */}
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-white">Full Name</label>
                                    <input
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-white">Email Address</label>
                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        type="email"
                                        placeholder="john@university.edu"
                                        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-white">Password</label>
                                    <div className="relative">
                                        <input
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            type={showPassword ? "text" : "password"}
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
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-white">Confirm Password</label>
                                    <input
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Skills */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex flex-wrap gap-2">
                                    {PREDEFINED_SKILLS.map((skill) => (
                                        <button
                                            key={skill}
                                            type="button"
                                            onClick={() => toggleSkill(skill)}
                                            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${formData.skills.includes(skill)
                                                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25 ring-2 ring-purple-400"
                                                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                                                }`}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-2 pt-2 border-t border-white/10">
                                    <label className="text-sm font-bold text-white">Other (Optional)</label>
                                    <input
                                        name="otherSkill"
                                        value={formData.otherSkill}
                                        onChange={handleInputChange}
                                        type="text"
                                        placeholder="Add custom skill..."
                                        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Interests */}
                        {step === 3 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <p className="text-sm text-gray-400">
                                    Tell us what excites you. What kind of projects are you looking to build or join?
                                </p>
                                <textarea
                                    name="interests"
                                    value={formData.interests}
                                    onChange={handleInputChange}
                                    rows={5}
                                    placeholder="I'm interested in building AI startups, sustainability tech, and social apps..."
                                    className="w-full resize-none rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                                />
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="pt-4 flex flex-col gap-3">
                            {step < 3 ? (
                                <button
                                    onClick={handleNextStep}
                                    type="button"
                                    className="w-full rounded-xl bg-white/10 border border-white/10 py-3.5 text-base font-bold text-white hover:bg-white/20 transition-all"
                                >
                                    Next Step
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 py-3.5 text-base font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02] hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Creating Profile...
                                        </>
                                    ) : (
                                        "Complete Registration"
                                    )}
                                </button>
                            )}

                            {step > 1 && (
                                <button
                                    onClick={handlePrevStep}
                                    disabled={isLoading}
                                    className="w-full py-2 text-sm text-gray-500 hover:text-white transition-colors"
                                >
                                    Back
                                </button>
                            )}
                        </div>

                        {/* Already joined? text button only on step 1 */}
                        {step === 1 && (
                            <div className="text-center md:text-sm mt-2">
                                <span className="text-gray-400">Already joined? </span>
                                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors hover:underline">
                                    Log in
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
