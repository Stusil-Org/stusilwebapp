import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function JoinPage() {
    return (
        <main className="flex min-h-screen flex-col bg-black text-white selection:bg-purple-500/30">
            <Navbar />

            <section className="flex flex-1 items-center justify-center px-4 py-32">
                <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm md:p-12">

                    {/* Header */}
                    <div className="mb-10 text-center">
                        <h1 className="mb-3 text-4xl font-bold tracking-tight text-white">
                            Join <span className="text-purple-500">Stusil</span>
                        </h1>
                        <p className="text-gray-400">
                            Be among the first to connect, collaborate, and create.
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-6">

                        {/* Full Name */}
                        <div className="space-y-2">
                            <label htmlFor="fullName" className="text-sm font-bold text-white">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                placeholder="John Doe"
                                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-bold text-white">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="john@university.edu"
                                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                        </div>

                        {/* Skills */}
                        <div className="space-y-2">
                            <label htmlFor="skills" className="text-sm font-bold text-white">
                                Skills
                            </label>
                            <input
                                type="text"
                                id="skills"
                                placeholder="UI/UX, React, Python, Marketing..."
                                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                        </div>

                        {/* Project Interests */}
                        <div className="space-y-2">
                            <label htmlFor="interests" className="text-sm font-bold text-white">
                                Project Interests
                            </label>
                            <textarea
                                id="interests"
                                rows={4}
                                placeholder="I'm interested in building AI startups, social apps..."
                                className="w-full resize-none rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="mt-4 w-full rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 py-3.5 text-base font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02] hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
                        >
                            Join Now
                        </button>
                    </form>
                </div>
            </section>

            <Footer />
        </main>
    );
}
