'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { X, Search } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { cn } from '../ui/Button';

export function MobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] bg-cream-light transform transition-transform duration-500 var(--ease-luxury)",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center justify-between mb-12">
          <Link href="/" onClick={closeMobileMenu} className="font-display text-2xl tracking-display font-medium text-ink">
            BOTTLE
          </Link>
          <button onClick={closeMobileMenu} className="p-2 -mr-2 text-ink">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative mb-8">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full border-b border-sand-dark bg-transparent py-3 pl-10 pr-4 text-ink focus:outline-none focus:border-ink placeholder:text-ink-muted"
          />
          <Search className="absolute left-0 top-3.5 w-5 h-5 text-ink-muted" />
        </div>

        <nav className="flex flex-col space-y-6 flex-1">
          {['Children', 'Women', 'Aesthetic Collection'].map((item) => (
            <Link
              key={item}
              href={`/categories/${item.toLowerCase().replace(' ', '-')}`}
              onClick={closeMobileMenu}
              className="text-2xl font-display tracking-heading text-ink hover:text-dusty-rose transition-colors"
            >
              {item}
            </Link>
          ))}
          <div className="pt-6 mt-6 border-t border-blush-mist space-y-4">
            <Link href="/account" onClick={closeMobileMenu} className="block text-sm uppercase tracking-caps text-ink">
              My Account
            </Link>
            <Link href="/wishlist" onClick={closeMobileMenu} className="block text-sm uppercase tracking-caps text-ink">
              Wishlist
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
