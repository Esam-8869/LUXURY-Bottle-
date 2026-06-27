'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { ProductWithVariants } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { cn } from '../ui/Button';

interface ProductCardProps {
  product: ProductWithVariants;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const primaryImage = product.ProductImages.find(img => img.is_primary) || product.ProductImages[0];
  const secondaryImage = product.ProductImages.find(img => !img.is_primary) || primaryImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.ProductVariants.length > 0) {
      const defaultVariant = product.ProductVariants[0];
      addItem({
        id: Math.random().toString(36).substr(2, 9), // Temporary ID for client state
        cart_id: 'temp',
        product_id: product.id,
        variant_id: defaultVariant.id,
        quantity: 1,
        added_at: new Date(),
        Product: product,
        ProductVariant: defaultVariant,
      });
      openCart();
    }
  };

  return (
    <div 
      className={cn("group flex flex-col cursor-pointer", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block relative aspect-[4/5] bg-warm-white rounded-card overflow-hidden">
        {/* Primary Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={primaryImage?.url || '/images/placeholder.jpg'} 
          alt={primaryImage?.alt_text || product.name}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-transform duration-[400ms] ease-out",
            isHovered ? "scale-105" : "scale-100"
          )}
        />
        
        {/* Secondary Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={secondaryImage?.url || '/images/placeholder.jpg'} 
          alt={secondaryImage?.alt_text || product.name}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-normal ease-out",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Wishlist Button */}
        <button 
          className="absolute top-4 right-4 p-2 rounded-full bg-white/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-fast hover:bg-white text-ink"
          onClick={(e) => {
            e.preventDefault();
            // Toggle wishlist (placeholder)
          }}
          aria-label="Add to wishlist"
        >
          <Heart className="w-5 h-5" />
        </button>

        {/* Quick Add Pill */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-center overflow-hidden">
          <button 
            className={cn(
              "w-[90%] bg-white/70 backdrop-blur-md text-ink text-sm font-medium py-3 rounded-pill shadow-sm transition-all duration-normal hover:bg-white hover:scale-105",
              isHovered ? "translate-y-0 opacity-100" : "translate-y-[150%] opacity-0"
            )}
            onClick={handleQuickAdd}
          >
            Quick Add
          </button>
        </div>
      </Link>

      <div className="mt-4 flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-base font-medium text-ink">{product.name}</h3>
          </Link>
          <span className="font-mono text-sm">${Number(product.base_price).toFixed(2)}</span>
        </div>
        
        {/* Swatches */}
        {product.ProductVariants && product.ProductVariants.length > 0 && (
          <div className="flex gap-1.5 mt-1">
            {product.ProductVariants.map((variant) => (
              <div 
                key={variant.id}
                className="w-3.5 h-3.5 rounded-full border border-sand-dark cursor-pointer"
                style={{ backgroundColor: variant.hex_code }}
                title={variant.color_name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
