"use client";

import { useEffect, useState, useCallback } from "react";
import { ProductSearchContext } from "@/context/ProductSearchContext";
import { createProductSearchFromProducts } from "@/app/flavors/[...path]/util/createProductSearchFromProducts";
import ProductDisplay from "@/app/flavors/[...path]/components/ProductDisplay";
import type { Product } from "@/app/flavors/[...path]/types/types";
import { useAuth } from "@/context/AuthContext";
import { productsApi } from "@/lib/api";


// Uses user.name when user.role is "BUSINESS" to fetch the business' products
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

  if (isLoading)
    return <div className="p-4">Loading products for {user?.name || 'roaster'}...</div>;
  if (error)
    return <div className="p-4 text-red-500">{error}</div>;
  if (!products)
    return <div className="p-4">Could not load product information.</div>;
  if (products.length === 0 && !user?.name)
    return <div className="p-4">Please log in to see roaster products.</div>;

  const contextValue = createProductSearchFromProducts(products);

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
        <ProductDisplay
          hideCloseButton
          hideFilters
          onProductDelete={handleProductDeleted}
        />
      </ProductSearchContext.Provider>
    </div>
  );
}
