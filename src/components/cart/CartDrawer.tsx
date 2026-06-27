'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { cn, Button } from '../ui/Button';

export function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, getCartTotal } = useCartStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const total = getCartTotal();

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-[70] bg-ink/40 backdrop-blur-sm transition-opacity duration-normal",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md z-[80] bg-cream-light shadow-2xl flex flex-col transform transition-transform duration-slow var(--ease-luxury)",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-blush-mist">
          <h2 className="text-lg font-medium text-ink">Your Cart ({items.length})</h2>
          <button onClick={closeCart} className="p-2 -mr-2 text-ink hover:text-ink-soft">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blush-mist/30 flex items-center justify-center mb-4">
                <div className="w-8 h-8 opacity-50">🛍️</div>
              </div>
              <h3 className="text-lg font-medium">Your cart is empty</h3>
              <p className="text-sm text-ink-muted">Discover our collections and find your perfect bottle.</p>
              <Button variant="outline" className="mt-4" onClick={closeCart}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-24 h-32 bg-warm-white rounded-md overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.ProductVariant.dynamic_image_url || item.Product.ProductImages[0]?.url || '/images/placeholder.jpg'} 
                    alt={item.Product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col flex-1 py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-ink">{item.Product.name}</h4>
                      <p className="text-xs text-ink-muted mt-1">Color: {item.ProductVariant.color_name}</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-ink-muted hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border border-sand-dark rounded-md">
                      <button 
                        className="px-2 py-1 text-ink hover:bg-black/5 transition-colors disabled:opacity-50"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-medium w-8 text-center">{item.quantity}</span>
                      <button 
                        className="px-2 py-1 text-ink hover:bg-black/5 transition-colors disabled:opacity-50"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.ProductVariant.stock_quantity}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-sm font-mono">${Number(item.ProductVariant.price).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-blush-mist bg-warm-white/50 space-y-4">
            <div className="flex justify-between text-base font-medium text-ink">
              <span>Subtotal</span>
              <span className="font-mono">${total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-ink-muted">Shipping and taxes calculated at checkout.</p>
            <Link href="/checkout" onClick={closeCart} className="block">
              <Button className="w-full">Proceed to Checkout</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
