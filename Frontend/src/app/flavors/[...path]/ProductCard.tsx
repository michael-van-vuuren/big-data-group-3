import React from 'react';
import type { Product } from "./types";
import ProductImage from "./ProductImage";
import { toTitleCase } from "@/lib/stringutils";
import FlavorTags from './FlavorTags';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { addFavoriteProduct } from '@/lib/apiClient';

interface ProductCardProps {
  product: Product;
  priceStyle: React.CSSProperties;
}



export default function ProductCard({ product, priceStyle }: ProductCardProps) {

  const handleFavorite = async (product: Product) => {
    const toastId = toast.loading(`Adding ${toTitleCase(product.name)} to favorites...`);

    try {
      // POST request
      await addFavoriteProduct(Number(product.id));

      toast.success(`${toTitleCase(product.name)} added!`, {
        id: toastId,
        description: "Visit the account tab to view your favorites.",
        action: {
          label: "Undo",
          // TODO: DELETE /user/favorites/:productId
          onClick: () => console.log("Undo action triggered for product:", product.id),
        },
      });
    } catch (error) {
      console.error("Failed to add favorite:", error);
      toast.error(`Failed to add ${toTitleCase(product.name)} to favorites.`, {
        id: toastId,
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    }
  }


  return (
    <div
      key={product.id}
      className="relative bg-white border-black border-2 border-b-8 h-full p-6 text-left flex flex-col justify-between items-center"
    >
      {/* Favorite (heart button) */}
      <Button
        onClick={() => handleFavorite(product)}
        variant="heart"
        className="absolute left-2 top-3"
      ></Button>

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
      <ProductImage src={product.image} alt={toTitleCase(product.name)} />

      {/* Flavor tags */}
      <FlavorTags product={product} />

      {/* Details */}
      <div className="w-full flex-grow mb-3 mt-2  font-semibold text-black">
        <h3 className="text-lg mb-2 line-clamp-2" title={toTitleCase(product.name)}>{toTitleCase(product.name)}</h3>
        <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs font-medium text-gray-400">
          <p>Roast:</p>
          <p>{toTitleCase(product.roastDegree || "N/A")}</p>

          {product.pricePerCup !== undefined && (
            <>
              <p>Price Per Cup:</p>
              <p>${product.pricePerCup.toFixed(2)}</p>
            </>
          )}

          {product.gram !== undefined && (
            <>
              <p>Weight:</p>
              <p>{product.gram.toFixed(0)} g</p>
            </>
          )}

          <p>Available?</p>
          <p>{toTitleCase(product.availability || "N/A")}</p>

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
  );
}
