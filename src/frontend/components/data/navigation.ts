// Navigation, filter, and pill data

export const NAV_LINKS = {
  left: [
    { label: "Male", href: "#" },
    { label: "About Us", href: "/about" },
  ],
  right: [
    { label: "Wishlist", href: "#" },
    { label: "My Cart", href: "#" },
  ],
};

export const STYLE_PILLS = ["Classic", "Everyday", "Soft", "Foundation", "Active", "Essential"];

export const FILTER_OPTIONS = ["Category", "Size", "Color", "Price"];

export const FOOTER_LINKS = [
  { title: "Shop", items: ["Tees", "Hoodies", "Pants", "Accessories"] },
  { title: "Company", items: ["About", "Careers", "Press", "Sustainability"] },
  { title: "Support", items: ["FAQ", "Returns", "Shipping", "Contact"] },
];

export const HERO_CORNER_LABELS = [
  { text: "Classic", cls: "top-left", delay: 0.5 },
  { text: "Essential", cls: "top-right", delay: 0.6 },
  { text: "Foundation", cls: "bottom-left", delay: 0.7 },
  { text: "Active", cls: "bottom-right", delay: 0.8 },
];
