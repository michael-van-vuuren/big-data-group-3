import { useState } from "react";

type ProductImageProps = {
  src?: string;
  alt: string;
};

function ProductImage({ src, alt }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="w-full h-44 border-2 border-slate-400 border-dotted bg-slate-100 mb-3 flex items-center justify-center text-gray-400 text-sm">
        No Image Available
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className="w-full h-44 object-contain p-2 border-2 border-slate-400 border-dotted mb-3 bg-white"
    />
  );
}

export default ProductImage;
