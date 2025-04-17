import { useState, useEffect } from 'react';
import { useProductSearchContext } from '@/context/ProductSearchContext';
import ProductFilterControls from './ProductFilterControls';
import ProductGrid from './ProductGrid';
import { Product } from './types';
import { getFavoriteProducts } from '@/lib/apiClient';

interface ProductDisplayProps {
  hideFilters?: boolean;
  hideCloseButton?: boolean;
}

export default function ProductDisplay({ hideFilters = false, hideCloseButton = false }: ProductDisplayProps) {
  const contextValues = useProductSearchContext();
  const {
    matchingProducts,
    currentFilteredMaxPrice,
    uniqueRoastDegrees,
  } = contextValues;

  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favorites: Product[] = await getFavoriteProducts();
        setFavoriteIds(new Set(favorites.map(p => Number(p.id))));
      } catch (e) {
        console.error("Failed to fetch favorites", e);
      }
    };
    fetchFavorites();
  }, []);

  // Calculate min/max prices from currently matching products for color styling
  const validPrices = matchingProducts
    .map(p => p.price)
    .filter((p): p is number => p !== undefined);
  const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
  const maxPrice = validPrices.length > 0 ? Math.max(...validPrices) : 0;

  // Determine the max value for the price slider
  const sliderMax = currentFilteredMaxPrice;

  // Determine if the roast filter should be shown
  const showRoastFilter = uniqueRoastDegrees && uniqueRoastDegrees.length > 1;

  
  return (
    // Main layout container
    <div className="bg-blue-900 text-start lg:py-8 flex-grow grid-bg-dot h-full flex flex-col">

      {/* Filter controls */}
      <ProductFilterControls
        {...contextValues}
        sliderMax={sliderMax}
        showRoastFilter={showRoastFilter}
        productCount={matchingProducts.length}
        handleCloseProductsView={
          hideCloseButton ? undefined : contextValues.handleCloseProductsView
        }
        hideControls={hideFilters}
      />

      {/* Product grid */}
      <ProductGrid
        loadingProducts={contextValues.loadingProducts}
        productError={contextValues.productError}
        matchingProducts={matchingProducts}
        totalFetchedCount={contextValues.totalFetchedCount}
        isFilterInverted={contextValues.isFilterInverted}
        minPrice={minPrice}
        maxPrice={maxPrice}
        favoriteIds={favoriteIds}
      />

    </div>
  );
}
