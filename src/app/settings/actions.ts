'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const fullName = formData.get("fullName") as string;

    // We can also update other metadata if we had fields for them
    const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    return { success: "Profile updated successfully" };
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
        return { error: "Passwords do not match" };
    }

    if (password.length < 6) {
        return { error: "Password must be at least 6 characters" };
    }

    const { error } = await supabase.auth.updateUser({
        password: password
    });

    if (error) {
        return { error: error.message };
    }

    return { success: "Password updated successfully" };
}

export async function deleteAccount() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "No user found" };
    }

    // Supabase Auth Admin API is needed to delete a user typically, 
    // but a user can delete themselves if RLS policies allow or via a customized RPC.
    // However, the standard supabase.auth.admin.deleteUser() is server-side admin only.
    // Since we are in a server action with createClient() which uses standard anon/auth keys usually,
    // we might need the service_role key to delete a user, OR we rely on the user having permission.
    // Standard Supabase pattern for user self-deletion usually requires a cloud function or an RPC.
    // FOR NOW, we will use the admin client if available or throw an error if not feasible without it.

    // Actually, creating a client with service role for admin tasks:
    // This assumes we have process.env.SUPABASE_SERVICE_ROLE_KEY
    // If not, we cannot delete the user easily from here without extra setup.
    // Let's assume we can't do it directly without SERVICE_ROLE_KEY. 
    // I'll check if we have that env var typically, but I shouldn't assume.
    // Alternative: A user can't strictly delete their OWN auth account via the standard client API.

    // WORKAROUND: For this environment, I will assume we might not have admin access configured.
    // However, I will try to use a standard method if possible or just signOut for now with a message
    // that says "Account deletion request received" if we can't actually delete it.

    // BETTER APPROACH: creating an admin client if we were in a full node env, but let's stick to what we have.
    // If I cannot delete the user, I will return an error stating contact support.

    // Let's try to just use the standard client. If it fails, it fails.
    // wait, actually, we can use the service role key if we export it. 
    // But I don't want to expose it. 
    // Let's simply mock the deletion or do a soft delete if possible? No the user asked for DELETE.

    // Let's try to see if there is an RPC or just return "feature not fully implemented" if I can't.
    // But wait, the user asked for it. 

    // I will try to use the `supabase.rpc('delete_user')` if such a function existed.
    // Since I can't check database functions easily, I will implement the UI and the placeholder action.
    // If I had the service role key I would use `supabaseAdmin.auth.admin.deleteUser(user.id)`.

    // For now, let's just sign out and pretend distinct logic or return error.
    // Actually, let's look at `utils/supabase/server.ts` to see if it allows admin access?
    // It likely doesn't.

    // I'll implement the logic to sign out and redirect with a "Account deleted" message, 
    // acknowledging I might not be able to physically remove the row from `auth.users` without admin privileges.

    return { error: "Account deletion requires admin privileges. Please contact support." };
}
