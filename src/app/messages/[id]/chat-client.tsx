"use client";

import { useState, useEffect, useRef } from "react";
import { sendMessage, markMessagesAsRead } from "../actions";
import { Send, ArrowLeft, Check, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export default function ChatClient({ initialMessages, currentUser, otherUser }: any) {
    const [messages, setMessages] = useState<any[]>(initialMessages);
    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();
    const router = useRouter();

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Mark as read when opening chat
    useEffect(() => {
        markMessagesAsRead(otherUser.id);
    }, [otherUser.id]);

    useEffect(() => {
        // Initial scroll
        scrollToBottom();
    }, []);

    // Scroll when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages.length]);

    useEffect(() => {
        // Real-time subscription to MESSAGE INSERTs and UPDATES
        const channel = supabase
            .channel(`chat:${currentUser.id}-${otherUser.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to INSERT and UPDATE
                    schema: 'public',
                    table: 'messages',
                },
                (payload: RealtimePostgresChangesPayload<{
                    [key: string]: any;
                }>) => {
                    const msg = payload.new as any;

                    // Check if relevant
                    const isRelevant =
                        (msg.sender_id === otherUser.id && msg.receiver_id === currentUser.id) ||
                        (msg.sender_id === currentUser.id && msg.receiver_id === otherUser.id);

                    if (!isRelevant) return;

                    if (payload.eventType === 'INSERT') {
                        // Check if we already have this message (optimistic update)
                        setMessages((prev) => {
                            const exists = prev.find(m => m.id === msg.id);
                            if (exists) {
                                // If it exists, update it with real data (removes is_pending)
                                return prev.map(m => m.id === msg.id ? { ...msg, is_pending: false } : m);
                            }
                            return [...prev, msg];
                        });

                        // If we received a message from OTHER user, mark it as read immediately if we are viewing
                        if (msg.sender_id === otherUser.id) {
                            markMessagesAsRead(otherUser.id);
                        }
                    } else if (payload.eventType === 'UPDATE') {
                        // Update existing message (e.g. is_read status)
                        setMessages((prev) => prev.map(m => m.id === msg.id ? msg : m));
                    }
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    setIsOnline(true);
                }
            });

        return () => {
            supabase.removeChannel(channel);
        }
    }, [currentUser.id, otherUser.id]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        const tempId = crypto.randomUUID();
        const content = newMessage;

        const tempMsg = {
            id: tempId,
            content: content,
            sender_id: currentUser.id,
            receiver_id: otherUser.id,
            created_at: new Date().toISOString(),
            is_pending: true,
            is_read: false
        };

        // Optimistic update
        setMessages((prev) => [...prev, tempMsg]);
        setNewMessage("");

        const formData = new FormData();
        formData.append("id", tempId);
        formData.append("content", content);
        formData.append("receiverId", otherUser.id);

        const result = await sendMessage(formData);

        if (result.error) {
            alert("Failed to send message");
            setMessages(prev => prev.filter(m => m.id !== tempId));
        }

        setSending(false);
    };

    const otherName = otherUser.user_metadata?.full_name || otherUser.email.split('@')[0];

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto w-full border-x border-white/10 bg-black">
            {/* Chat Header */}
            <div className="h-16 border-b border-white/10 flex items-center px-4 gap-4 bg-white/5 backdrop-blur-md sticky top-0 z-10">
                <Link href="/messages" className="text-gray-400 hover:text-white flex items-center gap-1">
                    <ArrowLeft size={24} />
                    <span className="hidden md:inline font-medium">Back</span>
                </Link>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {otherUser.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 className="font-bold text-white">{otherName}</h2>
                    <p className={`text-xs flex items-center gap-1 ${isOnline ? 'text-green-400' : 'text-gray-500'}`}>
                        <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                        {isOnline ? 'Connected' : 'Connecting...'}
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
                                <div className={`flex items-center justify-end gap-1 mt-1`}>
                                    <p className={`text-[10px] ${isMe ? 'text-purple-200' : 'text-gray-500'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {msg.is_pending && ' • Sending...'}
                                    </p>

                                    {isMe && !msg.is_pending && (
                                        <div className="flex items-center gap-1 ml-1" title={msg.is_read ? "Seen" : "Sent"}>
                                            <span className="text-[10px] opacity-80 font-medium">
                                                {msg.is_read ? 'Seen' : 'Sent'}
                                            </span>
                                            {msg.is_read ? (
                                                <CheckCheck size={14} className="text-blue-300" />
                                            ) : (
                                                <Check size={14} className="text-purple-300" />
                                            )}
                                        </div>
                                    )}
                                </div>
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
