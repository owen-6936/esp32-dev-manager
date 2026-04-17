import {
    Calendar,
    Edit3,
    Github,
    Globe,
    Mail,
    MapPin,
    Smartphone,
    Save,
    X,
} from "lucide-react";
import { useState } from "react";
import type { ProfileProps } from "../../../types/account/profile";
import { useAuth } from "../../../contexts/AuthContext";
import * as auth from "../../../lib/auth";

export default function Profile({
    name = "",
    jobTitle = "",
    company = "",
    bio = "",
    email = "",
    phone = "",
    location = "",
    website = "",
    github = "",
    joinDate = "",
}: ProfileProps) {
    const { user, refreshProfile } = useAuth();
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        display_name: name,
        job_title: jobTitle,
        company,
        bio,
        phone,
        location,
        website,
        github_username: github,
    });

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            await auth.updateProfile(user.id, form);
            await refreshProfile();
            setEditing(false);
        } catch (err) {
            console.error("Failed to save profile:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setForm({
            display_name: name,
            job_title: jobTitle,
            company,
            bio,
            phone,
            location,
            website,
            github_username: github,
        });
        setEditing(false);
    };

    const displayName = name || email.split("@")[0] || "User";
    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-white/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        Profile Information
                    </h2>
                    <div className="flex gap-2">
                        {editing ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="bg-white/10 text-white px-3 py-2 text-sm rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Cancel</span>
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-green-500 text-white px-3 py-2 text-sm rounded-lg hover:bg-green-600 disabled:opacity-50 transition-all flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>{saving ? "Saving..." : "Save"}</span>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setEditing(true)}
                                className="bg-blue-500 text-white px-3 py-2 text-sm rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
                            >
                                <Edit3 className="w-4 h-4" />
                                <span>Edit Profile</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="flex-shrink-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-3xl md:text-4xl font-bold text-white">
                                {initials}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        {editing ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-white/40 text-xs mb-1">Display Name</label>
                                        <input
                                            value={form.display_name}
                                            onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/40 text-xs mb-1">Job Title</label>
                                        <input
                                            value={form.job_title}
                                            onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                                            placeholder="e.g. Embedded Developer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/40 text-xs mb-1">Company</label>
                                        <input
                                            value={form.company}
                                            onChange={(e) => setForm({ ...form, company: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                                            placeholder="Company name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/40 text-xs mb-1">Phone</label>
                                        <input
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                                            placeholder="+1 234 567 8900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/40 text-xs mb-1">Location</label>
                                        <input
                                            value={form.location}
                                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                                            placeholder="City, Country"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/40 text-xs mb-1">Website</label>
                                        <input
                                            value={form.website}
                                            onChange={(e) => setForm({ ...form, website: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                                            placeholder="https://yoursite.com"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-white/40 text-xs mb-1">GitHub Username</label>
                                        <input
                                            value={form.github_username}
                                            onChange={(e) => setForm({ ...form, github_username: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                                            placeholder="username"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-white/40 text-xs mb-1">Bio</label>
                                        <textarea
                                            value={form.bio}
                                            onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                            rows={3}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm resize-none"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-xl md:text-2xl font-bold text-white">
                                    {displayName}
                                </h3>
                                {(jobTitle || company) && (
                                    <p className="text-blue-200 text-sm md:text-base">
                                        {[jobTitle, company].filter(Boolean).join(" at ")}
                                    </p>
                                )}
                                {bio && (
                                    <p className="text-blue-200 text-sm md:text-base">
                                        {bio}
                                    </p>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-blue-200 text-sm">
                                            <Mail className="w-4 h-4" />
                                            <span>{email}</span>
                                        </div>
                                        {phone && (
                                            <div className="flex items-center gap-2 text-blue-200 text-sm">
                                                <Smartphone className="w-4 h-4" />
                                                <span>{phone}</span>
                                            </div>
                                        )}
                                        {location && (
                                            <div className="flex items-center gap-2 text-blue-200 text-sm">
                                                <MapPin className="w-4 h-4" />
                                                <span>{location}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        {website && (
                                            <div className="flex items-center gap-2 text-blue-200 text-sm">
                                                <Globe className="w-4 h-4" />
                                                <a
                                                    href={website}
                                                    className="hover:text-white transition-colors break-words"
                                                >
                                                    {website}
                                                </a>
                                            </div>
                                        )}
                                        {github && (
                                            <div className="flex items-center gap-2 text-blue-200 text-sm">
                                                <Github className="w-4 h-4" />
                                                <a
                                                    href={`https://github.com/${encodeURIComponent(github)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-white transition-colors break-words"
                                                >
                                                    @{github}
                                                </a>
                                            </div>
                                        )}
                                        {joinDate && (
                                            <div className="flex items-center gap-2 text-blue-200 text-sm">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    Joined{" "}
                                                    {new Date(joinDate).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "long",
                                                            year: "numeric",
                                                        },
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
