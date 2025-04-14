import { useState } from "react";
import { getProductsByFlavors } from "@/lib/apiClient";
import type { Product } from "./types";

export function useProductSearch(setShowProductsView: (show: boolean) => void, setReset: (reset: boolean) => void) {
  const [matchingProducts, setMatchingProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);

  const triggerProductSearch = async (subCategories: string[]) => {
    if (subCategories.length === 0) return;

    setLoadingProducts(true);
    setProductError(null);
    setMatchingProducts([]);

    try {
      const products = await getProductsByFlavors(subCategories);
      setMatchingProducts(products);
      setShowProductsView(true);
    } catch (err: any) {
      setProductError(err.message || "Failed to fetch matching products");
      setShowProductsView(true);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleCloseProductsView = () => {
    setShowProductsView(false);
    setMatchingProducts([]);
    setProductError(null);
    setLoadingProducts(false);
    setReset(true); // reset planet view
  };

  return {
    matchingProducts,
    loadingProducts,
    productError,
    triggerProductSearch,
    handleCloseProductsView,
  };
}
