"use client";

import { useState, useMemo } from "react";
import type { CatalogueProduct } from "@/components/catalogue/types";
import type { CategoryFilter } from "@/lib/actions/catalogue";
import CatalogueFilterSidebar from "@/components/catalogue/CatalogueFilterSidebar";
import CatalogueGrid from "@/components/catalogue/CatalogueGrid";
import ProductDetailModal from "@/components/catalogue/ProductDetailModal";
import CatalogueParallaxBanner from "@/components/catalogue/CatalogueParallaxBanner";

interface Props {
  initialProducts: CatalogueProduct[];
}

export default function CatalogueClient({ initialProducts }: Props) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "default">("default");
  const [selectedProduct, setSelectedProduct] = useState<CatalogueProduct | null>(null);

  // Filter + sort client-side (data already fetched from server)
  const filtered = useMemo(() => {
    let list =
      activeCategory === "all"
        ? initialProducts
        : initialProducts.filter((p) => p.category === activeCategory);

    if (sortOrder === "asc")  list = [...list].sort((a, b) => a.price - b.price);
    if (sortOrder === "desc") list = [...list].sort((a, b) => b.price - a.price);

    return list;
  }, [initialProducts, activeCategory, sortOrder]);

  // Category counts for sidebar badges
  const counts = useMemo(() => {
    const c: Record<string, number> = {
      all:         initialProducts.length,
      tees:        initialProducts.filter((p) => p.category === "tees").length,
      jeans:       initialProducts.filter((p) => p.category === "jeans").length,
      outerwear:   initialProducts.filter((p) => p.category === "outerwear").length,
      accessories: initialProducts.filter((p) => p.category === "accessories").length,
    };
    return c;
  }, [initialProducts]);

  return (
    <div className="catalogue-page">
      {/* Mid-page parallax banner */}
      <CatalogueParallaxBanner />

      {/* Products body */}
      <div id="catalogue-grid" className="catalogue-body">
        <CatalogueFilterSidebar
          activeCategory={activeCategory}
          counts={counts}
          onCategoryChange={setActiveCategory}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
        <CatalogueGrid
          products={filtered}
          onSelectProduct={setSelectedProduct}
        />
      </div>

      {/* Product detail modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
