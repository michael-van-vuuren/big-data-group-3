import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { getProductsByFlavors } from "@/lib/apiClient";
import type { Product, AvailabilityFilter, UseProductSearchResult, RoastDegreeFilter, PriceSortOrder } from "./types";
import { toTitleCase } from "@/lib/stringutils";

const DEFAULT_MAX_PRICE = 10;
const DEFAULT_ROAST_FILTER = "All";
const DEFAULT_PRICE_SORT_ORDER: PriceSortOrder = 'none';

// This is a hook that is used in the ProductDisplay section for calling apiClient to fetch 
// and for filtering the results
export function useProductSearch(
  setShowProductsView: (show: boolean) => void,
  setReset: (reset: boolean) => void
): UseProductSearchResult {

  const [matchingProducts, setMatchingProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);
  const allProductsRef = useRef<Product[]>([]);

  // Filter states
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(DEFAULT_MAX_PRICE);
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>("All");
  const [roastDegreeFilter, setRoastDegreeFilter] = useState<RoastDegreeFilter>(DEFAULT_ROAST_FILTER);
  const [isFilterInverted, setIsFilterInverted] = useState(false);
  const [priceSortOrder, setPriceSortOrder] = useState<PriceSortOrder>(DEFAULT_PRICE_SORT_ORDER);

  // Initialize the price slider
  const maxPossiblePrice = useMemo(() => {
    const products = allProductsRef.current;
    if (!products || products.length === 0) return DEFAULT_MAX_PRICE;
    const max = products.reduce((maxP, product) => {
      if (product.price !== undefined && product.price > maxP) {
        return product.price;
      }
      return maxP;
    }, 0);
    return Math.max(Math.ceil(max) || 0, DEFAULT_MAX_PRICE);
  }, [allProductsRef.current]);

  // Initialize the roast degree dropdown
  const uniqueRoastDegrees = useMemo(() => {
    const degrees = new Set<string>();
    allProductsRef.current.forEach(product => {
      if (product.roastDegree && product.roastDegree.trim()) {
        degrees.add(toTitleCase(product.roastDegree.trim()));
      }
    });
    return [DEFAULT_ROAST_FILTER, ...Array.from(degrees).sort()];
  }, [allProductsRef.current]);

  // Adjust current price slider max based on filter results
  const currentFilteredMaxPrice = useMemo(() => {
    const filteredProducts = allProductsRef.current.filter(p => {
       let availabilityMatch = true;
       if (availabilityFilter === 'Available') { availabilityMatch = p.availability?.toUpperCase() === "YES"; }
       else if (availabilityFilter === 'Unavailable') { availabilityMatch = p.availability?.toUpperCase() === "NO"; }
       const roastMatch = roastDegreeFilter === DEFAULT_ROAST_FILTER || (p.roastDegree && p.roastDegree.trim().toLowerCase() === roastDegreeFilter.toLowerCase());
       return availabilityMatch && roastMatch;
    });

    if (filteredProducts.length === 0) return maxPossiblePrice;

    const max = filteredProducts.reduce((maxP, product) =>
       (product.price !== undefined && product.price > maxP) ? product.price : maxP, 0);
    return Math.max(Math.ceil(max) || 0, DEFAULT_MAX_PRICE);
  }, [allProductsRef.current, availabilityFilter, roastDegreeFilter, maxPossiblePrice]);

  useEffect(() => {
    setMaxPriceFilter(currentFilteredMaxPrice);
  }, [currentFilteredMaxPrice]);

  /* --- Product search callback --- */
  const triggerProductSearch = useCallback(async (notes: string[], searchStrictnessFlag?: boolean) => {
    const useStrictSearch = searchStrictnessFlag ?? false;

    if (notes.length === 0) {

      console.warn("triggerProductSearch called with no subCategories.");
      allProductsRef.current = [];
      setMatchingProducts([]);
      setProductError(null);
      setShowProductsView(false);
      return;
    }

    setLoadingProducts(true);
    setProductError(null);
    setIsFilterInverted(false);

    try {
      const fetchedProducts = await getProductsByFlavors(notes, useStrictSearch);
      allProductsRef.current = fetchedProducts;

      const initialOverallMax = Math.max(
        Math.ceil(
          fetchedProducts.reduce((maxP: number, p: Product) =>
              (p.price !== undefined && p.price > maxP) ? p.price : maxP,
            0)
        ) || 0,
        DEFAULT_MAX_PRICE
      );

      setMaxPriceFilter(initialOverallMax);
      setAvailabilityFilter('All');
      setRoastDegreeFilter(DEFAULT_ROAST_FILTER);
      setPriceSortOrder(DEFAULT_PRICE_SORT_ORDER);
      setShowProductsView(true);

    } catch (err: any) {
      console.error("Failed to fetch products by flavors:", err);
      setProductError(err.message || "Failed to fetch matching products");
      allProductsRef.current = [];
      setMatchingProducts([]);
      setShowProductsView(true);
    } finally {
      setLoadingProducts(false);
    }
  }, [setShowProductsView]);


  /* --- Filtering & Sorting logic --- */
  useEffect(() => {
    let tempProducts = [...allProductsRef.current];

    // Filtering
    tempProducts = tempProducts.filter(p => {
      // Price slider
      const priceMatch = p.price === undefined || p.price <= maxPriceFilter;
      // Availability radio buttons
      let availabilityMatch = true;
      if (availabilityFilter === 'Available') {
        availabilityMatch = p.availability?.toUpperCase() === "YES";
      } else if (availabilityFilter === 'Unavailable') {
        availabilityMatch = p.availability?.toUpperCase() === "NO";
      }
      // Roast degree dropdown
      const roastMatch = roastDegreeFilter === DEFAULT_ROAST_FILTER ||
        (p.roastDegree && p.roastDegree.trim().toLowerCase() === roastDegreeFilter.toLowerCase());

      const passesFilters = priceMatch && availabilityMatch && roastMatch;
      return isFilterInverted ? !passesFilters : passesFilters;
    });
    
    // Sorting
    if (priceSortOrder !== 'none') {
      tempProducts.sort((a, b) => {
        // Undefined is treated as highest for asc, lowest for desc
        const priceA = a.price ?? (priceSortOrder === 'asc' ? Infinity : -Infinity);
        const priceB = b.price ?? (priceSortOrder === 'asc' ? Infinity : -Infinity);

        return priceSortOrder === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }
    else {
      // Default order is alphabetical by product name
      tempProducts.sort((a, b) => a.name.localeCompare(b.name))
    }

    setMatchingProducts(tempProducts);

  }, [allProductsRef.current, maxPriceFilter, availabilityFilter, roastDegreeFilter, isFilterInverted, priceSortOrder]);

  const handleMaxPriceChange = useCallback((value: number) => {
    setMaxPriceFilter(value);
  }, []);

  const handleAvailabilityChange = useCallback((value: AvailabilityFilter) => {
    setAvailabilityFilter(value);
  }, []);

  const handleRoastDegreeChange = useCallback((value: RoastDegreeFilter) => {
    setRoastDegreeFilter(value);
  }, []);

  const handleToggleInvertFilter = useCallback(() => {
    setIsFilterInverted(prev => !prev);
  }, []);

  const handlePriceSortToggle = useCallback(() => {
    setPriceSortOrder(prevOrder => {
      if (prevOrder === 'none') return 'asc';
      if (prevOrder === 'asc') return 'desc';
      return 'none'; // none -> asc -> desc -> none
    });
  }, []);

  // Clear button logic
  const handleResetFilters = useCallback(() => {
    setMaxPriceFilter(maxPossiblePrice);
    setAvailabilityFilter('All');
    setRoastDegreeFilter(DEFAULT_ROAST_FILTER);
    setIsFilterInverted(false);
    setPriceSortOrder(DEFAULT_PRICE_SORT_ORDER);
  }, [maxPossiblePrice]);

  // X button logic
  const handleCloseProductsView = useCallback(() => {
    setShowProductsView(false);
    allProductsRef.current = [];
    setMatchingProducts([]);
    setProductError(null);
    setLoadingProducts(false);
    setMaxPriceFilter(DEFAULT_MAX_PRICE);
    setAvailabilityFilter('All');
    setRoastDegreeFilter(DEFAULT_ROAST_FILTER);
    setIsFilterInverted(false);
    setPriceSortOrder(DEFAULT_PRICE_SORT_ORDER);
    setReset(true);
  }, [setShowProductsView, setReset]);


  return {
    // Products
    matchingProducts,
    loadingProducts,
    productError,
    totalFetchedCount: allProductsRef.current.length,

    // Actions
    triggerProductSearch,
    handleCloseProductsView,
    handleResetFilters,
    handleToggleInvertFilter,

    // Filter state
    maxPriceFilter,
    availabilityFilter,
    roastDegreeFilter,
    isFilterInverted,
    maxPossiblePrice,
    uniqueRoastDegrees,
    currentFilteredMaxPrice,

    // Filter handlers
    handleMaxPriceChange,
    handleAvailabilityChange,
    handleRoastDegreeChange,

    // Sort state & handler
    priceSortOrder,
    handlePriceSortToggle,    
  };
}
