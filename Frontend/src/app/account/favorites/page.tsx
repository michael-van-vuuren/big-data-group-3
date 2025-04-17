"use client";

import { useEffect, useState } from "react";
import { ProductSearchContext } from "@/context/ProductSearchContext";
import { createProductSearchFromProducts } from "@/app/flavors/[...path]/createProductSearchFromProducts";
import ProductDisplay from "@/app/flavors/[...path]/ProductDisplay";
import type { Product } from "@/app/flavors/[...path]/types";
import { getFavoriteProducts } from "@/lib/apiClient";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Product[] | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const result = await getFavoriteProducts();
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
    <div
      style={{
        position: "absolute",
        top: "-16px",
        width: "100vw",
        height: "calc(100vh - 58px)",
        overflow: "hidden",
      }}
      className="my-4 w-full lg:border-4 sm:border-t-2 border-border text-mtext flex flex-col"
    >
      <ProductSearchContext.Provider value={contextValue}>
        <ProductDisplay hideCloseButton hideFilters />
      </ProductSearchContext.Provider>
    </div>
  );
}
