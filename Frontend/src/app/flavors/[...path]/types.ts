import { ProductSearchQuery } from "@/context/ProductSearchContext";

export interface Product {
  id: number | string;
  name: string;
  image?: string;
  webpage?: string;
  gram?: number;
  roastDegree?: string;
  availability?: string;
  price?: number;
  pricePerCup?: number;
  bulkPricePerCup?: number;
  roaster?: {
    name: string;
    country?: {
      name: string;
    };
  };
  process?: {
    name: string;
    tag?: string;
  };
  flavors?: { name: string }[];
  producers?: {
    name: string;
    tag?: string;
    elevation?: string;
    regions?: { name: string }[];
    countries?: { name: string }[];
  }[];
}

export type AvailabilityFilter = "All" | "Available" | "Unavailable";

export type RoastDegreeFilter = string;

export type PriceSortOrder = 'none' | 'asc' | 'desc';

export interface UseProductSearchResult {
  // Products
  matchingProducts: Product[];
  loadingProducts: boolean;
  productError: string | null;
  triggerProductSearch: (query: ProductSearchQuery) => Promise<void>;
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
  handleUnfavorite?: (productId: number) => void;
}
