import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { getConversations } from "./actions";
import { MessageSquare, ArrowRight } from "lucide-react";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const rawConversations = await getConversations();

    // Fetch details for these users using admin client
    // Since aggregation was rough, we just have IDs.
    const admin = createAdminClient();

    const conversations = await Promise.all(
        rawConversations.map(async (c: any) => {
            const { data: { user } } = await admin.auth.admin.getUserById(c.userId);
            return {
                ...c,
                user
            };
        })
    );

    return (
        <main className="flex min-h-screen flex-col bg-black text-white selection:bg-purple-500/30">
            <Navbar user={user} />

            <section className="flex-1 max-w-4xl mx-auto w-full px-4 pt-32 pb-20">
                <div className="mb-8 flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-purple-600/20 text-purple-400">
                        <MessageSquare size={32} />
                    </div>
                    <h1 className="text-4xl font-bold">Messages</h1>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm min-h-[400px]">
                    {conversations.length > 0 ? (
                        <div className="divide-y divide-white/5">
                            {conversations.map((conv, i) => {
                                const name = conv.user?.user_metadata?.full_name || conv.user?.email;
                                if (!conv.user) return null; // Skip if user deleted

                                return (
                                    <Link
                                        key={i}
                                        href={`/messages/${conv.userId}`}
                                        className="flex items-center gap-4 p-6 hover:bg-white/5 transition-colors group"
                                    >
                                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xl font-bold text-white border border-white/10 group-hover:border-purple-500/50 transition-colors">
                                            {conv.user.email?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-lg text-white truncate group-hover:text-purple-400 transition-colors">
                                                    {name}
                                                </h3>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(conv.timestamp).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 truncate text-sm">
                                                {conv.lastMessage}
                                            </p>
                                        </div>
                                        <ArrowRight className="text-gray-600 group-hover:text-purple-400 transition-colors opacity-0 group-hover:opacity-100" />
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-20 text-gray-500">
                            <MessageSquare size={48} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium">No messages yet</p>
                            <p className="text-sm mb-6">Start collaborating with others in the community!</p>
                            <Link href="/community">
                                <button className="px-6 py-2 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-500 transition-colors">
                                    Browse Community
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
