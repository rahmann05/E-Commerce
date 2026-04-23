/**
 * app/catalogue/page.tsx
 *
 * Server Component — fetches products from MySQL on the server.
 * Passes data down to CatalogueClient (Client Component) for interactivity.
 */

import type { Metadata } from "next";
import { ColorProvider } from "@/components/providers/ColorContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CatalogueHero from "@/components/catalogue/CatalogueHero";
import CatalogueClient from "@/components/catalogue/CatalogueClient";
import { getProducts } from "@/lib/actions/catalogue";

export const metadata: Metadata = {
  title: "Catalogue | Novure — Essentialized Daily Wear",
  description:
    "Browse the full Novure collection — premium tees, denim, and accessories crafted for modern everyday wear.",
};

// Revalidate every 60s so new DB entries show up without a full deploy
export const revalidate = 60;

export default async function CataloguePage() {
  const products = await getProducts("all");

  return (
    <ColorProvider>
      <main style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <CatalogueHero />
        <CatalogueClient initialProducts={products} />
        <Footer />
      </main>
    </ColorProvider>
  );
}
