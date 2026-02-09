'use server'

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getConversationWithUser(otherUserId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { messages: [], currentUser: null, otherUser: null };

    // Get Messages
    const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

    // Get Other User Details (using Admin because auth.users is protected)
    const admin = createAdminClient();
    const { data: { user: otherUser } } = await admin.auth.admin.getUserById(otherUserId);

    return {
        messages: messages || [],
        currentUser: user,
        otherUser: otherUser
    };
}


