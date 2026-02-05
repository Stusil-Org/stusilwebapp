import { Navbar } from "@/components/navbar";
import { getConversationWithUser } from "./actions";
import ChatClient from "./chat-client";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { messages, currentUser, otherUser } = await getConversationWithUser(id);

    if (!currentUser) redirect("/login");
    if (!otherUser) return <div>User not found</div>;

    return (
        <main className="flex min-h-screen flex-col bg-black text-white selection:bg-purple-500/30">
            <Navbar />
            <div className="flex-1 pt-16">
                <ChatClient
                    initialMessages={messages}
                    currentUser={currentUser}
                    otherUser={otherUser}
                />
            </div>
        </main>
    );
}
