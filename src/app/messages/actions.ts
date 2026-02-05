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

    if (!content || !receiverId) {
        return { error: "Message content required" };
    }

    const { error } = await supabase.from('messages').insert({
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
    // This is complex in standard SQL without custom views, 
    // we need to get distinct users you have chatted with.
    // For simplicity/performance in this MVP, we might fetch all messages 
    // and aggregate in JS or use a specific distinct query if RLS allows.

    // Better approach: Get all messages involving current user, order by date.
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: messages, error } = await supabase
        .from('messages')
        .select(`
            *,
            sender:sender_id(email, raw_user_meta_data),
            receiver:receiver_id(email, raw_user_meta_data)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

    if (error || !messages) return [];

    // Aggregate into "conversations" map
    const conversationMap = new Map();

    messages.forEach(msg => {
        // Identify the "other" person
        const isSender = msg.sender_id === user.id;
        const otherId = isSender ? msg.receiver_id : msg.sender_id;
        // The user data might come from the join if Supabase allows auth table join (often it doesn't by default!).
        // IMPORTANT: Supabase standard client often CANNOT join on `auth.users` directly for security unless configured.
        // We might fail to get 'sender'/'receiver' expanded data if foreign keys aren't viewable.

        // Setup: We assume we might NOT get the joined data easily. 
        // We will return raw IDs and fetch profiles if needed, 
        // OR assuming we used the admin client to publicize distinct user info, 
        // but let's stick to the safe bet: raw messages roughly aggregated.

        if (!conversationMap.has(otherId)) {
            conversationMap.set(otherId, {
                userId: otherId,
                lastMessage: msg.content,
                timestamp: msg.created_at,
                // We will fetch user details client side or in a second pass if needed
                // actually we can use the admin client from here to fetch distinct user infos? No, keep it simple.
            });
        }
    });

    return Array.from(conversationMap.values());
}
