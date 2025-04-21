import { useState, useEffect } from 'react';
import type { Product } from '../types/types';
import { toTitleCase } from "@/lib/utils/stringutils";
import { toast } from "sonner";
import { favoritesApi } from '@/lib/api';

import { useProductSearchContext } from '@/context/ProductSearchContext';
import { useRouter, usePathname } from "next/navigation";
import { Button } from '@/components/button';
import ProductImage from './productImage';
import FlavorTags from './FlavorTags';
import { cn } from '@/lib/utils/utils';

import { RoasterSearchQuery, RoasterCountrySearchQuery } from '../types/types';
import { Separator } from '@/components/separator';
import { countryCodeMap } from '@/lib/utils/flagutil';

import { businessApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface ProductCardProps {
  product: Product;
  priceStyle: React.CSSProperties;
  initiallyFavorited?: boolean;
  onDelete?: (productId: number | string) => void;
}

export default function ProductCard({ product, priceStyle, initiallyFavorited, onDelete }: ProductCardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isFavorited, setIsFavorited] = useState(initiallyFavorited);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { handleUnfavorite } = useProductSearchContext();
  const [showSpecs, setShowSpecs] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    setIsFavorited(initiallyFavorited);
  }, [initiallyFavorited]);


  const handleDeleteClick = async () => {

    if (!window.confirm(`Are you sure you want to delete "${toTitleCase(product.name)}"?`)) return;

    // Make sure only the creator of a product can delete it
    if (product.roaster?.name == null) return;
    if (user?.name == null) return;
    if (product.roaster.name.toLowerCase() !== user.name.toLowerCase()) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const success = await businessApi.deleteProductById(product.id);

      if (success) {
        toast.success(`${toTitleCase(product.name)} deleted successfully.`, {
          description: `${toTitleCase(product.name)} is no longer accessible to users.`,
        });
        if (onDelete) onDelete(product.id);
      } else {
        setDeleteError("Failed to delete product. It might have already been removed.");
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error during product deletion:", error);
      setDeleteError("An error occurred while deleting the product. Please try again.");
      setIsDeleting(false);
    }
  };

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
        await favoritesApi.removeFavoriteProduct(productId);
        toast.success(`${toTitleCase(product.name)} removed from favorites.`, { id: toastId });
        handleUnfavorite?.(productId);
      } else {
        await favoritesApi.addFavoriteProduct(productId);
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
      p.countries?.map(p => toTitleCase(p.name)) ?? []
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
        "relative border-black border-2 border-b-8 h-full p-6 text-left flex flex-col justify-between items-center transition-transform will-change-transform",
        "scale-90",
        isFavorited
          ? "favorite-bg animate-bounce-y-three"
          : "bg-white"
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

      {/* Delete product (BUSINESS only) */}
      {user &&
        user.role === "BUSINESS" &&
        user.name.toLowerCase() === product.roaster?.name.toLowerCase() &&
        pathname.startsWith("/business") && (
          <>
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className={`absolute -top-12 px-8 py-1 text-sm border-black border-2 shadow-light ${isDeleting
                ? 'bg-slate-300 text-gray-700 cursor-not-allowed'
                : 'bg-red-500 hover:bg-white hover:text-black text-white transition-all'
                }`}
            >
              {isDeleting ? 'Deleting Product...' : 'Delete Product'}
            </button>

            {deleteError && (
              <p className="text-red-600 text-xs mt-2">{deleteError}</p>
            )}
          </>
        )}

      {/* --- Details section --- */}
      <div
        className={cn(
          "w-full flex-grow mb-3 mt-2",
          !isFavorited ? "text-black" : "text-white"
        )}
      >
        {/* Product name */}
        <h3
          className={`text-lg font-semibold mb-4 text-center border-y-2  p-2 ${isFavorited ? 'border-white border-solid border-y-[1px]' : 'border-black border-double text-ellipsis overflow-hidden'
            }`}
          title={toTitleCase(product?.name ?? "N/A")}
        >
          {toTitleCase(
            product?.name
              .replace(/【/g, " [").replace(/】/g, "] ")
              .replace(/-/g, "—").replace(/_/g, " ")
            ?? "N/A"
          )}
        </h3>
        {/* Product description */}
        <div className="space-y-2 text-xs font-medium">
          {/* Roaster */}
          {(roasterName || roasterCountryUpper) && (
            <div className="mt-2">
              <p className="font-semibold text-sm mb-0.5">Roaster</p>
              <div className="flex flex-nowrap items-stretch gap-2">
                {roasterName && (
                  <span
                    onClick={() => handleRoasterClick(roasterName)}
                    className={`border-dashed transition-all duration-100 ease-in-out py-2 px-2 text-xs border-[1px] font-semibold cursor-pointer flex-grow whitespace-nowrap overflow-hidden text-ellipsis hover:shadow-light hover:-translate-y-boxShadowY hover:-translate-x-boxShadowX active:shadow-none active:translate-y-boxShadowYSm active:translate-x-boxShadowXSm hover:border-solid ${isFavorited
                      ? 'bg-slate-900 text-white border-white'
                      : 'bg-white text-black border-black'
                      }`}
                  >
                    {roasterName}
                  </span>
                )}
                {roasterCountryUpper && countryCodeMap[roasterCountryUpper.toLowerCase()] && (
                  <span
                    onClick={() => handleRoasterCountryClick(roasterCountryUpper)}
                    className={`border-dashed transition-all duration-100 ease-in-out px-1 text-xs border-[1px] font-semibold cursor-pointer flex items-center gap-2 shrink-0 max-w-[40%] overflow-hidden text-ellipsis whitespace-nowrap hover:shadow-light hover:-translate-y-boxShadowY hover:-translate-x-boxShadowX active:shadow-none active:translate-y-boxShadowYSm active:translate-x-boxShadowXSm hover:border-solid ${isFavorited
                      ? 'bg-slate-900 text-white border-white'
                      : 'bg-white text-black border-black'
                      }`}
                  >
                    {
                      roasterCountryUpper.length > 3
                        ? roasterCountryUpper === "UNITED KINGDOM"
                          ? "UK"
                          : toTitleCase(roasterCountryUpper.toLowerCase())
                        : roasterCountryUpper
                    }
                    <span
                      style={{ width: '22px', height: '17px' }}
                      className={`border-[1px] border-black shadow-lightSm h-fit fi fi-${countryCodeMap[roasterCountryUpper.toLowerCase()]}`}
                    ></span>
                  </span>
                )}
              </div>
            </div>
          )}



          {/* Origin and process */}
          {(producerNames || originCountries || originRegions || producerElevation || processName) && (
            <div className="flex gap-4 items-start">
              <div>
                <p className="font-semibold text-sm pt-1 mb-0.5">Origin & Process</p>
                <div className="pl-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-xs">
                  {producerNames && (
                    <>
                      <p className="font-medium">Producer:</p>
                      <p>{producerNames}</p>
                    </>
                  )}
                  {originCountries && (
                    <>
                      <p className="font-medium">Countries:</p>
                      <p>{originCountries}</p>
                    </>
                  )}
                  {originRegions && (
                    <>
                      <p className="font-medium">Regions:</p>
                      <p>{originRegions}</p>
                    </>
                  )}
                  {producerElevation && (
                    <>
                      <p className="font-medium">Elevation:</p>
                      <p>{String(producerElevation).replace(/,/g, '')}</p>
                    </>
                  )}
                  {processName && (
                    <>
                      <p className="font-medium">Process:</p>
                      <p>{processName}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}


          <Separator />

          <FlavorTags product={product} />

          {/* Specifications (expandable) */}
          <div className="pt-2">
            <button
              onClick={() => setShowSpecs((prev) => !prev)}
              className="font-semibold text-sm mb-0.5 underline underline-offset-2 hover:text-pink-400 transition-colors"
            >
              {showSpecs ? 'Hide Specifications' : 'Show Specifications'}
            </button>

            {showSpecs && (
              <div className="pl-3 mt-1 grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-xs animate-fade-in">
                <p className="font-medium">Roast:</p><p>{toTitleCase(product?.roastDegree ?? "N/A")}</p>
                {product?.gram != null && <> <p className="font-medium">Weight:</p> <p>{product.gram.toFixed(0)} g</p> </>}
                {product?.pricePerCup != null && <> <p className="font-medium">Price/Cup:</p> <p>${product.pricePerCup.toFixed(2)}</p> </>}
                {product?.bulkPricePerCup != null && <> <p className="font-medium">Bulk/Cup:</p> <p>${product.bulkPricePerCup.toFixed(2)}</p> </>}
                <p className="font-medium">Available:</p><p>{toTitleCase(product?.availability ?? "N/A")}</p>
              </div>
            )}
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
