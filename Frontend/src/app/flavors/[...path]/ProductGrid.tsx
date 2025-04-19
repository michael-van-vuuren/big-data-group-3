import { useState, useMemo } from 'react';
import type { Product } from './types';
import { getPriceColorStyle } from './styleutils';
import Logo from '@/sections/logo';
import { getNoteColor } from '@/lib/colorutils';
import { toTitleCase, toCompressedForm } from '@/lib/stringutils';

import LazyProductCardWrapper from './LazyProductCardWrapper';
import { useProductSearchContext } from '@/context/ProductSearchContext';
import { FlavorSearchQuery } from '@/context/ProductSearchContext';
import { RoasterCountrySearchQuery } from '@/context/ProductSearchContext';
import { countryCodeMap } from '@/lib/flagutil';

import { Orbit } from 'lucide-react';
import { cn } from '@/lib/utils';

type HistogramTab = 'flavor' | 'country';

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
  const [activeHistogramTab, setActiveHistogramTab] = useState<HistogramTab>('flavor');

  // Calculate flavor histogram
  const { sortedFlavors, maxFlavorCount } = useMemo(() => {
    if (activeHistogramTab !== 'flavor') {
      return { sortedFlavors: [], maxFlavorCount: 0 };
    }

    console.log("Calculating Flavor Histogram");
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
      maxFlavorCount: max,
    };
  }, [matchingProducts, activeHistogramTab]);

  // Calculate roaster country histogram
  const { sortedRoasterCountries, maxRoasterCountryCount } = useMemo(() => {
    if (activeHistogramTab !== 'country') {
      return { sortedRoasterCountries: [], maxRoasterCountryCount: 0 };
    }

    console.log("Calculating Country Histogram");
    const counts = matchingProducts
      .map((p) => p.roaster?.country?.name)
      .filter((countryName): countryName is string => !!countryName)
      .reduce<Record<string, number>>((acc, countryName) => {
        const lowerCaseCountry = countryName.toLowerCase();
        acc[lowerCaseCountry] = (acc[lowerCaseCountry] || 0) + 1;
        return acc;
      }, {});

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const max = Math.max(0, ...Object.values(counts));

    return {
      sortedRoasterCountries: sorted,
      maxRoasterCountryCount: max,
    };
  }, [matchingProducts, activeHistogramTab]);


  // Clickable histogram handlers
  const {
    triggerProductSearch
  } = useProductSearchContext();

  const handleFlavorClick = (flavorName: string) => {
    // Build flavor query
    const query: FlavorSearchQuery = {
      type: 'flavor',
      values: [flavorName],
      strict: false
    };
    triggerProductSearch(query);
  };

  const handleRoasterCountryClick = (countryName: string) => {
    const query: RoasterCountrySearchQuery = {
      type: 'roaster-country',
      value: countryName
    };
    triggerProductSearch(query);
  };


  return (
    <div className="bg-white max-w-7xl mx-auto text-start border-black border-x-2 border-b-2 w-full flex-grow overflow-y-auto shadow-lightLg">

      {/* --- Top info part --- */}
      {!loadingProducts && !productError && totalFetchedCount > 0 && (
        <div className="px-12 flex flex-col sm:flex-row items-start justify-start mt-10 mb-8 gap-6 flex-nowrap">
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


          {/* --- Tabs --- */}
          <div className="flex flex-col mr-2 ml-auto h-56 shrink-0 w-80">
            <div className="flex border-b-2 border-black">
              <button
                onClick={() => setActiveHistogramTab('flavor')}
                className={cn(
                  "flex-1 py-1.5 px-2 text-xs font-normal border-black border-t-2 border-l-2",
                  activeHistogramTab === 'flavor'
                    ? 'bg-darkerBlue text-white'
                    : 'bg-slate-400 text-white hover:bg-gray-300'
                )}
              >
                Flavors
              </button>
              <button
                onClick={() => setActiveHistogramTab('country')}
                className={cn(
                  "flex-1 py-1.5 px-2 text-xs font-normal border-black border-t-2 border-l-2 border-r-2",
                  activeHistogramTab === 'country'
                    ? 'bg-darkerBlue text-white'
                    : 'bg-slate-400 text-white hover:bg-gray-300'
                )}
              >
                Countries
              </button>
            </div>

            {/* --- Histograms --- */}
            <div className="flex flex-col gap-2 bg-white px-3 py-4 border-l-2 border-r-2 border-b-2 border-black overflow-y-auto flex-grow">

              {/* --- Flavor histogram --- */}
              {activeHistogramTab === 'flavor' && (
                <>
                  {sortedFlavors.map(([flavor, count]) => {
                    const barWidthPercent = maxFlavorCount > 0 ? Math.max(1, (count / maxFlavorCount) * 100) : 1;
                    const noteColor = getNoteColor(toTitleCase(flavor));

                    return (
                      <div key={flavor} className="flex items-center">
                        <span
                          className="w-20 pl-1 text-xs pb-[1px] whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer hover:bg-black hover:text-white mr-1"
                          title={toTitleCase(flavor)}
                          onClick={() => handleFlavorClick(flavor)}
                        >
                          {toTitleCase(toCompressedForm(flavor))}
                        </span>

                        <div className="flex-1 h-[17px] bg-gray-200">
                          <div
                            className="transition-all duration-100 ease-in-out pb-[13px] border-black border-2 cursor-pointer hover:shadow-light hover:-translate-y-boxShadowY hover:-translate-x-boxShadowX active:shadow-none active:translate-y-boxShadowYSm active:translate-x-boxShadowXSm"
                            onClick={() => handleFlavorClick(flavor)}
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
                  {sortedFlavors.length === 0 && (
                    <p className="text-xs text-gray-500 text-center">No flavor data available.</p>
                  )}
                </>
              )}

              {/* --- Roaster country histogram --- */}
              {activeHistogramTab === 'country' && (
                <>
                  {sortedRoasterCountries.map(([country, count]) => {
                    const barWidthPercent = maxRoasterCountryCount > 0 ? Math.max(1, (count / maxRoasterCountryCount) * 100) : 1;
                    const countryCode = countryCodeMap[country.toLowerCase()];
                    const barColor = '#f8b';

                    return (
                      <div key={country} className="flex items-center">
                        <div
                          className="w-20 flex items-center gap-1.5 text-xs whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer hover:bg-black hover:text-white mr-1"
                          title={toTitleCase(country)}
                          onClick={() => handleRoasterCountryClick(country)}
                        >
                          {countryCode ? (
                            <span
                              style={{ width: '22px', height: '17px' }}
                              className={`border-[1px] border-black shadow-lightSm h-fit fi fi-${countryCode} shrink-0`}
                            ></span>
                          ) : (
                            <span className="w-[22px] h-[17px] border border-dashed border-gray-400 shrink-0"></span>
                          )}
                          <span className="overflow-hidden text-ellipsis">
                            {
                              country.length > 3
                                ? country === "united kingdom"
                                  ? "UK"
                                  : toTitleCase(country.toLowerCase())
                                : country.toUpperCase()
                            }
                          </span>
                        </div>

                        <div className="flex-1 h-[17px] bg-gray-200">
                          <div
                            className="transition-all duration-100 ease-in-out pb-[13px] border-black border-2 cursor-pointer hover:shadow-light hover:-translate-y-boxShadowY hover:-translate-x-boxShadowX active:shadow-none active:translate-y-boxShadowYSm active:translate-x-boxShadowXSm"
                            onClick={() => handleRoasterCountryClick(country)}
                            style={{
                              width: `${barWidthPercent}%`,
                              backgroundColor: barColor,
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
                  {sortedRoasterCountries.length === 0 && (
                    <p className="text-xs text-gray-500 text-center">No roaster country data available.</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- Loading State --- */}
      {loadingProducts && (
        <div className="flex items-center justify-center h-full grid-bg-dark overflow-hidden">
          <Orbit
            strokeWidth={1.0}
            style={{ stroke: "#475773" }}
            className="w-24 h-24 animate-spin-slow"
          />

        </div>
      )}


      {/* --- Error State --- */}
      {productError && !loadingProducts && (
        <div className="text-center p-4 my-6 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-semibold">Error:</p>
          <p>{productError}</p>
        </div>
      )}

      {/* --- Empty State --- */}
      {!loadingProducts && !productError && matchingProducts.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-center text-gray-500 text-lg">
            No {isFilterInverted ? 'excluded' : 'matching'} products found.
            {totalFetchedCount > 0 ? ` Try adjusting${isFilterInverted ? ' or resetting' : ''} the filters.` : " Try selecting a different category."}
          </p>
        </div>
      )}

      {/* --- Product Grid Display --- */}
      {!loadingProducts && !productError && matchingProducts.length > 0 && (
        <div className="bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-0 border-t-2 border-black pt-8 px-8 pb-16 grid-bg-dark">
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
