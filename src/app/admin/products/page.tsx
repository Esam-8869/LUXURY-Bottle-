'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const products = [
  { id: 'PROD-01', name: 'The Obsidian Flask', category: 'Thermos', price: '$120.00', stock: 45, status: 'ACTIVE' },
  { id: 'PROD-02', name: 'Aura Glass Carafe', category: 'Glassware', price: '$85.00', stock: 12, status: 'LOW STOCK' },
  { id: 'PROD-03', name: 'Titanium Travel Mug', category: 'Travel', price: '$145.00', stock: 0, status: 'OUT OF STOCK' },
  { id: 'PROD-04', name: 'Minimalist Water Bottle', category: 'Everyday', price: '$65.00', stock: 150, status: 'ACTIVE' },
];

export default function AdminProductsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-ink mb-1">Products</h1>
          <p className="text-stone-500 text-sm">Manage your product inventory and catalogs.</p>
        </div>
        <Button as={Link} href="/admin/products/new" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-md text-sm outline-none focus:border-ink transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium border border-stone-200 rounded-md text-stone-600 hover:bg-stone-50 transition-colors">
              Filter
            </button>
            <button className="px-3 py-1.5 text-sm font-medium border border-stone-200 rounded-md text-stone-600 hover:bg-stone-50 transition-colors">
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-600">
            <thead className="bg-stone-50 text-stone-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Product Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-stone-50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-ink flex items-center gap-3">
                    <div className="w-10 h-10 bg-stone-100 rounded-md"></div>
                    {product.name}
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">{product.price}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={twMerge(
                      clsx(
                        'px-2 py-1 text-xs font-medium rounded-full',
                        product.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                        product.status === 'LOW STOCK' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      )
                    )}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-stone-400 hover:text-ink transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-stone-400 hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-stone-200 flex items-center justify-between text-sm text-stone-500">
          <span>Showing 1 to 4 of 4 entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-stone-200 rounded hover:bg-stone-50 disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 border border-stone-200 rounded hover:bg-stone-50 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
