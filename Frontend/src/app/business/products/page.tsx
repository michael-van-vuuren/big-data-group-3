"use client";

import { useEffect, useState, useCallback } from "react";
import { ProductSearchContext } from "@/context/ProductSearchContext";
import { createProductSearchFromProducts } from "@/app/flavors/[...path]/util/createProductSearchFromProducts";
import ProductDisplay from "@/app/flavors/[...path]/components/ProductDisplay";
import type { Product } from "@/app/flavors/[...path]/types/types";
import { useAuth } from "@/context/AuthContext";
import { productsApi } from "@/lib/api";
import Spinner from "@/components/spinner";

export default function RoasterProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !user.name) {
      setIsLoading(false);
      setProducts([]);
      return;
    }

    const roasterName = user.name;

    const fetchRoasterProducts = async (name: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await productsApi.getProductsByRoaster(name);
        setProducts(result);
      } catch (e) {
        console.error(`Failed to fetch products for roaster: ${name}`, e);
        setError(`Failed to load products for ${name}.`);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoasterProducts(roasterName);
  }, [user?.name]);

  const handleProductDeleted = useCallback((productIdToDelete: number | string) => {
    setProducts((currentProducts) => {
      if (!currentProducts) return null;
      return currentProducts.filter(product => String(product.id) !== String(productIdToDelete));
    });
  }, []);

  const contextValue = products ? createProductSearchFromProducts(products) : null;

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
      {isLoading &&
        <div className="bg-white h-full">
          <Spinner />
        </div>
      }

      {!isLoading && error && (
        <div className="p-4 text-red-500">{error}</div>
      )}

      {!isLoading && !error && products && (
        <ProductSearchContext.Provider value={contextValue!}>
          <ProductDisplay
            hideCloseButton
            hideFilters
            onProductDelete={handleProductDeleted}
          />
        </ProductSearchContext.Provider>
      )}

      {!isLoading && !error && (!products || (products.length === 0 && !user?.name)) && (
        <div className="p-4">
          Please log in to see roaster products.
        </div>
      )}
    </div>
  );
}
