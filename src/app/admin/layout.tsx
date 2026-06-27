'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  Users,
  BarChart,
  Settings,
  LogOut,
  Palette
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const adminLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Categories', href: '/admin/categories', icon: Tags },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Coupons', href: '/admin/coupons', icon: Tags },
  { name: 'Homepage Editor', href: '/admin/homepage', icon: Palette },
  { name: 'Integrations', href: '/admin/integrations', icon: Settings },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-stone-200 flex-shrink-0 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-stone-200">
          <Link href="/" className="font-serif text-2xl tracking-widest text-ink">
            BOTTLE.
          </Link>
          <span className="ml-2 text-xs text-stone-500 uppercase tracking-widest">Admin</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {adminLinks.map((link) => {
              const isActive =
                link.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(link.href);
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={twMerge(
                      clsx(
                        'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                        isActive
                          ? 'bg-stone-100 text-ink font-medium'
                          : 'text-stone-600 hover:bg-stone-50 hover:text-ink'
                      )
                    )}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-stone-200">
          <button className="flex items-center gap-3 px-3 py-2 w-full text-sm text-stone-600 hover:bg-stone-50 hover:text-ink rounded-md transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header for Mobile & Actions */}
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6 flex-shrink-0 md:justify-end">
          <div className="md:hidden font-serif text-xl tracking-widest text-ink">
            BOTTLE.
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-medium text-ink">
              AD
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
