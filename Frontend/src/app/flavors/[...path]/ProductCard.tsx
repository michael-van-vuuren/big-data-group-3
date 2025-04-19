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


interface ProductCardProps {
  product: Product;
  priceStyle: React.CSSProperties;
  initiallyFavorited?: boolean;
}



export default function ProductCard({ product, priceStyle, initiallyFavorited }: ProductCardProps) {

  const [isFavorited, setIsFavorited] = useState(initiallyFavorited);

  const router = useRouter();

  // For removal of card when viewing from favorites page
  const { handleUnfavorite } = useProductSearchContext();

  useEffect(() => {
    setIsFavorited(initiallyFavorited);
  }, [initiallyFavorited]);

  const handleFavoriteToggle = async () => {
    const toastId = toast.loading(`${isFavorited ? 'Removing' : 'Adding'} ${toTitleCase(product.name)} ${isFavorited ? 'from' : 'to'} favorites...`);
    try {
      if (isFavorited) {
        await removeFavoriteProduct(Number(product.id));
        toast.success(`${toTitleCase(product.name)} removed from favorites.`, { id: toastId });
        setIsFavorited(false);
        handleUnfavorite?.(Number(product.id));

      } else {
        await addFavoriteProduct(Number(product.id));
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

  return (
    <div
      key={product.id}
      className={cn(
        "relative border-black border-2 border-b-8 h-full p-6 text-left flex flex-col justify-between items-center",
        !isFavorited ? "bg-white" : "favorite-bg"
      )}
    >

      {/* Favorite (heart button) */}
      <Button
        onClick={handleFavoriteToggle}
        variant="heart"
        className="absolute left-1 top-3"
        isFavorited={isFavorited}
      />

      {/* Price sticker */}
      {product.price !== undefined && (
        <div
          className="absolute top-5 right-4 border-black border-2 text-sm font-bold px-1 py-1 z-10"
          style={priceStyle}
        >
          ${product.price.toFixed(2)}
        </div>
      )}

      {/* Image */}
      <ProductImage src={product.image} alt={toTitleCase(product.name)} isFavorited={isFavorited} />

      {/* Flavor tags */}
      <FlavorTags product={product} />

      {/* Details */}
      <div
        className={cn(
          "w-full flex-grow mb-3 mt-2 font-semibold",
          !isFavorited ? "text-black" : "text-white"
        )}
      >
        <h3 className="text-lg mb-2 line-clamp-2" title={toTitleCase(product?.name ?? "N/A")}>
          {toTitleCase(product?.name ?? "N/A")}
        </h3>

        <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-1.5 text-xs font-medium">
          <p>Roast:</p>
          <p>{toTitleCase(product?.roastDegree ?? "N/A")}</p>

          {product?.pricePerCup != null && (
            <>
              <p>Price Per Cup:</p>
              <p>${product.pricePerCup.toFixed(2)}</p>
            </>
          )}

          {product?.gram != null && (
            <>
              <p>Weight:</p>
              <p>{product.gram.toFixed(0)} g</p>
            </>
          )}

          <p>Available?</p>
          <p>{toTitleCase(product?.availability ?? "N/A")}</p>
        </div>
      </div>

      {/* View button */}
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
