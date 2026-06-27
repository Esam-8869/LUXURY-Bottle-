'use client';

import React, { useState } from 'react';
import { ProductImage } from '@prisma/client';
import { cn } from '../ui/Button';

interface ProductGalleryProps {
  images: ProductImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState<ProductImage | null>(images[0] || null);

  if (!images || images.length === 0) {
    return <div className="w-full aspect-[4/5] bg-warm-white rounded-2xl flex items-center justify-center text-ink-muted">No images</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-4 order-2 md:order-1 overflow-x-auto md:overflow-y-auto hide-scrollbar">
        {images.map((img) => (
          <button
            key={img.id}
            onClick={() => setActiveImage(img)}
            className={cn(
              "relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-fast",
              activeImage?.id === img.id ? "border-ink" : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.alt_text || 'Thumbnail'} className="absolute inset-0 w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 order-1 md:order-2 relative aspect-[4/5] md:aspect-auto md:h-[80vh] rounded-2xl overflow-hidden bg-warm-white group cursor-zoom-in">
        {activeImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            key={activeImage.id}
            src={activeImage.url} 
            alt={activeImage.alt_text || 'Product image'} 
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-normal animate-fade-in"
          />
        )}
      </div>
    </div>
  );
}
