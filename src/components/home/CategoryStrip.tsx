import React from 'react';
import Link from 'next/link';

const categories = [
  { name: 'Children', image: '/images/cat-children.jpg', slug: 'children' },
  { name: 'Women', image: '/images/cat-women.jpg', slug: 'women' },
  { name: 'Aesthetic Collection', image: '/images/cat-aesthetic.jpg', slug: 'aesthetic-collection' },
];

export function CategoryStrip() {
  return (
    <section className="w-full flex flex-col md:flex-row h-auto md:h-[60vh] bg-warm-white">
      {categories.map((cat, index) => (
        <Link 
          href={`/categories/${cat.slug}`}
          key={cat.slug} 
          className="group relative flex-1 h-[40vh] md:h-full overflow-hidden block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={cat.image} 
            alt={cat.name} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-slow ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-ink/20 group-hover:bg-ink/10 transition-colors duration-normal" />
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <h2 className="text-white font-display text-4xl italic tracking-heading transition-transform duration-normal group-hover:-translate-y-1 drop-shadow-sm">
              {cat.name}
            </h2>
          </div>
        </Link>
      ))}
    </section>
  );
}
