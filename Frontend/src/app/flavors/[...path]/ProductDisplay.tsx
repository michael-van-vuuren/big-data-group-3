import React from "react";
import { Button } from "@/components/ui/button";
import type { Product, AvailabilityFilter } from "./types";
import { toTitleCase } from "@/lib/stringutils";
import { Slider } from "@/components/ui/slider";
import { useProductSearchContext } from '@/context/ProductSearchContext';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Logo from "@/sections/logo";

const DEFAULT_MAX_PRICE_SLIDER = 100;

// Product display component
export default function ProductDisplay() {
  const {
    loadingProducts,
    matchingProducts,
    productError,
    handleCloseProductsView,
    maxPriceFilter,
    availabilityFilter,
    roastDegreeFilter,
    currentFilteredMaxPrice,
    uniqueRoastDegrees,
    handleMaxPriceChange,
    handleAvailabilityChange,
    handleRoastDegreeChange,
    handleResetFilters,
    totalFetchedCount,
    isFilterInverted,
    handleToggleInvertFilter: handleToggleInvertFilter
  } = useProductSearchContext();

  const handlePriceSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleMaxPriceChange(Number(event.target.value));
  };

  const handleAvailabilityRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleAvailabilityChange(event.target.value as AvailabilityFilter);
  };

  const sliderMax = currentFilteredMaxPrice > 0 ? currentFilteredMaxPrice : DEFAULT_MAX_PRICE_SLIDER;
  const showRoastFilter = uniqueRoastDegrees && uniqueRoastDegrees.length > 1;

  return (
    <div className="bg-blue-900 text-start lg:py-8 flex-grow grid-bg-dot h-full flex flex-col">

      {/* --- Begin sticky header --- */}
      <div className="sticky bg-white/50 max-w-6xl mx-auto top-0 flex flex-wrap items-center justify-between p-4 border-x-2 border-2 border-black gap-4 z-10 w-full grid-bg-sm shadow-lightLg">

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 flex-grow pr-20">

          {/* Price */}
          <div className="flex items-center gap-2 text-sm text-white">
            <Slider
              id="maxPriceSlider"
              min={0}
              max={sliderMax}
              step={0.25}
              value={[Math.min(maxPriceFilter, sliderMax)]}
              onValueChange={([val]) =>
                handlePriceSliderChange({ target: { value: String(val) } } as React.ChangeEvent<HTMLInputElement>)
              }
              disabled={loadingProducts}
              className="w-80"
            />

            <span className="font-semibold">
              Less than ${maxPriceFilter.toFixed(2)}
            </span>
          </div>

          {/* Availability */}
          <fieldset className="flex items-center gap-x-4 gap-y-1 text-sm text-white font-semibold">
            {(["All", "Available", "Unavailable"] as AvailabilityFilter[]).map(option => (
              <div key={option} className="flex items-center gap-1">
                <input
                  type="radio"
                  id={`availability-${option}`}
                  name="availabilityFilter"
                  value={option}
                  checked={availabilityFilter === option}
                  onChange={handleAvailabilityRadioChange}
                  className={`
                    appearance-none w-4 h-4 border-2 border-white 
                    checked:bg-pink-400 checked:border-black 
                    cursor-pointer
                  `}
                  disabled={loadingProducts}
                />
                <label htmlFor={`availability-${option}`} className="cursor-pointer whitespace-nowrap">
                  {option}
                </label>
              </div>
            ))}
          </fieldset>

          {/* Roast degree */}
          {showRoastFilter && (
            <div className="flex items-center gap-2 text-sm text-white">
              <span className="font-semibold text-nowrap">Roast Degree:</span>
              <Select
                value={roastDegreeFilter}
                onValueChange={handleRoastDegreeChange}
                disabled={loadingProducts}
              >
                <SelectTrigger className="h-9 text-xs border-2 border-black text-black">
                  <SelectValue placeholder="Select Roast..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {uniqueRoastDegrees.map(degree => (
                      <SelectItem key={degree} value={degree}>
                        {degree}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Clear */}
        <div className="flex w-full gap-2 justify-start">
          <Button
            variant="reverse"
            size="sm"
            onClick={handleResetFilters}
            className="text-xs border-black text-black hover:bg-red-500 disabled:opacity-50 flex-shrink-0"
            aria-label="Clear filters"
            disabled={loadingProducts}
          >
            Clear Filters
          </Button>

          {/* --- Invert filter button --- */}
          <Button
            variant="reverse"
            size="sm"
            onClick={handleToggleInvertFilter}
            disabled={loadingProducts}
            className={`flex-shrink-0 text-xs text-white ${isFilterInverted ? "bg-emerald-500" : "bg-violet-500"}`}
            aria-label={isFilterInverted ? "Show matching products" : "Show non-matching products"}
          >
            {isFilterInverted ? "Show Matches" : "Show Non-Matches"}
          </Button>
        </div>

        {/* X button */}
        <Button
          variant="reverse"
          size="icon"
          onClick={handleCloseProductsView}
          className="absolute top-4 right-6 bg-red-500 border-black text-black hover:bg-white"
          aria-label="Close product view"
        >
          <span className="text-xl font-semibold leading-none">&times;</span>
        </Button>



      </div>
      {/* --- End sticky header --- */}



      {/* --- Begin products --- */}
      <div className="bg-white max-w-6xl mx-auto text-start px-8 pb-16 border-black border-x-2 border-b-2 w-full flex-grow overflow-y-auto shadow-lightLg">
        {!loadingProducts && !productError && totalFetchedCount > 0 && (
          <div className="flex flex-row items-start justify-start px-4 mt-10 mb-16 gap-6 flex-nowrap overflow-x-auto">
            {/* Heading */}
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



        {loadingProducts && <p className="text-center text-lg text-gray-500 py-10">Loading products...</p>}

        {productError && !loadingProducts && (
          <div className="text-center p-4 my-6 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-semibold">Error:</p>
            <p>{productError}</p>
          </div>
        )}
        {!loadingProducts && !productError && matchingProducts.length === 0 && (
          <p className="text-center text-gray-500 text-lg mt-10">
            No {isFilterInverted ? 'excluded' : 'matching'} products found.
            {totalFetchedCount > 0 ? ` Try adjusting${isFilterInverted ? ' or resetting' : ''} the filters.` : " Try selecting a different category."}
          </p>
        )}
        {!loadingProducts && !productError && matchingProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

            {/* Product mapping */}
            {matchingProducts.map(product => (
              <div
                key={product.beanId}
                className="bg-white p-4 text-left flex flex-col justify-between items-center"
              >
                {/* Image */}
                {product.image ? (
                  <img
                    src={product.image}
                    alt={toTitleCase(product.name)}
                    className="w-full h-44 object-contain p-2 border-2 border-black mb-3 bg-white"
                  />
                ) : (
                  <div className="w-full h-44 border-2 border-black bg-slate-100 mb-3 flex items-center justify-center text-gray-400 text-sm">
                    No Image Available
                  </div>
                )}
                {/* Details */}
                <div className="w-full flex-grow mb-3">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2" title={toTitleCase(product.name)}>{toTitleCase(product.name)}</h3>
                  <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs text-gray-600">
                    <p className="font-semibold text-gray-700">Roast:</p>
                    <p>{toTitleCase(product.roastDegree || "N/A")}</p>
                    {product.price !== undefined && (
                      <>
                        <p className="font-semibold text-gray-700">Price:</p>
                        <p>${product.price.toFixed(2)}</p>
                      </>
                    )}
                    <p className="font-semibold text-gray-700">Status:</p>
                    <p>{product.availability || "N/A"}</p>
                    {product.flavors && product.flavors.length > 0 && (
                      <>
                        <p className="font-semibold text-gray-700 self-start">Flavors:</p>
                        <p className="line-clamp-2">{product.flavors.map(f => f.name).join(", ")}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* View button */}
                <a
                  href={product.webpage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full text-sm font-medium text-center border-2 border-black py-2 px-4 mt-auto ${!product.webpage
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white text-black hover:bg-emerald-500 hover:text-white"
                    }`}
                  onClick={e => !product.webpage && e.preventDefault()}
                  aria-disabled={!product.webpage}
                >
                  {product.webpage ? "View Product →" : "Link Unavailable"}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* --- End products --- */}

    </div>
  );
}
