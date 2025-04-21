import { createContext, useContext, useState, useMemo, useCallback, useRef } from 'react';
import type { UseProductSearchResult, ProductSearchQuery, Product, AvailabilityFilter, RoastDegreeFilter, PriceSortOrder } from '@/app/flavors/[...path]/types/types';
import { productsApi } from "@/lib/api";
import { toTitleCase } from "@/lib/utils/stringutils";

const DEFAULT_MAX_PRICE = 60;
const DEFAULT_ROAST_FILTER = "All";
const DEFAULT_PRICE_SORT_ORDER: PriceSortOrder = 'none';

const defaultContextValue: UseProductSearchResult = {
  matchingProducts: [],
  loadingProducts: false,
  productError: null,
  triggerProductSearch: async () => {
    console.warn("ProductSearchContext: triggerProductSearch not implemented");
  },
  handleCloseProductsView: () => {
    console.warn("ProductSearchContext: handleCloseProductsView not implemented");
  },
  maxPriceFilter: DEFAULT_MAX_PRICE,
  availabilityFilter: "All",
  roastDegreeFilter: DEFAULT_ROAST_FILTER,
  maxPossiblePrice: DEFAULT_MAX_PRICE,
  currentFilteredMaxPrice: DEFAULT_MAX_PRICE,
  uniqueRoastDegrees: [],
  handleMaxPriceChange: () => { },
  handleAvailabilityChange: () => { },
  handleRoastDegreeChange: () => { },
  handleResetFilters: () => { },
  priceSortOrder: 'none',
  handlePriceSortToggle: () => { },
  totalFetchedCount: 0,
  isFilterInverted: false,
  handleToggleInvertFilter: () => { },
  handleUnfavorite: () => { }
};

// Create context
export const ProductSearchContext = createContext<UseProductSearchResult>(defaultContextValue);

// Hook
export const useProductSearchContext = () => {
  const context = useContext(ProductSearchContext);
  if (context === defaultContextValue) {
    console.warn("useProductSearchContext must be used within a ProductSearchProvider");
  }
  return context;
};

export const ProductSearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [matchingProducts, setMatchingProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);
  const allProductsRef = useRef<Product[]>([]);

  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(DEFAULT_MAX_PRICE);
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>("All");
  const [roastDegreeFilter, setRoastDegreeFilter] = useState<RoastDegreeFilter>(DEFAULT_ROAST_FILTER);
  const [isFilterInverted, setIsFilterInverted] = useState(false);
  const [priceSortOrder, setPriceSortOrder] = useState<PriceSortOrder>(DEFAULT_PRICE_SORT_ORDER);

  const uniqueRoastDegrees = useMemo(() => {
    const degrees = new Set<string>();
    allProductsRef.current.forEach(product => {
      if (product.roastDegree && product.roastDegree.trim()) {
        degrees.add(toTitleCase(product.roastDegree.trim()));
      }
    });
    return [DEFAULT_ROAST_FILTER, ...Array.from(degrees).sort()];
  }, [allProductsRef.current]);

  const currentFilteredMaxPrice = useMemo(() => {
    const filteredProducts = allProductsRef.current.filter(p => {
      let availabilityMatch = true;
      if (availabilityFilter === 'Available') {
        availabilityMatch = p.availability?.toUpperCase() === "YES";
      } else if (availabilityFilter === 'Unavailable') {
        availabilityMatch = p.availability?.toUpperCase() === "NO";
      }
      const roastMatch = roastDegreeFilter === DEFAULT_ROAST_FILTER || (p.roastDegree && p.roastDegree.trim().toLowerCase() === roastDegreeFilter.toLowerCase());
      return availabilityMatch && roastMatch;
    });

    return DEFAULT_MAX_PRICE;
  }, [allProductsRef.current, availabilityFilter, roastDegreeFilter]);

  const triggerProductSearch = useCallback(async (query: ProductSearchQuery) => {
    console.log("Triggering product search with query:", query);
    setLoadingProducts(true);
    setProductError(null);
    setIsFilterInverted(false);

    try {
      const fetchedProducts = await productsApi.searchProducts(query);

      allProductsRef.current = fetchedProducts;
      setMatchingProducts(fetchedProducts);

      console.log("Fetched Products:", fetchedProducts);

      setMaxPriceFilter(DEFAULT_MAX_PRICE);
      setAvailabilityFilter('All');
      setRoastDegreeFilter(DEFAULT_ROAST_FILTER);
      setPriceSortOrder(DEFAULT_PRICE_SORT_ORDER);

    } catch (err: any) {
      console.error("Failed to fetch products:", err);
      setProductError(err.message || "Failed to fetch matching products");
      allProductsRef.current = [];
      setMatchingProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const handleCloseProductsView = useCallback(() => {
    allProductsRef.current = [];
    setMatchingProducts([]);
    setProductError(null);
    setLoadingProducts(false);
    setMaxPriceFilter(DEFAULT_MAX_PRICE);
    setAvailabilityFilter('All');
    setRoastDegreeFilter(DEFAULT_ROAST_FILTER);
    setIsFilterInverted(false);
    setPriceSortOrder(DEFAULT_PRICE_SORT_ORDER);
  }, []);

  const value: UseProductSearchResult = {
    matchingProducts,
    loadingProducts,
    productError,
    triggerProductSearch,
    handleCloseProductsView,
    maxPriceFilter,
    availabilityFilter,
    roastDegreeFilter,
    maxPossiblePrice: DEFAULT_MAX_PRICE,
    currentFilteredMaxPrice,
    uniqueRoastDegrees,
    priceSortOrder,

    handleMaxPriceChange: setMaxPriceFilter,
    handleAvailabilityChange: setAvailabilityFilter,
    handleRoastDegreeChange: setRoastDegreeFilter,
    handleResetFilters: () => {
      setMaxPriceFilter(DEFAULT_MAX_PRICE);
      setAvailabilityFilter('All');
      setRoastDegreeFilter(DEFAULT_ROAST_FILTER);
      setIsFilterInverted(false);
      setPriceSortOrder(DEFAULT_PRICE_SORT_ORDER);
    },
    handleToggleInvertFilter: () => {
      setIsFilterInverted(prev => !prev);
    },
    handlePriceSortToggle: () => {
      setPriceSortOrder(prevOrder => {
        if (prevOrder === 'none') return 'asc';
        if (prevOrder === 'asc') return 'desc';
        return 'none';
      });
    },

    totalFetchedCount: allProductsRef.current.length,
    isFilterInverted,
  };

  return (
    <ProductSearchContext.Provider value={value}>
      {children}
    </ProductSearchContext.Provider>
  );
};
