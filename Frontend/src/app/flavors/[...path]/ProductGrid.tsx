import React from 'react';
import type { Product } from './types';
import { getPriceColorStyle } from './styleutils';
import Logo from '@/sections/logo';

import LazyProductCardWrapper from './LazyProductCardWrapper';

interface ProductGridProps {
  loadingProducts: boolean;
  productError: string | null;
  matchingProducts: Product[];
  totalFetchedCount: number;
  isFilterInverted: boolean;
  minPrice: number;
  maxPrice: number;
}

export default function ProductGrid({
  loadingProducts,
  productError,
  matchingProducts,
  totalFetchedCount,
  isFilterInverted,
  minPrice,
  maxPrice,
}: ProductGridProps) {

  return (
    <div className="bg-white max-w-7xl mx-auto text-start border-black border-x-2 border-b-2 w-full flex-grow overflow-y-auto shadow-lightLg">

      {/* --- Info Header --- */}
      {!loadingProducts && !productError && totalFetchedCount > 0 && (
        <div className="px-12 flex flex-row items-start justify-start mt-10 mb-16 gap-6 flex-nowrap overflow-x-auto">
          {/* Logo */}
          <Logo />

          {/* Count */}
          <div className="text-base text-black font-medium shrink-0">
            <p className="mb-2">Viewing</p>
            <p className="p-1 bg-blue-600 border-black border-2 border-b-0 font-bold text-white">{`${matchingProducts.length} / ${totalFetchedCount}`}</p>
            {isFilterInverted ? (
              <p className="p-1 bg-violet-500 text-white border-black border-2">non-matching</p>
            ) : (
              <p className="p-1 bg-emerald-500 text-white border-black border-2">matching</p>
            )}
            <p className="mt-2">products:</p>
          </div>
        </div>
      )}

      {/* --- Loading State --- */}
      {loadingProducts && <p className="text-center text-lg text-gray-500 py-10">Loading products...</p>}

      {/* --- Error State --- */}
      {productError && !loadingProducts && (
        <div className="text-center p-4 my-6 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-semibold">Error:</p>
          <p>{productError}</p>
        </div>
      )}

      {/* --- Empty State --- */}
      {!loadingProducts && !productError && matchingProducts.length === 0 && (
        <p className="text-center text-gray-500 text-lg mt-10">
          No {isFilterInverted ? 'excluded' : 'matching'} products found.
          {totalFetchedCount > 0 ? ` Try adjusting${isFilterInverted ? ' or resetting' : ''} the filters.` : " Try selecting a different category."}
        </p>
      )}

      {/* --- Product Grid Display --- */}
      {!loadingProducts && !productError && matchingProducts.length > 0 && (
        <div className="bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12 border-t-2 border-black pt-8 px-8 pb-16 grid-bg-dark">
          {matchingProducts.map(product => {
            const priceStyle = getPriceColorStyle(product.price, minPrice, maxPrice);
            return (
              <LazyProductCardWrapper
                key={product.id}
                product={product}
                priceStyle={priceStyle}
              />
            );
          })}
        </div>
      )}

    </div>
  );
}
