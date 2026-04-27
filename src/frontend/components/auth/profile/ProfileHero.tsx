"use client";

import ProfileAvatar from "./ProfileAvatar";

interface ProfileHeroProps {
  user: any;
}

export default function ProfileHero({ user }: ProfileHeroProps) {
  return (
    <div className="profile-hero">
      <span className="profile-section-label">
        /01 — Profil Saya
      </span>

      <ProfileAvatar name={user.name} />

      <h1 className="profile-name">
        {user.name || user.email.split("@")[0]}
      </h1>

      <p className="profile-email">
        {user.email}
      </p>

      <span className="profile-role-badge">
        {user.role === "admin" ? "Administrator" : "Member"}
      </span>
    </div>
  );
}
