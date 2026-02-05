"use client";

import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../actions";
import { Send, User as UserIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function ChatClient({ initialMessages, currentUser, otherUser }: any) {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        // Scroll to bottom on load
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        // Real-time subscription
        const channel = supabase
            .channel('chat_room')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `receiver_id=eq.${currentUser.id}` // Only listen for messages TO me? 
                    // Actually we want messages in this conversation.
                    // Filter is limited. simpler to just listen to all and filter in callback?
                    // Or filter by conversation participants?
                    // Let's just listen to INSERT on table where sender is the other guy.
                },
                (payload) => {
                    const msg = payload.new;
                    if (msg.sender_id === otherUser.id || msg.receiver_id === otherUser.id) {
                        setMessages((prev: any) => [...prev, msg]);
                        if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, []);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        const tempMsg = {
            id: Date.now().toString(), // temp id
            content: newMessage,
            sender_id: currentUser.id,
            receiver_id: otherUser.id,
            created_at: new Date().toISOString(),
            is_pending: true
        };

        // Optimistic update
        setMessages((prev: any) => [...prev, tempMsg]);
        setNewMessage("");

        const formData = new FormData();
        formData.append("content", tempMsg.content);
        formData.append("receiverId", otherUser.id);

        const result = await sendMessage(formData);

        if (result.error) {
            // Revert or show error (simplified here)
            alert("Failed to send");
        } else {
            // In real production, we'd replace the tempMsg with real one or let real-time handle it
            // but fetch doesn't return the inserted row id easily in our action structure.
        }
        setSending(false);
        router.refresh();
    };

    const otherName = otherUser.user_metadata?.full_name || otherUser.email.split('@')[0];

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto w-full border-x border-white/10 bg-black">
            {/* Chat Header */}
            <div className="h-16 border-b border-white/10 flex items-center px-4 gap-4 bg-white/5 backdrop-blur-md sticky top-0 z-10">
                <Link href="/messages" className="md:hidden text-gray-400 hover:text-white">
                    <ArrowLeft size={24} />
                </Link>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {otherUser.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 className="font-bold text-white">{otherName}</h2>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Online
                    </p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">
                        <p>No messages yet. Say hi! 👋</p>
                    </div>
                )}

                {messages.map((msg: any) => {
                    const isMe = msg.sender_id === currentUser.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isMe ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none'}`}>
                                <p>{msg.content}</p>
                                <p className={`text-[10px] mt-1 ${isMe ? 'text-purple-200' : 'text-gray-500'}`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {msg.is_pending && ' • Sending...'}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-black">
                <div className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-white hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} className={sending ? 'opacity-50' : ''} />
                    </button>
                </div>
            </form>
        </div>
    );
}
