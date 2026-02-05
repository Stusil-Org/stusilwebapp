"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export function HeroButtons() {
    const [user, setUser] = useState<User | null>(null);
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

    return (
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
            {user ? (
                <Link href="/portfolio">
                    <button className="group relative rounded-full bg-white px-8 py-3.5 text-base font-bold text-black shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.4)]">
                        Portfolio
                    </button>
                </Link>
            ) : (
                <Link href="/join">
                    <button className="group relative rounded-full bg-white px-8 py-3.5 text-base font-bold text-black shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.4)]">
                        Join Now
                    </button>
                </Link>
            )}

            <Link href="/about">
                <button className="rounded-full border border-gray-700 bg-white/5 px-8 py-3.5 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-gray-500">
                    Learn More
                </button>
            </Link>
        </div>
    );
}
