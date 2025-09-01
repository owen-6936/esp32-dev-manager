import {
    Calendar,
    Edit3,
    Github,
    Globe,
    Mail,
    MapPin,
    Smartphone,
    User,
} from "lucide-react";
import { useState } from "react";
import type { ProfileProps } from "../../../types/account/profile";

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
    const [showEditProfile, setShowEditProfile] = useState(false);
    return (
        <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-white/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        Profile Information
                    </h2>
                    <div className="flex gap-2">
                        {showEditProfile && (
                            <button
                                onClick={() => setShowEditProfile(false)}
                                className="bg-red-500 text-white px-3 py-2 text-sm rounded-lg hover:bg-red-600 transition-all flex items-center gap-2"
                            >
                                <Edit3 className="w-4 h-4" />
                                <span>Cancel</span>
                            </button>
                        )}
                        <button
                            onClick={() => setShowEditProfile(true)}
                            className="bg-blue-500 text-white px-3 py-2 text-sm rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
                        >
                            <Edit3 className="w-4 h-4" />
                            <span>Edit Profile</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="flex-shrink-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-3xl md:text-4xl font-bold text-white">
                                {name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </span>
                        </div>
                        <button className="mt-4 w-full bg-white/10 text-white px-3 py-2 text-sm rounded-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Change Photo</span>
                        </button>
                    </div>

                    <div className="flex-1 space-y-4">
                        <h3 className="text-xl md:text-2xl font-bold text-white">
                            {name}
                        </h3>
                        <p className="text-blue-200 text-sm md:text-base">
                            {jobTitle} at {company}
                        </p>
                        <p className="text-blue-200 text-sm md:text-base">
                            {bio}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-blue-200 text-sm">
                                    <Mail className="w-4 h-4" />
                                    <span>{email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-blue-200 text-sm">
                                    <Smartphone className="w-4 h-4" />
                                    <span>{phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-blue-200 text-sm">
                                    <MapPin className="w-4 h-4" />
                                    <span>{location}</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-blue-200 text-sm">
                                    <Globe className="w-4 h-4" />
                                    <a
                                        href={website}
                                        className="hover:text-white transition-colors break-words"
                                    >
                                        {website}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2 text-blue-200 text-sm">
                                    <Github className="w-4 h-4" />
                                    <a
                                        href={`https://github.com/${github}`}
                                        className="hover:text-white transition-colors break-words"
                                    >
                                        @{github}
                                    </a>
                                </div>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
