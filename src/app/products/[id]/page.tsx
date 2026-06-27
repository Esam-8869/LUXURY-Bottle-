'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Truck, Shield, RefreshCw } from 'lucide-react';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ColorSelector } from '@/components/product/ColorSelector';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useCartStore } from '@/store/cartStore';

// In a real app, this would be fetched from the API based on the slug/id
const mockProduct = {
  id: '1',
  name: 'The Glass Origin',
  slug: 'the-glass-origin',
  base_price: '45.00',
  description: 'The definitive luxury bottle. Double-walled borosilicate glass meets aerospace-grade aluminum. A testament to pure utility and refined aesthetics. Designed to elevate your daily hydration ritual.',
  short_description: 'Double-walled borosilicate glass luxury bottle.',
  ProductImages: [
    { id: '1', url: '/images/product-1.jpg', is_primary: true, alt_text: 'Front view' },
    { id: '2', url: '/images/product-1-alt.jpg', is_primary: false, alt_text: 'Detail view' },
  ],
  ProductVariants: [
    { id: 'v1', color_name: 'Clear', hex_code: '#ffffff', price: '45.00', stock_quantity: 12 },
    { id: 'v2', color_name: 'Onyx', hex_code: '#1A1A1A', price: '50.00', stock_quantity: 2 },
    { id: 'v3', color_name: 'Sage', hex_code: '#8C9A86', price: '45.00', stock_quantity: 0 },
  ]
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = mockProduct; // Replace with actual data fetch
  const [selectedVariant, setSelectedVariant] = useState(product.ProductVariants[0]);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const handleAddToCart = () => {
    addItem({
      id: Math.random().toString(36).substr(2, 9),
      cart_id: 'temp',
      product_id: product.id,
      variant_id: selectedVariant.id,
      quantity,
      added_at: new Date(),
      Product: product as any,
      ProductVariant: selectedVariant as any,
    });
    openCart();
  };

  const getStockBadge = () => {
    if (selectedVariant.stock_quantity === 0) {
      return <Badge variant="red">Out of stock</Badge>;
    }
    if (selectedVariant.stock_quantity <= 3) {
      return <Badge variant="amber">Almost gone!</Badge>;
    }
    if (selectedVariant.stock_quantity <= 10) {
      return <Badge variant="outline">Only {selectedVariant.stock_quantity} left</Badge>;
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      
      {/* Breadcrumb */}
      <nav className="flex text-sm text-ink-muted mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li><Link href="/" className="hover:text-ink">Home</Link></li>
          <li><span>/</span></li>
          <li><Link href="/products" className="hover:text-ink">Products</Link></li>
          <li><span>/</span></li>
          <li className="text-ink font-medium" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* Left Column: Gallery */}
        <div className="w-full lg:w-[55%]">
          <ProductGallery images={product.ProductImages as any} />
        </div>

        {/* Right Column: Info */}
        <div className="w-full lg:w-[45%] flex flex-col pt-4">
          <h1 className="font-display text-4xl md:text-5xl text-ink mb-2">{product.name}</h1>
          
          {/* Reviews Link Placeholder */}
          <div className="flex items-center gap-2 mb-6 cursor-pointer group">
            <div className="flex text-dusty-rose text-sm">
              ★★★★★
            </div>
            <span className="text-sm text-ink-muted group-hover:text-ink transition-colors">24 reviews</span>
          </div>

          <div className="font-mono text-2xl mb-8">
            ${Number(selectedVariant.price).toFixed(2)}
          </div>

          <p className="text-ink-soft mb-10 leading-relaxed">
            {product.description}
          </p>

          {/* Configuration */}
          <div className="space-y-8 mb-10 border-t border-b border-blush-mist py-8">
            <ColorSelector 
              variants={product.ProductVariants as any} 
              selectedVariant={selectedVariant as any} 
              onSelectVariant={(v) => {
                setSelectedVariant(v);
                setQuantity(1); // Reset quantity on variant change
              }} 
            />

            <div className="flex items-end justify-between gap-4">
              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-ink-soft">Quantity:</span>
                <div className="flex items-center border border-sand-dark rounded-md h-12 w-32">
                  <button 
                    className="flex-1 h-full flex items-center justify-center text-ink hover:bg-black/5 disabled:opacity-50"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || selectedVariant.stock_quantity === 0}
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-medium">{quantity}</span>
                  <button 
                    className="flex-1 h-full flex items-center justify-center text-ink hover:bg-black/5 disabled:opacity-50"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= selectedVariant.stock_quantity}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mb-2">
                {getStockBadge()}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 mb-10">
            <Button 
              size="lg" 
              className="w-full text-lg" 
              onClick={handleAddToCart}
              disabled={selectedVariant.stock_quantity === 0}
            >
              {selectedVariant.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Button size="lg" variant="outline" className="w-full text-lg flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Add to Wishlist
            </Button>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-ink-soft bg-warm-white p-6 rounded-2xl">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-dusty-rose" />
              <span>Free shipping over $100</span>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-dusty-rose" />
              <span>30-day free returns</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-dusty-rose" />
              <span>Lifetime warranty</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
