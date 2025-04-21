import React from 'react';
import { Button } from "@/components/button";
import { Slider } from "@/components/slider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import type { AvailabilityFilter } from '../types/types';
import type { ProductSearchContextType } from '@/context/ProductSearchContext';


interface ProductFilterControlsProps extends Omit<ProductSearchContextType, 'matchingProducts' | 'productError' | 'totalFetchedCount' | 'currentFilteredMaxPrice' | 'handleCloseProductsView'> {
  sliderMax: number;
  showRoastFilter: boolean;
  productCount: number;
  handleCloseProductsView?: () => void;
  hideControls?: boolean;
}

export default function ProductFilterControls({
  loadingProducts,
  handleCloseProductsView,
  maxPriceFilter,
  availabilityFilter,
  roastDegreeFilter,
  uniqueRoastDegrees,
  handleMaxPriceChange,
  handleAvailabilityChange,
  handleRoastDegreeChange,
  handleResetFilters,
  isFilterInverted,
  handleToggleInvertFilter,
  priceSortOrder,
  handlePriceSortToggle,
  sliderMax,
  showRoastFilter,
  productCount,
  hideControls,
}: ProductFilterControlsProps) {

  const handlePriceSliderChange = (value: number) => {
    handleMaxPriceChange(value);
  };

  const handleAvailabilityRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleAvailabilityChange(event.target.value as AvailabilityFilter);
  };

  // Sort button
  const getSortButtonContent = () => {
    switch (priceSortOrder) {
      case 'asc':
        return (
          <svg width="20" height="20" viewBox="0 0 14 14">
            <polygon points="7,3 11,9 3,9" fill="currentColor" />
          </svg>
        );
      case 'desc':
        return (
          <svg width="20" height="20" viewBox="0 0 14 14">
            <polygon points="3,5 11,5 7,11" fill="currentColor" />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 14 14">
            <rect x="3" y="6" width="8" height="2" fill="currentColor" />
          </svg>
        );
    }
  };


  return (
    // Sticky control panel
    <div className="sticky bg-white/50 max-w-[80.5rem] mx-auto top-0 flex flex-wrap items-center justify-between p-4 border-x-2 border-2 border-black border-b-1 sm:border-b-4 gap-4 z-10 w-full grid-bg-sm shadow-lightLg">

      {/* Row 1 */}
      {!hideControls ? (
        <>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 flex-grow pr-10">
            {/* Price */}
            <div className="flex items-center gap-4 text-sm text-gray-800">
              <Slider
                id="maxPriceSlider"
                min={0}
                max={sliderMax}
                step={sliderMax/12}
                value={[Math.min(maxPriceFilter, sliderMax)]}
                onValueChange={([val]) => handlePriceSliderChange(val)}
                disabled={loadingProducts}
                className="w-64"
                aria-label={`Filter products less than ${maxPriceFilter.toFixed(2)} dollars`}
              />
              <span className="font-semibold text-xs whitespace-nowrap p-2 bg-blue-600 text-white border-2 border-black">
                Less than ${maxPriceFilter.toFixed(2)}
              </span>
            </div>

            {/* Sort by price */}
            <div className="flex items-center gap-2 text-xs p-1 bg-blue-600 text-white border-2 border-black">
              <Button
                variant="reverse"
                size="icon"
                onClick={handlePriceSortToggle}
                disabled={loadingProducts || productCount === 0}
                className="text-xs border-black text-black bg-white flex-shrink-0 flex items-center"
                aria-label={`Sort by price ${priceSortOrder === 'asc' ? 'ascending' : priceSortOrder === 'desc' ? 'descending' : 'default'}`}
              >
                {getSortButtonContent()}
              </Button>
              <span className="font-semibold text-nowrap">Sort by price</span>
            </div>

            {/* Availability */}
            <fieldset className="flex items-center gap-x-4 gap-y-1 text-sm text-white font-semibold">
              <legend className="sr-only">Filter by availability</legend>
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
                <label htmlFor="roast-degree-select" className="font-semibold text-nowrap">Roast:</label>
                <Select
                  value={roastDegreeFilter}
                  onValueChange={handleRoastDegreeChange}
                  disabled={loadingProducts}
                >
                  <SelectTrigger id="roast-degree-select" className="h-9 text-xs border-2 border-black text-black">
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

            {/* Clear */}
            <Button
              variant="reverse"
              size="sm"
              onClick={handleResetFilters}
              className="text-xs border-black text-black hover:bg-red-500 disabled:opacity-50 flex-shrink-0"
              aria-label="Clear all filters"
              disabled={loadingProducts}
            >
              Clear Filters
            </Button>

            {/* Invert filter button */}
            <Button
              variant="reverse"
              size="sm"
              onClick={handleToggleInvertFilter}
              disabled={loadingProducts}
              className={`flex-shrink-0 text-xs text-white ${isFilterInverted ? "bg-emerald-500 hover:bg-emerald-600" : "bg-violet-500 hover:bg-violet-600"}`}
              aria-label={isFilterInverted ? "Show matching products" : "Show non-matching products"}
            >
              {isFilterInverted ? "Matches" : "Non-Matches"}
            </Button>
          </div>
        </>
      ) : (
        // Makes empty favorite bar bigger
        <div className="py-4"></div>
      )}

      {/* Close button */}
      {handleCloseProductsView && (
        <Button
          variant="reverse"
          size="icon"
          onClick={handleCloseProductsView}
          className="absolute bottom-4 right-2 sm:top-4 sm:right-4 bg-red-500 border-black text-black hover:bg-white"
          aria-label="Close product view"
        >
          <span className="text-xl font-semibold leading-none">&times;</span>
        </Button>
      )}

    </div>
  );
}
