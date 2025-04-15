export interface Product {
  beanId: string;
  name: string;
  image?: string;
  roastDegree?: string;
  price?: number;
  pricePerCup?: number;
  bulkPricePerCup?: number;
  availability?: string; // "YES" or "NO"
  flavors?: { name: string }[];
  webpage?: string;
}

export type AvailabilityFilter = "All" | "Available" | "Unavailable";

export type RoastDegreeFilter = string;

export interface UseProductSearchResult {
  matchingProducts: Product[]; 
  loadingProducts: boolean;
  productError: string | null;
  triggerProductSearch: (subCategories: string[]) => Promise<void>;
  handleCloseProductsView: () => void;
  
  // Filter-related returns
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

  // Total number of results
  totalFetchedCount: number;
  isFilterInverted: boolean;
  handleToggleInvertFilter: () => void;
}
