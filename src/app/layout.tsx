import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ProfileDataProvider } from "@/context/ProfileDataContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Novure | Essentialized Daily Wear",
  description:
    "Discover reimagined modern casual clothing for men. Premium neumorphism 3D e-commerce experience with immersive motion design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <AuthProvider>
          <ProfileDataProvider>
            <CartProvider>{children}</CartProvider>
          </ProfileDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
