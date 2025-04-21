import React from 'react';
import { useInView } from 'react-intersection-observer';
import type { Product } from '../types/types';
import ProductCard from './ProductCard';

interface LazyProductCardWrapperProps {
  product: Product;
  priceStyle: React.CSSProperties;
  placeholderHeight?: string;
  initiallyFavorited: boolean;
  onDelete?: (productId: number | string) => void;
  fetchFavorites: () => void;
  favoritesPage?: boolean;
}

const LazyProductCardWrapper: React.FC<LazyProductCardWrapperProps> = ({
  product,
  priceStyle,
  placeholderHeight = '10px',
  initiallyFavorited,
  onDelete,
  fetchFavorites,
  favoritesPage
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
  });

  return (
    <div ref={ref} style={{ minHeight: !inView ? placeholderHeight : undefined }}>
      {inView ? (
        <ProductCard
          product={product}
          priceStyle={priceStyle}
          initiallyFavorited={initiallyFavorited}
          onDelete={onDelete}
          fetchFavorites={fetchFavorites}
          favoritesPage={favoritesPage}
        />
      ) : (
        null
      )}
    </div>
  );
};

export default LazyProductCardWrapper;
