import Link from "next/link";
import { Instagram, Linkedin, Mail, MessageCircle } from "lucide-react";

const footerLinks = [
    {
        title: "Platform",
        links: [
            { name: "About Us", href: "/about" },
            { name: "How It Works", href: "/how-it-works" },
            { name: "Join", href: "/join" },
        ],
    },
    {
        title: "Community",
        links: [
            { name: "Browse Members", href: "/community" },
            { name: "Discord", href: "#" },
            { name: "Blog", href: "#" },
            { name: "Events", href: "#" },
        ],
    },
];

export function Footer() {
    return (
        <footer className="w-full bg-black pt-20 pb-10 text-white">
            <div className="container mx-auto px-6">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="mb-6 inline-block text-2xl font-bold tracking-tight text-white uppercase">
                            STUSIL
                        </Link>
                        <p className="max-w-xs text-sm leading-relaxed text-gray-400">
                            Connecting students through skills and projects. Where ideas find the right hands to build them.
                        </p>
                    </div>

                    {/* Links Columns */}
                    {footerLinks.map((column) => (
                        <div key={column.title} className="lg:col-span-1">
                            <h3 className="mb-6 text-base font-bold text-white">
                                {column.title}
                            </h3>
                            <ul className="space-y-4">
                                {column.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-gray-400 transition-colors hover:text-white"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Connect Column */}
                    <div className="lg:col-span-1">
                        <h3 className="mb-6 text-base font-bold text-white">Connect</h3>
                        <div className="flex space-x-4">
                            <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/20 hover:text-white text-gray-400">
                                {/* Discord Icon Proxy */}
                                <MessageCircle className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/20 hover:text-white text-gray-400">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/20 hover:text-white text-gray-400">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/20 hover:text-white text-gray-400">
                                <Mail className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-20 flex flex-col items-center justify-between border-t border-white/10 pt-8 text-sm text-gray-500 md:flex-row">
                    <p>&copy; 2026 Stusil. All rights reserved.</p>
                    <div className="mt-4 flex space-x-8 md:mt-0">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
