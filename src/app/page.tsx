import Link from "next/link";
import { Navbar } from "@/components/navbar";
import FloatingLines from "@/components/FloatingLines";
import { Features } from "@/components/features";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="bg-black text-white selection:bg-purple-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden">
        {/* Background with 3D Floating Lines */}
        <div className="absolute inset-0 z-0">
          <FloatingLines
            linesGradient={["#581c87", "#86198f", "#4c1d95"]}
            enabledWaves={["top", "middle", "bottom"]}
            lineCount={6}
            lineDistance={4}
            bendRadius={5}
            bendStrength={-0.3}
            interactive={true}
            parallax={true}
            parallaxStrength={0.1}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center px-4 text-center md:px-0">
          {/* 'NOW IN BETA' Badge */}
          <div className="mb-8 inline-flex items-center rounded-full border border-purple-500/30 bg-purple-900/20 px-4 py-1.5 backdrop-blur-md">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Now in Beta
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="mb-6 max-w-5xl text-4xl sm:text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
            <span className="text-white">Stusil — Where student</span> <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              ideas meet skills
            </span>
          </h1>

          {/* Substatus/Description */}
          <p className="mb-10 max-w-2xl text-lg text-gray-400 md:text-xl">
            Join hundreds of students turning ideas into reality. Find
            teammates, exchange skills, and build projects beyond grades.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
            <Link href="/join">
              <button className="group relative rounded-full bg-white px-8 py-3.5 text-base font-bold text-black shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.4)]">
                Join Waitlist
              </button>
            </Link>

            <button className="rounded-full border border-gray-700 bg-white/5 px-8 py-3.5 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-gray-500">
              Learn More
            </button>
          </div>
        </div>

        {/* Decorative Gradient Overlay for Bottom fade out */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </section>

      <Features />
      <CTASection />
      <Footer />
    </main>
  );
}
