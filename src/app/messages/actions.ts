'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function sendMessage(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const content = formData.get("content") as string;
    const receiverId = formData.get("receiverId") as string;
    const id = formData.get("id") as string;

    if (!content || !receiverId) {
        return { error: "Message content required" };
    }

    const { error } = await supabase.from('messages').insert({
        id: id || undefined,
        content,
        sender_id: user.id,
        receiver_id: receiverId,
        created_at: new Date().toISOString()
    });

    if (error) {
        console.error("Msg error:", error);
        return { error: error.message };
    }

    revalidatePath(`/messages/${receiverId}`);
    return { success: true };
}

export async function getConversations() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    try {
        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching messages:", error);
            return [];
        }

        if (!messages) return [];

        // Aggregate conversations
        const conversationMap = new Map();

        for (const msg of messages) {
            // Identify the "other" person
            const isSender = msg.sender_id === user.id;
            const otherId = isSender ? msg.receiver_id : msg.sender_id;

            if (!conversationMap.has(otherId)) {
                conversationMap.set(otherId, {
                    userId: otherId,
                    lastMessage: msg.content,
                    timestamp: msg.created_at,
                    id: msg.id // keep track of a message id for keys
                });
            }
        }

        return Array.from(conversationMap.values());
    } catch (e) {
        console.error("Unexpected error getting conversations:", e);
        return [];
    }
}

export async function markMessagesAsRead(senderId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('receiver_id', user.id)
        .eq('sender_id', senderId)
        .eq('is_read', false);
}
