export interface Product {
  id: string;
  name: string;
  image?: string;
  roastDegree?: string;
  price?: number;
  pricePerCup?: number;
  bulkPricePerCup?: number;
  gram?: number;
  availability?: string; // "YES" or "NO"
  flavors?: { name: string }[];
  webpage?: string;
}

export type AvailabilityFilter = "All" | "Available" | "Unavailable";

export type RoastDegreeFilter = string;

export type PriceSortOrder = 'none' | 'asc' | 'desc';

export interface UseProductSearchResult {
  // Products
  matchingProducts: Product[]; 
  loadingProducts: boolean;
  productError: string | null;
  triggerProductSearch: (subCategories: string[]) => Promise<void>;
  handleCloseProductsView: () => void;
  
  // Filters
  maxPriceFilter: number;
  availabilityFilter: AvailabilityFilter;
  roastDegreeFilter: RoastDegreeFilter;
  maxPossiblePrice: number;
  currentFilteredMaxPrice: number;
  uniqueRoastDegrees: string[];

  handleMaxPriceChange: (value: number) => void;
  handleAvailabilityChange: (value: AvailabilityFilter) => void;
  handleRoastDegreeChange: (value: RoastDegreeFilter) => void;
  handleResetFilters: () => void;

  // Sorting
  priceSortOrder: PriceSortOrder;
  handlePriceSortToggle: () => void;

  // Misc
  totalFetchedCount: number;
  isFilterInverted: boolean;
  handleToggleInvertFilter: () => void;
}
