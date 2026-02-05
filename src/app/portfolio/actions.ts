'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();

    const bio = formData.get("bio") as string;
    const skills = formData.get("skills") as string;
    // We keep skills as a string "Skill1, Skill2" or split it?
    // The previous implementation used it as a string in metadata. let's keep it consistent or clean it up.

    const { error } = await supabase.auth.updateUser({
        data: {
            bio: bio,
            skills: skills
        }
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/portfolio");
    return { success: "Profile updated successfully" };
}

export async function addProject(formData: FormData) {
    const supabase = await createClient();

    // 1. Get current user and metadata
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const currentProjects = user.user_metadata?.projects || [];

    // 2. Extract Data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const completionDate = formData.get("completionDate") as string;
    const files = formData.getAll("images") as File[];

    if (!title || !description) {
        return { error: "Title and description are required" };
    }

    // 3. Upload Images
    // Note: This requires a Supabase Storage bucket named 'portfolio'
    const imageUrls: string[] = [];

    for (const file of files) {
        if (file.size === 0) continue; // Skip empty

        // Simple distinct filename
        const filename = `${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;

        const { data, error } = await supabase
            .storage
            .from('portofolio')
            .upload(filename, file);

        if (error) {
            console.error("Upload error:", error);
            // Continue or fail? Let's continue but log it.
            // If the bucket doesn't exist, this will fail.
            // We'll return a specific error if the FIRST one fails.
            if (imageUrls.length === 0 && files.length > 0) {
                return { error: "Failed to upload image. Ensure 'portofolio' bucket exists." };
            }
        } else {
            // Get Public URL
            const { data: { publicUrl } } = supabase
                .storage
                .from('portofolio')
                .getPublicUrl(filename);

            imageUrls.push(publicUrl);
        }

        if (imageUrls.length >= 8) break; // Max 8
    }

    // 4. Update User Metadata
    const newProject = {
        id: Date.now().toString(),
        title,
        description,
        completionDate,
        images: imageUrls,
        createdAt: new Date().toISOString()
    };

    const updatedProjects = [newProject, ...currentProjects];

    const { error: updateError } = await supabase.auth.updateUser({
        data: { projects: updatedProjects }
    });

    if (updateError) {
        return { error: updateError.message };
    }

    revalidatePath("/portfolio");
    return { success: "Project added successfully" };
}
