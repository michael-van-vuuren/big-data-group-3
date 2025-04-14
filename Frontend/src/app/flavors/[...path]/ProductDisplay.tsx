import { Button } from "@/components/ui/button";
import type { Product } from "./types";
import { toTitleCase } from "@/lib/stringutils";

interface ProductDisplayProps {
  loading: boolean;
  products: Product[];
  error: string | null;
  onClose: () => void;
}

export default function ProductDisplay({ loading, products, error, onClose }: ProductDisplayProps) {
  return (
    <div className="bg-blue-900 text-start pb-16 flex-grow grid-bg-dot">
      <div className="sticky max-w-6xl mx-auto top-0 flex justify-end p-4 bg-slate-400 border-x-2 border-b-2 border-black">
        <Button
          variant="reverse"
          size="icon"
          onClick={onClose}
          className="mr-2 bg-red-500 border-black text-black hover:bg-white"
          aria-label="Close product view"
        >
          <span className="text-xl font-semibold leading-none">&times;</span>
        </Button>
      </div>

      <div className="bg-white max-w-6xl mx-auto text-start h-full px-8 pb-16 border-black border-2">
        <h1 className="text-4xl font-bold text-center my-10">Matching Coffee Products</h1>

        {loading && <p className="text-center text-lg text-gray-500 py-10">Loading...</p>}

        {error && !loading && (
          <div className="text-center p-4 my-6 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="text-center text-gray-500 text-lg mt-10">No matching products found.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <p className="text-center text-base text-gray-600 font-medium mb-8">
              Found: {products.length} product(s)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {products.map(product => (
                <div
                  key={product.beanId}
                  className="bg-white p-4 rounded-lg text-left flex flex-col justify-between items-center"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={toTitleCase(product.name)}
                      className="w-full h-44 object-contain p-4 border-2 border-black mb-3 bg-gray-100"
                    />
                  ) : (
                    <div className="w-full h-44 bg-gray-100 border-2 border-black mb-3 flex items-center justify-center text-gray-500">
                      No Image Available
                    </div>
                  )}

                  <div className="w-full">
                    <h3 className="text-xl font-semibold mb-3">{toTitleCase(product.name)}</h3>
                    <div className="grid grid-cols-[70px_1fr] gap-2 text-sm text-gray-600 mb-1">
                      <p className="font-semibold">Roast:</p>
                      <p>{product.roastDegree || "N/A"}</p>
                      {product.price !== undefined && (
                        <>
                          <p className="font-semibold">Price:</p>
                          <p>${product.price.toFixed(2)}</p>
                        </>
                      )}
                      {product.pricePerCup !== undefined && (
                        <>
                          <p className="font-semibold">Cup:</p>
                          <p>${product.pricePerCup.toFixed(2)}</p>
                        </>
                      )}
                      {product.bulkPricePerCup !== undefined && (
                        <>
                          <p className="font-semibold">Bulk Cup:</p>
                          <p>${product.bulkPricePerCup.toFixed(2)}</p>
                        </>
                      )}
                      <p className="font-semibold">Status:</p>
                      <p>{product.availability || "N/A"}</p>
                      {product.flavors !== undefined && product.flavors?.length > 0 && (
                        <>
                          <p className="font-semibold">Flavors:</p>
                          <p>{product.flavors.map(f => f.name).join(", ")}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <a
                    href={product.webpage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full text-sm text-black font-medium text-center border-2 border-black py-2 px-4 mt-4 ${!product.webpage
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-emerald-500 hover:text-white"
                      } transition-colors duration-200`}
                    onClick={e => !product.webpage && e.preventDefault()}
                  >
                    {product.webpage ? "Buy Now →" : "Link Unavailable"}
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
