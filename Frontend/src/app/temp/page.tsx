"use client";

import { useEffect, useState } from "react";
import { ProductSearchContext } from "@/context/ProductSearchContext";
import { createProductSearchFromProducts } from "../flavors/[...path]/createProductSearchFromProducts";
import ProductDisplay from "../flavors/[...path]/ProductDisplay";
import type { Product } from "@/app/flavors/[...path]/types";
import { getFavoriteProducts } from "@/lib/apiClient";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Product[] | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const result = await getFavoriteProducts(); // must return Product[]
        setFavorites(result);
      } catch (e) {
        console.error("Failed to fetch favorites", e);
      }
    };
    fetchFavorites();
  }, []);

  if (!favorites) {
    return <div className="p-4">Loading favorites…</div>;
  }

  const contextValue = createProductSearchFromProducts(favorites);

  return (
    <ProductSearchContext.Provider value={contextValue}>
      <ProductDisplay />
    </ProductSearchContext.Provider>
  );
}
