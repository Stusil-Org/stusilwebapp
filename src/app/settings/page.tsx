"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useState } from "react";
import { updateProfile, updatePassword, deleteAccount } from "./actions";
import { Loader2, Save, Trash2, Shield, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function SettingsPage() {
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [deleteMessage, setDeleteMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    async function handleProfileUpdate(formData: FormData) {
        setIsLoadingProfile(true);
        setProfileMessage(null);

        try {
            const result = await updateProfile(formData);
            if (result.error) {
                setProfileMessage({ type: 'error', text: result.error });
            } else if (result.success) {
                setProfileMessage({ type: 'success', text: result.success });
                router.refresh();
            }
        } catch (e) {
            setProfileMessage({ type: 'error', text: "An error occurred." });
        } finally {
            setIsLoadingProfile(false);
        }
    }

    async function handlePasswordUpdate(formData: FormData) {
        setIsLoadingPassword(true);
        setPasswordMessage(null);

        try {
            const result = await updatePassword(formData);
            if (result.error) {
                setPasswordMessage({ type: 'error', text: result.error });
            } else if (result.success) {
                setPasswordMessage({ type: 'success', text: result.success });
                // Reset form fields
                (document.getElementById('password-form') as HTMLFormElement).reset();
            }
        } catch (e) {
            setPasswordMessage({ type: 'error', text: "An error occurred." });
        } finally {
            setIsLoadingPassword(false);
        }
    }

    async function handleDeleteAccount() {
        setIsLoadingDelete(true);
        setDeleteMessage(null);

        try {
            const result = await deleteAccount();
            if (result.error) {
                setDeleteMessage({ type: 'error', text: result.error });
            } else {
                // Determine success logic? 
                // Since our action returns error for now (no admin key), this likely won't hit success in currently implemented action 
                // but if we updated the action:
                await supabase.auth.signOut();
                router.push("/");
                router.refresh();
            }
        } catch (e) {
            setDeleteMessage({ type: 'error', text: "An error occurred." });
        } finally {
            setIsLoadingDelete(false);
        }
    }

    return (
        <main className="flex min-h-screen flex-col bg-black text-white selection:bg-purple-500/30">
            <Navbar />

            <section className="flex flex-1 items-center justify-center px-4 py-32 relative overflow-hidden">
                {/* Background effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="w-full max-w-4xl space-y-8 z-10">

                    <div className="mb-8">
                        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Account Settings</h1>
                        <p className="text-gray-400">Manage your profile, security, and account preferences.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Profile Section */}
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                                    <User size={24} />
                                </div>
                                <h2 className="text-xl font-bold">Profile Details</h2>
                            </div>

                            <form action={handleProfileUpdate} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="fullName" className="text-sm font-medium text-gray-300">Display Name</label>
                                    <input
                                        name="fullName"
                                        type="text"
                                        placeholder="Your Name"
                                        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                                    />
                                    <p className="text-xs text-gray-500">This is how you will appear to other users.</p>
                                </div>

                                {profileMessage && (
                                    <div className={`text-sm p-3 rounded-lg ${profileMessage.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {profileMessage.text}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoadingProfile}
                                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-white/10 border border-white/10 py-3 text-sm font-bold text-white hover:bg-white/20 transition-all disabled:opacity-50"
                                >
                                    {isLoadingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
                                    Save Profile
                                </button>
                            </form>
                        </div>

                        {/* Security Section */}
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300">
                                    <Shield size={24} />
                                </div>
                                <h2 className="text-xl font-bold">Security</h2>
                            </div>

                            <form id="password-form" action={handlePasswordUpdate} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">New Password</label>
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                                    />
                                </div>

                                {passwordMessage && (
                                    <div className={`text-sm p-3 rounded-lg ${passwordMessage.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {passwordMessage.text}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoadingPassword}
                                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-white/10 border border-white/10 py-3 text-sm font-bold text-white hover:bg-white/20 transition-all disabled:opacity-50"
                                >
                                    {isLoadingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
                                    Update Password
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h3 className="text-lg font-bold text-red-400 mb-1">Delete Account</h3>
                                <p className="text-sm text-gray-400">Permanently remove your account and all of your content.</p>
                            </div>

                            {!showDeleteConfirm ? (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="flex items-center justify-center gap-2 whitespace-nowrap px-6 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors font-medium text-sm"
                                >
                                    <Trash2 size={16} />
                                    Delete Account
                                </button>
                            ) : (
                                <div className="flex flex-col gap-2 min-w-[200px]">
                                    <p className="text-xs text-center text-red-300 font-bold uppercase tracking-wider">Are you sure?</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="flex-1 rounded-lg bg-gray-700 py-2 text-xs font-bold text-white hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleDeleteAccount}
                                            disabled={isLoadingDelete}
                                            className="flex-1 rounded-lg bg-red-600 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
                                        >
                                            {isLoadingDelete ? <Loader2 className="h-3 w-3 animate-spin mx-auto" /> : "YES, DELETE"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        {deleteMessage && (
                            <div className="mt-4 text-sm p-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-center">
                                {deleteMessage.text}
                            </div>
                        )}
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
