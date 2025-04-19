import React from 'react';
import { useInView } from 'react-intersection-observer';
import type { Product } from './types';
import ProductCard from './ProductCard';

interface LazyProductCardWrapperProps {
  product: Product;
  priceStyle: React.CSSProperties;
  placeholderHeight?: string;
  initiallyFavorited: boolean;
  onDelete: (productId: number | string) => void;
}

const LazyProductCardWrapper: React.FC<LazyProductCardWrapperProps> = ({
  product,
  priceStyle,
  placeholderHeight = '10px',
  initiallyFavorited,
  onDelete
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
        />
      ) : (
        null
      )}
    </div>
  );
};

export default LazyProductCardWrapper;
