"use client";

/**
 * components/auth/profile/ProfileAvatar.tsx
 * Dark circle avatar — #111 bg, white initials.
 */

interface ProfileAvatarProps {
  name: string;
}

function getInitials(name: string = ""): string {
  const safeName = name || "U";
  return safeName
    .split(" ")
    .slice(0, 2)
    .map((w) => w ? w[0] : "")
    .join("")
    .toUpperCase();
}

export default function ProfileAvatar({ name }: ProfileAvatarProps) {
  return (
    <div className="profile-avatar">
      {getInitials(name)}
    </div>
  );
}
