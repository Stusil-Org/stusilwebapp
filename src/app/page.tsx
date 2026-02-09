import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { createClient } from "@/utils/supabase/server";

import { GridScan } from "@/components/GridScan";
import { Features } from "@/components/features";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { HeroButtons } from "@/components/hero-buttons";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="bg-black text-white selection:bg-purple-500/30">
      <Navbar user={user} />

      {/* Hero Section */}
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden">
        {/* Background with GridScan */}

        <div className="absolute inset-0 z-0 opacity-80 mix-blend-screen">
          <GridScan
            sensitivity={0.55}
            lineThickness={1}
            linesColor="#392e4e"
            gridScale={0.1}
            scanColor="#FF9FFC"
            scanOpacity={0.4}
            enablePost
            bloomIntensity={0.6}
            chromaticAberration={0.002}
            noiseIntensity={0.01}
          />
        </div>

        {/* Gradient Glow behind text */}
        <div className="absolute top-1/2 left-1/2 z-0 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/60 blur-[120px] md:h-[800px] md:w-[800px]" />

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
          <HeroButtons user={user} />
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
