import React from 'react';
import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryStrip } from '@/components/home/CategoryStrip';
import { TopSelling } from '@/components/home/TopSelling';

// In a real app, this would fetch from the database
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
  }
];

export default async function Home() {
  // const products = await prisma.product.findMany({ where: { is_top_selling: true }, include: { ... } })
  
  return (
    <>
      <HeroBanner />
      <CategoryStrip />
      <TopSelling products={dummyProducts} />
      
      {/* Featured Product Section (Placeholder) */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-24">
        <div className="flex-1 w-full relative aspect-[4/5] md:aspect-auto md:h-[80vh] rounded-2xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/featured.jpg" alt="Featured Product" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="flex-1 flex flex-col justify-center items-start">
          <p className="text-xs tracking-caps uppercase text-ink-muted mb-4">Editors Pick</p>
          <h2 className="font-display text-4xl md:text-6xl text-ink mb-6">The Architect Series</h2>
          <p className="text-ink-soft max-w-md mb-8">
            Engineered for the modern minimalist. Double-walled borosilicate glass meets aerospace-grade aluminum. A testament to pure utility and refined aesthetics.
          </p>
          <a href="/products/architect-series" className="border-b border-ink pb-1 text-sm font-medium hover:text-dusty-rose hover:border-dusty-rose transition-colors">
            Discover the Series
          </a>
        </div>
      </section>
      
      {/* Newsletter (Placeholder) */}
      <section className="bg-ink py-24 text-center px-4">
        <h2 className="font-display text-4xl md:text-5xl text-white mb-4">Stay in the Loop</h2>
        <p className="text-cream-light/70 mb-8 max-w-md mx-auto">Join 50,000+ subscribers. No spam, only editorial content and exclusive drops.</p>
        <form className="max-w-md mx-auto flex gap-4">
          <input type="email" placeholder="Email address" className="flex-1 bg-transparent border-b border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:border-white px-2 py-3" required />
          <button type="submit" className="text-white uppercase tracking-caps text-xs font-medium hover:text-dusty-rose transition-colors">Subscribe</button>
        </form>
      </section>
    </>
  );
}
