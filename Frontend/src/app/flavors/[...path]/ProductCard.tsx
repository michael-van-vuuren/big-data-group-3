import { useState, useEffect } from 'react';
import type { Product } from "./types";
import { toTitleCase } from "@/lib/stringutils";
import { toast } from "sonner";
import { addFavoriteProduct, removeFavoriteProduct } from '@/lib/apiClient';

import { useProductSearchContext } from '@/context/ProductSearchContext';
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import ProductImage from './productImage';
import FlavorTags from './FlavorTags';
import { cn } from '@/lib/utils';

import { RoasterSearchQuery, RoasterCountrySearchQuery } from '@/context/ProductSearchContext';

interface ProductCardProps {
  product: Product;
  priceStyle: React.CSSProperties;
  initiallyFavorited?: boolean;
}

export default function ProductCard({ product, priceStyle, initiallyFavorited }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(initiallyFavorited);
  const router = useRouter();
  const { handleUnfavorite } = useProductSearchContext();

  useEffect(() => {
    setIsFavorited(initiallyFavorited);
  }, [initiallyFavorited]);

  const handleFavoriteToggle = async () => {

    const productId = Number(product.id);

    if (isNaN(productId)) {
      console.error("Invalid product ID:", product.id);
      toast.error("Action failed due to invalid product ID.");
      return;
    }

    const toastId = toast.loading(`${isFavorited ? 'Removing' : 'Adding'} ${toTitleCase(product.name)} ${isFavorited ? 'from' : 'to'} favorites...`);
    try {
      if (isFavorited) {
        await removeFavoriteProduct(productId);
        toast.success(`${toTitleCase(product.name)} removed from favorites.`, { id: toastId });
        handleUnfavorite?.(productId);
      } else {
        await addFavoriteProduct(productId);
        toast.success(`${toTitleCase(product.name)} added!`, {
          id: toastId,
          description: "Visit the account tab to view your favorites.",
          action: {
            label: "Favorites",
            onClick: () => router.push("/account/favorites"),
          }
        });
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error("Favorite toggle failed:", error);
      toast.error(`Failed to ${isFavorited ? 'remove' : 'add'} ${toTitleCase(product.name)}.`, {
        id: toastId,
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    }
  };

  const producerNames = product.producers && product.producers.length > 0
    ? Array.from(new Set(product.producers
      .map(p => toTitleCase(p.name))
      .filter(name => name && name.trim() !== '' && name !== 'N/A' && name !== '-')))
      .join(', ')
    : null;

  const getUniqueCountries = (): string | null => {
    if (!product.producers || product.producers.length === 0) return null;
    const names = product.producers.flatMap(p =>
      p.countries?.map(c => c.name?.toUpperCase()) ?? []
    );

    const validNames = names.filter((name): name is string => {

      return typeof name === 'string' && name.trim() !== '' && name !== 'N/A';
    });
    const uniqueNames = Array.from(new Set(validNames));
    return uniqueNames.length > 0 ? uniqueNames.join(', ') : null;
  };
  const originCountries = getUniqueCountries();

  const getUniqueRegions = (): string | null => {
    if (!product.producers || product.producers.length === 0) return null;
    const names = product.producers.flatMap(p =>
      p.regions?.map(r => toTitleCase(r.name)) ?? []
    );
    const validNames = names.filter(name => name && name.trim() !== '' && name !== 'N/A');
    const uniqueNames = Array.from(new Set(validNames));
    return uniqueNames.length > 0 ? uniqueNames.join(', ') : null;
  };
  const originRegions = getUniqueRegions();

  const firstProducerElevation = product.producers?.[0]?.elevation;
  const producerElevation = firstProducerElevation && String(firstProducerElevation).trim() !== ''
    ? `${firstProducerElevation} masl`
    : null;

  const roasterCountryUpper = product.roaster?.country?.name?.toUpperCase();


  const calculatedRoasterName = toTitleCase(product.roaster?.name || '');
  const roasterName = calculatedRoasterName !== '' ? calculatedRoasterName : null;

  const calculatedProcessName = toTitleCase(product.process?.name || '');
  const processName = calculatedProcessName !== '' ? calculatedProcessName : null;

  const {
    triggerProductSearch
  } = useProductSearchContext();

  const handleRoasterClick = (roasterName: string) => {
    // Build roaster name query
    const query: RoasterSearchQuery = {
      type: 'roaster',
      value: roasterName
    };
    triggerProductSearch(query);
  };

  const handleRoasterCountryClick = (roasterCountry: string) => {
    // Build roaster country query
    const query: RoasterCountrySearchQuery = {
      type: 'roaster-country',
      value: roasterCountry
    };
    triggerProductSearch(query);
  };

  return (
    <div
      key={product.id}
      className={cn(
        "relative border-black border-2 border-b-8 h-full p-6 text-left flex flex-col justify-between items-center",
        !isFavorited ? "bg-white" : "favorite-bg"
      )}
    >
      {/* --- Favorite button, price, image, flavors --- */}
      <Button
        onClick={handleFavoriteToggle}
        variant="heart"
        className="absolute left-1 top-3"
        isFavorited={isFavorited}
      />
      {product.price !== undefined && (
        <div
          className="absolute top-5 right-4 border-black border-2 text-sm font-bold px-1 py-1 z-10"
          style={priceStyle}
        >
          ${product.price.toFixed(2)}
        </div>
      )}
      <ProductImage src={product.image} alt={toTitleCase(product?.name ?? "N/A")} isFavorited={isFavorited} />
      <FlavorTags product={product} />

      {/* --- Details section --- */}
      <div
        className={cn(
          "w-full flex-grow mb-3 mt-2",
          !isFavorited ? "text-black" : "text-white"
        )}
      >
        {/* Product name */}
        <h3 className="text-lg font-semibold mb-2 line-clamp-2" title={toTitleCase(product?.name ?? "N/A")}>
          {toTitleCase(product?.name ?? "N/A")}
        </h3>
        {/* Product description */}
        <div className="space-y-2 text-xs font-medium">
          {/* Roaster */}
          {(roasterName || roasterCountryUpper) && (
            <div className="mt-2">
              <p className="font-semibold text-sm mb-0.5">Roaster</p>
              <div className="flex flex-wrap flex-row pl-3">
                {roasterName && (
                  <span
                    onClick={() => handleRoasterClick(roasterName)}
                    className="transition-all duration-100 ease-in-out py-1 px-2 m-0.5 text-xs border-black border-2 font-semibold cursor-pointer flex-grow bg-blue-600 text-white hover:shadow-light hover:-translate-y-boxShadowY hover:-translate-x-boxShadowX active:shadow-none active:translate-y-boxShadowYSm active:translate-x-boxShadowXSm"
                  >
                    {roasterName}
                  </span>
                )}
                {roasterCountryUpper && (
                  <span
                    onClick={() => handleRoasterCountryClick(roasterCountryUpper)}
                    className="transition-all duration-100 ease-in-out py-1 px-2 m-0.5 text-xs border-black border-2 font-semibold cursor-pointer flex-grow bg-pink-400 text-white hover:shadow-light hover:-translate-y-boxShadowY hover:-translate-x-boxShadowX active:shadow-none active:translate-y-boxShadowYSm active:translate-x-boxShadowXSm"
                  >
                    {roasterCountryUpper}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Origin and process */}
          {(producerNames || originCountries || originRegions || producerElevation || processName) && (
            <div>
              <p className="font-semibold text-sm mb-0.5">Origin & Process</p>
              <div className="pl-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-xs">
                {producerNames && <> <p className="font-medium">Producer:</p> <p>{producerNames}</p> </>}
                {originCountries && <> <p className="font-medium">Country:</p> <p>{originCountries}</p> </>}
                {originRegions && <> <p className="font-medium">Region:</p> <p>{originRegions}</p> </>}
                {producerElevation && <> <p className="font-medium">Elevation:</p> <p>{producerElevation}</p> </>}
                {processName && <> <p className="font-medium">Process:</p> <p>{processName}</p> </>}
              </div>
            </div>
          )}
          {/* Specifications */}
          <div>
            <p className="font-semibold text-sm mb-0.5">Specifications</p>
            <div className="pl-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-xs">
              <p className="font-medium">Roast:</p><p>{toTitleCase(product?.roastDegree ?? "N/A")}</p>
              {product?.gram != null && <> <p className="font-medium">Weight:</p> <p>{product.gram.toFixed(0)} g</p> </>}
              {product?.pricePerCup != null && <> <p className="font-medium">Price/Cup:</p> <p>${product.pricePerCup.toFixed(2)}</p> </>}
              {product?.bulkPricePerCup != null && <> <p className="font-medium">Bulk/Cup:</p> <p>${product.bulkPricePerCup.toFixed(2)}</p> </>}
              <p className="font-medium">Available:</p><p>{toTitleCase(product?.availability ?? "N/A")}</p>
            </div>
          </div>
        </div>
      </div>
      {/* --- View button --- */}
      <a
        href={product.webpage}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full text-sm font-medium text-center border-2 border-black py-2 px-4 mt-auto
          ${!product.webpage
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : isFavorited
              ? "bg-slate-900 text-white hover:bg-violet-800/50 border-white"
              : "bg-white text-black hover:bg-emerald-800/70 hover:text-white"
          }`}
        onClick={e => !product.webpage && e.preventDefault()}
        aria-disabled={!product.webpage}
      >
        {product.webpage ? "View Product →" : "Link Unavailable"}
      </a>
    </div>
  );
}
