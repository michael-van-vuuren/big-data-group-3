import { useMemo } from 'react';
import type { Product } from './types';
import { getPriceColorStyle } from './styleutils';
import Logo from '@/sections/logo';
import { getNoteColor } from '@/lib/colorutils';
import { toTitleCase, toCompressedForm } from '@/lib/stringutils';

import LazyProductCardWrapper from './LazyProductCardWrapper';
import { useProductSearchContext } from '@/context/ProductSearchContext';

interface ProductGridProps {
  loadingProducts: boolean;
  productError: string | null;
  matchingProducts: Product[];
  totalFetchedCount: number;
  isFilterInverted: boolean;
  minPrice: number;
  maxPrice: number;
  favoriteIds: Set<number>;
}

export default function ProductGrid({
  loadingProducts,
  productError,
  matchingProducts,
  totalFetchedCount,
  isFilterInverted,
  minPrice,
  maxPrice,
  favoriteIds,
}: ProductGridProps) {

  const { sortedFlavors, maxCount } = useMemo(() => {
    const counts = matchingProducts
      .flatMap((p) => (p.flavors || []).map((f) => f.name))
      .reduce<Record<string, number>>((acc, flavorName) => {
        acc[flavorName] = (acc[flavorName] || 0) + 1;
        return acc;
      }, {});
  
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const max = Math.max(0, ...Object.values(counts));
  
    return {
      sortedFlavors: sorted,
      maxCount: max,
    };
  }, [matchingProducts]);
  

  const {
      triggerProductSearch
    } = useProductSearchContext();

  return (
    <div className="bg-white max-w-7xl mx-auto text-start border-black border-x-2 border-b-2 w-full flex-grow overflow-y-auto shadow-lightLg">

      {/* --- Info Header --- */}
      {!loadingProducts && !productError && totalFetchedCount > 0 && (
        <div className="px-12 flex flex-col sm:flex-row items-start justify-start mt-10 mb-8 gap-6 flex-nowrap overflow-x-auto">
          <div className="flex flex-row">
            {/* Logo */}
            <Logo />

            {/* Count */}
            <div className="text-base text-black font-medium shrink-0 ml-4">
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

          {/* Flavor Histogram */}
          <div className="flex flex-col gap-2 mr-2 ml-auto h-52">
            <p className="text-base font-medium">Flavor Histogram</p>
            <div className="flex flex-col gap-2 bg-white p-2 border-2 border-black overflow-y-auto w-80">
              {sortedFlavors.map(([flavor, count]) => {
                const barWidthPercent = maxCount > 0 ? Math.max(1, (count / maxCount) * 100) : 1;

                const noteColor = getNoteColor(toTitleCase(flavor));

                return (
                  <div key={flavor} className="flex items-center gap-2">
                    <span
                      className="w-20 text-xs whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer"
                      title={flavor}
                      onClick={() => {
                        triggerProductSearch([flavor]);
                      }}
                    >
                      {toCompressedForm(flavor)}
                    </span>

                    <div className="flex-1 h-4 bg-gray-200">
                      <div
                        className="transition-all duration-100 ease-in-out py-1.5 border-black border-2 cursor-pointer hover:shadow-light hover:-translate-y-boxShadowY hover:-translate-x-boxShadowX active:shadow-none active:translate-y-boxShadowYSm active:translate-x-boxShadowXSm"
                        onClick={() => {
                          triggerProductSearch([flavor]);
                        }}
                        style={{
                          width: `${barWidthPercent}%`,
                          backgroundColor: noteColor,
                          minWidth: '2px',
                        }}
                      />
                    </div>

                    <span className="text-xs text-gray-700 shrink-0 w-8 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}

              {/* Handle case where there are no flavors */}
              {sortedFlavors.length === 0 && (
                <p className="text-xs text-gray-500 text-center">No flavor data available.</p>
              )}
            </div>
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
          {matchingProducts
            .map((product) => {
              const priceStyle = getPriceColorStyle(product.price, minPrice, maxPrice);
              const isFavorited = favoriteIds.has(Number(product.id));
              return (
                <LazyProductCardWrapper
                  key={product.id}
                  product={product}
                  priceStyle={priceStyle}
                  initiallyFavorited={isFavorited}
                />
              );
            })}
        </div>
      )}


    </div>
  );
}
