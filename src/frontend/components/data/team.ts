// Team members and company values for the About page

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  accent: string;
}

export interface CompanyValue {
  icon: string;
  title: string;
  desc: string;
}

export const TEAM: TeamMember[] = [
  {
    name: "Fifin Agustiana",
    role: "Creative Director & Co-Founder",
    bio: "A visionary in modern fashion aesthetics, Fifin brings an eye for minimalist elegance and textile innovation that defines every Novure piece.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    accent: "#9b51e0",
  },
  {
    name: "I Gede Bayu Pamungkas",
    role: "Chief Executive Officer",
    bio: "With a strategic mind and passion for disrupting fast fashion, Bayu drives Novure's mission to make premium essentials accessible to everyone.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    accent: "#9cad8f",
  },
  {
    name: "Zilal Afwu Rahman",
    role: "Head of Product Design",
    bio: "Zilal is the architect behind Novure's signature silhouettes. Every cut, stitch, and drape is meticulously crafted under his watchful design philosophy.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    accent: "#27ae60",
  },
  {
    name: "Safdar Rahman",
    role: "Chief Technology Officer",
    bio: "Safdar bridges the gap between fashion and technology, building the digital infrastructure that powers Novure's seamless e-commerce experience.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    accent: "#e05177",
  },
];

export const VALUES: CompanyValue[] = [
  { icon: "✦", title: "Craftsmanship", desc: "Every piece is engineered with precision — from the first thread to the final press." },
  { icon: "◆", title: "Sustainability", desc: "Conscious production meets modern design, built to last beyond a single season." },
  { icon: "●", title: "Innovation", desc: "We push boundaries in fabric technology, fit science, and the way you shop." },
  { icon: "▲", title: "Community", desc: "Novure isn't a brand — it's a culture of people who refuse to settle for ordinary." },
];
