import type { UseProductSearchResult, Product } from '../types/types';

export const createProductSearchFromProducts = (products: Product[]): UseProductSearchResult => {
  const prices = products.map(p => p.price).filter((p): p is number => p !== undefined);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 100;

  const uniqueRoastDegrees = Array.from(
    new Set(products.map(p => p.roastDegree).filter((rd): rd is string => !!rd))
  );

  return {
    matchingProducts: products,
    loadingProducts: false,
    productError: null,
    triggerProductSearch: async () => {},
    handleCloseProductsView: () => {},

    maxPriceFilter: maxPrice,
    availabilityFilter: "All",
    roastDegreeFilter: "",
    maxPossiblePrice: maxPrice,
    currentFilteredMaxPrice: maxPrice,
    uniqueRoastDegrees,

    handleMaxPriceChange: () => {},
    handleAvailabilityChange: () => {},
    handleRoastDegreeChange: () => {},
    handleResetFilters: () => {},

    priceSortOrder: 'none',
    handlePriceSortToggle: () => {},

    totalFetchedCount: products.length,
    isFilterInverted: false,
    handleToggleInvertFilter: () => {},
  };
};
