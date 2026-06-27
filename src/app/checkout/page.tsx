'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
  const { items, getCartTotal } = useCartStore();
  const [step, setStep] = useState(1);
  const total = getCartTotal();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-4xl text-ink mb-6">Your Cart is Empty</h1>
        <p className="text-ink-soft mb-8">Add items to your cart before proceeding to checkout.</p>
        <Link href="/products">
          <Button>Return to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12">
        
        {/* Left Column: Flow */}
        <div className="flex-1">
          <div className="flex items-center gap-4 text-sm font-medium mb-10 text-ink-muted">
            <span className={step >= 1 ? "text-ink" : ""}>1. Shipping</span>
            <ArrowRight className="w-4 h-4" />
            <span className={step >= 2 ? "text-ink" : ""}>2. Payment</span>
            <ArrowRight className="w-4 h-4" />
            <span className={step >= 3 ? "text-ink" : ""}>3. Review</span>
          </div>

          <div className="bg-warm-white p-8 rounded-2xl shadow-sm border border-blush-mist">
            {step === 1 && (
              <div>
                <h2 className="font-display text-3xl text-ink mb-6">Shipping Details</h2>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <Input placeholder="First Name" />
                  <Input placeholder="Last Name" />
                  <Input placeholder="Email" className="col-span-2" type="email" />
                  <Input placeholder="Phone" className="col-span-2" type="tel" />
                  <Input placeholder="Address Line 1" className="col-span-2" />
                  <Input placeholder="City" />
                  <Input placeholder="Postal Code" />
                </div>
                <Button className="w-full" onClick={() => setStep(2)}>
                  Continue to Payment
                </Button>
              </div>
            )}
            
            {step === 2 && (
              <div>
                <h2 className="font-display text-3xl text-ink mb-6">Payment</h2>
                <div className="p-6 border border-sand-dark rounded-xl mb-6 bg-white flex flex-col gap-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-ink">Credit Card</span>
                    <Lock className="w-4 h-4 text-ink-muted" />
                  </div>
                  {/* Fake Stripe Element */}
                  <Input placeholder="Card Number" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="MM / YY" />
                    <Input placeholder="CVC" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button className="flex-1" onClick={() => setStep(3)}>
                    Review Order
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="font-display text-3xl text-ink mb-6">Review & Place Order</h2>
                <p className="text-ink-soft mb-8">Please confirm your details before placing the order.</p>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button className="flex-1 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    Place Order • ${total.toFixed(2)}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-warm-white p-8 rounded-2xl shadow-sm border border-blush-mist sticky top-24">
            <h2 className="font-display text-2xl text-ink mb-6">Order Summary</h2>
            
            <div className="flex flex-col gap-4 mb-6 max-h-[40vh] overflow-y-auto hide-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-20 bg-cream-light rounded-md overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.ProductVariant.dynamic_image_url || item.Product.ProductImages[0]?.url || '/images/placeholder.jpg'} 
                      alt={item.Product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <h4 className="text-sm font-medium text-ink">{item.Product.name}</h4>
                    <p className="text-xs text-ink-muted">Color: {item.ProductVariant.color_name}</p>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-ink-soft">Qty: {item.quantity}</span>
                      <span className="font-mono text-sm">${(Number(item.ProductVariant.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-blush-mist pt-4 space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span>
                <span className="font-mono">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Shipping</span>
                <span className="font-mono">Free</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Tax</span>
                <span className="font-mono">Calculated at next step</span>
              </div>
              <div className="flex justify-between text-lg font-medium text-ink pt-2 border-t border-blush-mist">
                <span>Total</span>
                <span className="font-mono">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <p className="text-xs text-ink-muted text-center flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Secure Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
