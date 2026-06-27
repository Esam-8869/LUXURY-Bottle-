import React from 'react';
import { ProductVariant } from '@prisma/client';
import { cn } from '../ui/Button';

interface ColorSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onSelectVariant: (variant: ProductVariant) => void;
}

export function ColorSelector({ variants, selectedVariant, onSelectVariant }: ColorSelectorProps) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-medium text-ink-soft">Color:</span>
        <span className="text-sm font-medium text-ink">{selectedVariant.color_name}</span>
      </div>
      <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Color options">
        {variants.map((variant) => {
          const isSelected = selectedVariant.id === variant.id;
          return (
            <button
              key={variant.id}
              role="radio"
              aria-checked={isSelected}
              aria-label={variant.color_name}
              title={variant.color_name}
              onClick={() => onSelectVariant(variant)}
              className={cn(
                "relative flex items-center justify-center w-8 h-8 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink transition-all",
                isSelected ? "ring-1 ring-ink ring-offset-2" : "ring-0 ring-transparent"
              )}
            >
              <span 
                className="w-full h-full rounded-full border border-sand-dark"
                style={{ backgroundColor: variant.hex_code }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
