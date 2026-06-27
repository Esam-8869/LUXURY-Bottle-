import React from 'react';
import { ProductCard } from '@/components/product/ProductCard';

const dummyProducts: any[] = [
  {
    id: '1',
    name: 'The Glass Origin',
    slug: 'the-glass-origin',
    base_price: '45.00',
    ProductImages: [{ url: '/images/product-1.jpg', is_primary: true }],
    ProductVariants: [{ id: 'v1', color_name: 'Clear', hex_code: '#ffffff' }],
  },
  {
    id: '2',
    name: 'Matte Onyx Edition',
    slug: 'matte-onyx-edition',
    base_price: '65.00',
    ProductImages: [{ url: '/images/product-2.jpg', is_primary: true }],
    ProductVariants: [{ id: 'v2', color_name: 'Onyx', hex_code: '#1A1A1A' }],
  },
  {
    id: '3',
    name: 'Sage Infusion',
    slug: 'sage-infusion',
    base_price: '55.00',
    ProductImages: [{ url: '/images/product-3.jpg', is_primary: true }],
    ProductVariants: [{ id: 'v3', color_name: 'Sage', hex_code: '#8C9A86' }],
  },
  {
    id: '4',
    name: 'Blush Mist Travel',
    slug: 'blush-mist-travel',
    base_price: '40.00',
    ProductImages: [{ url: '/images/product-4.jpg', is_primary: true }],
    ProductVariants: [{ id: 'v4', color_name: 'Blush', hex_code: '#E8DCCB' }],
  }
];

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryName = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      
      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center mb-16">
        <h1 className="font-display text-5xl md:text-6xl text-ink mb-4">{categoryName}</h1>
        <p className="text-ink-soft max-w-lg mx-auto">
          Explore our curated selection of luxury {categoryName.toLowerCase()} bottles, designed for utility and everyday elegance.
        </p>
      </div>

      {/* Filters & Sorting Placeholder */}
      <div className="flex items-center justify-between border-y border-blush-mist py-4 mb-12">
        <div className="flex gap-6 text-sm">
          <button className="text-ink font-medium">Filters</button>
          <div className="hidden md:flex gap-4 text-ink-muted">
            <button className="hover:text-ink">Color</button>
            <button className="hover:text-ink">Material</button>
            <button className="hover:text-ink">Size</button>
          </div>
        </div>
        <div className="text-sm">
          <span className="text-ink-muted mr-2">Sort by:</span>
          <select className="bg-transparent text-ink font-medium outline-none">
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-y-16">
        {dummyProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load More */}
      <div className="mt-16 flex justify-center">
        <button className="border-b border-ink pb-1 text-sm font-medium hover:text-dusty-rose hover:border-dusty-rose transition-colors">
          Load More Products
        </button>
      </div>
    </div>
  );
}
