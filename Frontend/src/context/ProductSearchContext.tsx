import { createContext, useContext } from 'react';
import type { UseProductSearchResult } from '@/app/flavors/[...path]/types';

const defaultContextValue: UseProductSearchResult = {
  // Products
  matchingProducts: [],
  loadingProducts: false,
  productError: null,
  triggerProductSearch: async () => { 
    console.warn("ProductSearchContext: triggerProductSearch not implemented"); 
  },
  handleCloseProductsView: () => { 
    console.warn("ProductSearchContext: handleCloseProductsView not implemented"); 
  },
  
  // Filters
  maxPriceFilter: 100,
  availabilityFilter: "All",
  roastDegreeFilter: "",
  maxPossiblePrice: 100,
  currentFilteredMaxPrice: 100,
  uniqueRoastDegrees: [],
  handleMaxPriceChange: () => {},
  handleAvailabilityChange: () => {},
  handleRoastDegreeChange: () => {},
  handleResetFilters: () => {},
  
  // Sorting
  priceSortOrder: 'none',
  handlePriceSortToggle: () => {},

  // Misc
  totalFetchedCount: 0,
  isFilterInverted: false,
  handleToggleInvertFilter: () => {},
  handleUnfavorite: () => {}
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

export type ProductSearchContextType = UseProductSearchResult;
