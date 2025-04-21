"use client";

import { useEffect, useState } from "react";
import { ProductSearchContext } from "@/context/ProductSearchContext";
import { createProductSearchFromProducts } from "@/app/flavors/[...path]/util/createProductSearchFromProducts";
import ProductDisplay from "@/app/flavors/[...path]/components/ProductDisplay";
import type { Product } from "@/app/flavors/[...path]/types/types";
import { favoritesApi } from "@/lib/api";
import Spinner from "@/components/spinner";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Product[] | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const result = await favoritesApi.getFavoriteProducts();
        setFavorites(result);
      } catch (e) {
        console.error("Failed to fetch favorites", e);
      }
    };
    fetchFavorites();
  }, []);

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
      {!favorites ? (
        <div className="bg-white h-full">
          <Spinner />
        </div>
      ) : (
        <ProductSearchContext.Provider
          value={{
            ...createProductSearchFromProducts(favorites),
            handleUnfavorite: (productId: number) => {
              setFavorites((prev) =>
                prev?.filter((p) => Number(p.id) !== productId) ?? null
              );
            },
          }}
        >
          <ProductDisplay hideCloseButton hideFilters />
        </ProductSearchContext.Provider>
      )}
    </div>
  );
}
