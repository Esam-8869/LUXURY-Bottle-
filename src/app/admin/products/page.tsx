'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface Product {
  id: string;
  name: string;
  category: { name: string } | null;
  basePrice: string | number;
  isActive: boolean;
  variants: { stockQuantity: number }[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/products${search ? `?search=${encodeURIComponent(search)}` : ''}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const json = await res.json();
      setProducts(json.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setProducts(products.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-md text-sm outline-none focus:border-ink transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-stone-400">
                    Loading products...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-stone-500">
                    No products found. <Link href="/admin/products/new" className="text-ink underline">Add one now.</Link>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const totalStock = product.variants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) || 0;
                  const status = product.isActive ? (totalStock > 0 ? 'ACTIVE' : 'OUT OF STOCK') : 'INACTIVE';
                  
                  return (
                    <tr key={product.id} className="hover:bg-stone-50 transition-colors group">
                      <td className="px-6 py-4 font-medium text-ink flex items-center gap-3">
                        <div className="w-10 h-10 bg-stone-100 rounded-md"></div>
                        {product.name}
                      </td>
                      <td className="px-6 py-4">{product.category?.name || 'Uncategorized'}</td>
                      <td className="px-6 py-4">${Number(product.basePrice).toFixed(2)}</td>
                      <td className="px-6 py-4">{totalStock}</td>
                      <td className="px-6 py-4">
                        <span className={twMerge(
                          clsx(
                            'px-2 py-1 text-xs font-medium rounded-full',
                            status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                            status === 'INACTIVE' ? 'bg-stone-100 text-stone-700' :
                            'bg-red-100 text-red-700'
                          )
                        )}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-stone-400 hover:text-ink transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="p-1.5 text-stone-400 hover:text-red-600 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-stone-200 flex items-center justify-between text-sm text-stone-500">
          <span>Showing {products.length} entries</span>
        </div>
      </div>
    </div>
  );
}
