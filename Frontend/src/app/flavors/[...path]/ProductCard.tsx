import React from 'react';
import type { Product } from "./types";
import ProductImage from "./ProductImage";
import { toTitleCase } from "@/lib/stringutils";

interface ProductCardProps {
  product: Product;
  priceStyle: React.CSSProperties;
}

export default function ProductCard({ product, priceStyle }: ProductCardProps) {
  return (
    <div
      key={product.id}
      className="relative bg-white h-full p-4 text-left flex flex-col justify-between items-center"
    >
      {/* Price sticker */}
      {product.price !== undefined && (
        <div
          className="absolute top-2 right-2 border-black border-2 text-sm font-bold px-2 py-1 z-10"
          style={priceStyle}
        >
          ${product.price.toFixed(2)}
        </div>
      )}

      {/* Image */}
      <ProductImage src={product.image} alt={toTitleCase(product.name)} />

      {/* Details */}
      <div className="w-full flex-grow mb-3 mt-2">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2" title={toTitleCase(product.name)}>{toTitleCase(product.name)}</h3>
        <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs text-gray-600">
          <p className="font-semibold text-gray-700">Roast:</p>
          <p>{toTitleCase(product.roastDegree || "N/A")}</p>

          {product.pricePerCup !== undefined && (
            <>
              <p className="font-semibold text-gray-700">Price Per Cup:</p>
              <p>${product.pricePerCup.toFixed(2)}</p>
            </>
          )}

          {product.gram !== undefined && (
            <>
              <p className="font-semibold text-gray-700">Weight:</p>
              <p>{product.gram.toFixed(0)} g</p>
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
  );
}
