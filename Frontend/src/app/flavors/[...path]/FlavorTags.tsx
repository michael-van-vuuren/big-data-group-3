'use client';

import { getNoteColor, getNoteTextColor } from '@/lib/colorutils';
import { toTitleCase, toCompressedForm } from '@/lib/stringutils';
import { useProductSearchContext } from '@/context/ProductSearchContext';
import { FlavorSearchQuery } from '@/context/ProductSearchContext';

type Flavor = {
  name: string;
};

type Props = {
  product: {
    flavors?: Flavor[];
  };
};

export default function FlavorTags({ product }: Props) {
  if (!product.flavors || product.flavors.length === 0) return null;

  const {
    triggerProductSearch
  } = useProductSearchContext();

  const handleFlavorClick = (flavorName: string) => {
    // Build flavor query
    const query: FlavorSearchQuery = {
      type: 'flavor',
      values: [flavorName],
      strict: false
    };
    triggerProductSearch(query);
  };


  return (
    <div className="flex flex-wrap flex-row justify-center pt-1">
      {product.flavors
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((f, idx) => {
          const bg = getNoteColor(toTitleCase(f.name));
          const textColor = getNoteTextColor(bg);

          return (
            <span
              key={idx}
              onClick={() => handleFlavorClick(f.name)}
              className="transition-all duration-100 ease-in-out py-1 px-2 m-0.5 text-xs border-black border-2 font-semibold cursor-pointer flex-grow hover:shadow-light hover:-translate-y-boxShadowY hover:-translate-x-boxShadowX active:shadow-none active:translate-y-boxShadowYSm active:translate-x-boxShadowXSm"
              style={{
                backgroundColor: bg,
                color: textColor,
              }}
            >
              {toCompressedForm(f.name)}
            </span>
          );
        })}
    </div>
  );
}
