import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function AboutPage() {
    return (
        <main className="flex min-h-screen flex-col bg-black text-white selection:bg-purple-500/30">
            <Navbar />

            <section className="flex flex-1 flex-col items-center px-6 pt-32 pb-20">
                <div className="w-full max-w-4xl">
                    {/* Header */}
                    <h1 className="mb-8 text-5xl font-bold tracking-tight md:text-6xl">
                        About <span className="text-purple-500">Stusil</span>
                    </h1>

                    {/* Intro Text */}
                    {/* Founder Card */}
                    <div className="mb-16 w-full rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
                        <h3 className="text-2xl font-bold text-white">Tanisha Singh</h3>
                        <p className="mb-6 text-base font-medium text-purple-500">Founder</p>
                        <p className="text-lg leading-relaxed text-gray-400">
                            "Hi, I'm Tanisha Singh, founder of Stusil. I created this platform to
                            help students find teammates, exchange skills, and build real
                            projects before college."
                        </p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Mission Card */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/10">
                            <h2 className="mb-4 text-2xl font-bold text-purple-500">
                                Our Mission
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                Empower students to collaborate, exchange skills, and build real
                                projects.
                            </p>
                        </div>

                        {/* Vision Card */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/10">
                            <h2 className="mb-4 text-2xl font-bold text-purple-500">
                                Our Vision
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                A world where students create, collaborate, and grow together.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
