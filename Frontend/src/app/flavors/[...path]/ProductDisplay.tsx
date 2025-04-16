import React from 'react';
import { useProductSearchContext } from '@/context/ProductSearchContext';
import ProductFilterControls from './ProductFilterControls';
import ProductGrid from './ProductGrid';


export default function ProductDisplay() {
  const contextValues = useProductSearchContext();
  const {
    matchingProducts,
    currentFilteredMaxPrice,
    uniqueRoastDegrees,
  } = contextValues;


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
      />

    </div>
  );
}
