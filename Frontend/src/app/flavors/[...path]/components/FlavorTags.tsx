'use client';

import { getNoteColor, getNoteTextColor } from '@/lib/utils/colorutils';
import { toTitleCase, toCompressedForm } from '@/lib/utils/stringutils';
import { useProductSearchContext } from '@/context/ProductSearchContext';
import { FlavorSearchQuery } from '../types/types';
import { FlavorDTO } from '@/lib/api/flavors';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type Flavor = {
  name: string;
};

type Props = {
  product?: {
    id: string | number;
    flavors?: Flavor[];
  };
  flavorNames?: FlavorDTO[];
  onFlavorClick?: (flavorName: string) => void;
};

// TODO: refactor because this is quite messy
export default function FlavorTags({ product, flavorNames, onFlavorClick }: Props) {
  const { triggerProductSearch } = useProductSearchContext();
  const router = useRouter();

  const flavorList: string[] = flavorNames?.map(f => f.name)
    ?? product?.flavors?.map(f => f.name)
    ?? [];

  if (flavorList.length === 0) return null;

  const handleFlavorClick = (flavorName: string) => {
    if (product) {
      const query: FlavorSearchQuery = {
        type: 'flavor',
        values: [flavorName],
        strict: false
      };
      triggerProductSearch(query);
    } else if (flavorNames) {
      const selectedSubCategory = JSON.parse(sessionStorage.getItem('selectedSubCategory') || '[]');

      if (!selectedSubCategory.includes(flavorName)) {
        selectedSubCategory.push(flavorName);
        sessionStorage.setItem('selectedSubCategory', JSON.stringify(selectedSubCategory));
        onFlavorClick?.(flavorName);

        // Toast only when flavorNames is used (in flavor-wall page)
        toast.success(`${toTitleCase(flavorName)} flavor selected!`, {
          description: "Click browse to explore products with this flavor.",
          action: {
            label: "Browse",
            onClick: () => router.push(`/flavors/Fruity`),
          },
        });
      }
    }
  };

  return (
    <div className="flex flex-wrap flex-row justify-center pt-1">
      {flavorList
        .slice()
        .sort((a, b) => a.localeCompare(b))
        .map((name, idx) => {
          const bg = getNoteColor(toTitleCase(name));
          const textColor = getNoteTextColor(bg);

          return (
            <span
              key={idx}
              onClick={() => handleFlavorClick(name)}
              className="transition-all duration-100 ease-in-out py-1 px-2 m-0.5 text-xs border-black border-2 font-semibold cursor-pointer flex-grow hover:shadow-light hover:-translate-y-boxShadowY hover:-translate-x-boxShadowX active:shadow-none active:translate-y-boxShadowYSm active:translate-x-boxShadowXSm"
              style={{
                backgroundColor: bg,
                color: textColor,
              }}
            >
              {toCompressedForm(name)}
            </span>
          );
        })}
    </div>
  );
}
