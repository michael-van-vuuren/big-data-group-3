import { createContext, useContext } from 'react';
import type { UseProductSearchResult } from '@/app/flavors/[...path]/types';

const defaultContextValue: UseProductSearchResult = {
  matchingProducts: [],
  loadingProducts: false,
  productError: null,
  triggerProductSearch: async () => { console.warn("ProductSearchContext: triggerProductSearch not implemented"); },
  handleCloseProductsView: () => { console.warn("ProductSearchContext: handleCloseProductsView not implemented"); },
  maxPriceFilter: 100,
  availabilityFilter: "All",
  maxPossiblePrice: 100,
  handleMaxPriceChange: () => {},
  handleAvailabilityChange: () => {},
  handleResetFilters: () => {},
  totalFetchedCount: 0,
  isFilterInverted: false,
  handleToggleInvertFilter: () => {},
};

export const ProductSearchContext = createContext<UseProductSearchResult>(defaultContextValue);

export const useProductSearchContext = () => {
  const context = useContext(ProductSearchContext);
  if (context === defaultContextValue) {
    console.warn("useProductSearchContext must be used within a ProductSearchProvider");
  }
  return context;
};
