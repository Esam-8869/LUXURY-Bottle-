'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, User, Heart, Settings, LogOut } from 'lucide-react';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('orders');

  const tabs = [
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <div className="flex flex-col md:flex-row gap-12">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="mb-8">
            <h1 className="font-display text-3xl text-ink mb-1">My Account</h1>
            <p className="text-sm text-ink-muted">alex.doe@example.com</p>
          </div>
          
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-ink text-cream-light' 
                    : 'text-ink-soft hover:bg-warm-white hover:text-ink'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
            <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-4">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-warm-white rounded-2xl p-8 border border-blush-mist min-h-[500px]">
          
          {activeTab === 'orders' && (
            <div>
              <h2 className="font-display text-2xl text-ink mb-6">Order History</h2>
              <div className="space-y-4">
                {/* Mock Order */}
                <div className="border border-sand-dark rounded-xl p-6 bg-cream-light">
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-sand-dark">
                    <div>
                      <p className="text-sm text-ink-muted">Order #ORD-29183</p>
                      <p className="text-xs text-ink-muted mt-1">Placed on October 12, 2026</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Delivered
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-16 h-20 bg-warm-white rounded overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/images/product-1.jpg" alt="Product" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-ink text-sm">The Glass Origin</p>
                      <p className="text-xs text-ink-muted mt-1">Color: Clear</p>
                      <p className="text-xs text-ink-muted mt-1">Qty: 2</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-medium text-ink">$90.00</p>
                      <button className="text-xs text-dusty-rose hover:text-ink mt-2 border-b border-transparent hover:border-ink transition-colors">
                        View Invoice
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 className="font-display text-2xl text-ink mb-6">Profile Information</h2>
              <p className="text-ink-soft mb-8">Update your account details and addresses here.</p>
              {/* Form placeholder */}
              <div className="space-y-4 max-w-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-ink-muted mb-1 block">First Name</label>
                    <input type="text" defaultValue="Alex" className="w-full bg-transparent border-b border-sand-dark py-2 text-sm focus:outline-none focus:border-ink" />
                  </div>
                  <div>
                    <label className="text-xs text-ink-muted mb-1 block">Last Name</label>
                    <input type="text" defaultValue="Doe" className="w-full bg-transparent border-b border-sand-dark py-2 text-sm focus:outline-none focus:border-ink" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-ink-muted mb-1 block">Email</label>
                  <input type="email" defaultValue="alex.doe@example.com" className="w-full bg-transparent border-b border-sand-dark py-2 text-sm focus:outline-none focus:border-ink" />
                </div>
                <button className="bg-ink text-cream-light px-6 py-2 rounded-full text-sm font-medium mt-4 hover:bg-ink-soft transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div>
              <h2 className="font-display text-2xl text-ink mb-6">Your Wishlist</h2>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Heart className="w-12 h-12 text-sand-dark mb-4" />
                <p className="text-ink font-medium mb-2">No items saved yet</p>
                <p className="text-sm text-ink-muted max-w-xs mb-6">Browse our collections and save your favorite pieces for later.</p>
                <Link href="/products" className="bg-ink text-cream-light px-6 py-2 rounded-full text-sm font-medium hover:bg-ink-soft transition-colors">
                  Discover Products
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="font-display text-2xl text-ink mb-6">Account Settings</h2>
              <p className="text-ink-soft">Manage notifications and security preferences.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
