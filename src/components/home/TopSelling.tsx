import React from 'react';
import { ProductCard } from '../product/ProductCard';
import { AnimatedSection } from '../ui/AnimatedSection';
import { ProductWithVariants } from '@/types';

interface TopSellingProps {
  products: ProductWithVariants[];
}

export function TopSelling({ products }: TopSellingProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-cream-light">
      <AnimatedSection>
        <h2 className="font-display text-4xl md:text-5xl text-ink mb-12">
          Best Sellers
        </h2>
      </AnimatedSection>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-y-16">
        {products.slice(0, 6).map((product, idx) => (
          <AnimatedSection key={product.id} delay={idx * 60}>
            <ProductCard product={product} />
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
