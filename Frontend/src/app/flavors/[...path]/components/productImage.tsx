import { useState } from "react";
import { cn } from "@/lib/utils/utils";

type ProductImageProps = {
  src?: string;
  alt: string;
  isFavorited?: boolean;
};

function ProductImage({ src, alt, isFavorited }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className={cn(
        "w-full h-44 border-[1px] border-dashed  mb-1 flex items-center justify-center text-sm",
        !isFavorited ?
          "bg-slate-100 border-slate-400 text-gray-400 " :
          "bg-slate-900 border-white text-gray-600"
      )}
      >
        No Image Available
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={cn("w-full h-44 object-contain p-2 border-[1px] border-dashed mb-1",
        !isFavorited ?
          "bg-slate-100 border-slate-400 text-gray-400 " :
          "bg-slate-900 border-white text-gray-600"
      )}

    />
  );
}

export default ProductImage;
