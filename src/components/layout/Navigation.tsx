'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { cn } from '../ui/Button';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500",
        isScrolled 
          ? "bg-glass backdrop-blur-md border-b border-glass-border py-4 shadow-sm" 
          : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex-1 md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="p-2 -ml-2 text-ink hover:text-ink-soft transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex-1 md:flex-none text-center md:text-left">
            <Link 
              href="/" 
              className="font-display text-2xl tracking-display font-medium text-ink"
            >
              BOTTLE
            </Link>
          </div>

          {/* Desktop Links */}
          <nav className="hidden md:flex flex-1 justify-center space-x-12">
            {['Children', 'Women', 'Aesthetic Collection'].map((item) => (
              <Link
                key={item}
                href={`/categories/${item.toLowerCase().replace(' ', '-')}`}
                className="text-[13px] uppercase tracking-caps font-medium text-ink hover:text-dusty-rose transition-colors duration-fast"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex-1 flex items-center justify-end space-x-4 md:space-x-6">
            <button aria-label="Search" className="text-ink hover:text-dusty-rose transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/account" aria-label="Account" className="hidden md:block text-ink hover:text-dusty-rose transition-colors">
              <User className="w-5 h-5" />
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="hidden md:block text-ink hover:text-dusty-rose transition-colors relative">
              <Heart className="w-5 h-5" />
            </Link>
            <button 
              aria-label="Cart" 
              className="text-ink hover:text-dusty-rose transition-colors relative"
              onClick={openCart}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span 
                  className="absolute -top-1.5 -right-1.5 bg-dusty-rose text-ink text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center"
                  aria-live="polite"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
