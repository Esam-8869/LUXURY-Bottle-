'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    basePrice: '',
    categoryId: ''
  });

  const [variants, setVariants] = useState([
    { colorName: '', hexCode: '', sku: '', price: '', stockQuantity: '' }
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVariantChange = (index: number, field: string, value: string) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { colorName: '', hexCode: '', sku: '', price: '', stockQuantity: '' }]);
  };

  const removeVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Basic validation
      if (!formData.name || !formData.slug || !formData.basePrice) {
        throw new Error('Name, slug, and base price are required');
      }

      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        basePrice: parseFloat(formData.basePrice),
        categoryId: formData.categoryId || null,
        variants: variants.map(v => ({
          colorName: v.colorName,
          hexCode: v.hexCode,
          sku: v.sku,
          price: parseFloat(v.price || formData.basePrice),
          stockQuantity: parseInt(v.stockQuantity || '0', 10)
        }))
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create product');
      }

      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 -ml-2 text-stone-400 hover:text-ink transition-colors rounded-full hover:bg-stone-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-serif text-ink mb-1">Add Product</h1>
          <p className="text-stone-500 text-sm">Create a new product and variants.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-100 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-6">
          <h2 className="font-medium text-lg border-b border-stone-100 pb-2">Basic Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Product Name *</label>
              <Input 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="The Obsidian Flask" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">URL Slug *</label>
              <Input 
                name="slug" 
                value={formData.slug} 
                onChange={handleChange} 
                placeholder="the-obsidian-flask" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Base Price (USD) *</label>
              <Input 
                name="basePrice" 
                type="number" 
                step="0.01"
                value={formData.basePrice} 
                onChange={handleChange} 
                placeholder="120.00" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Category ID</label>
              <Input 
                name="categoryId" 
                value={formData.categoryId} 
                onChange={handleChange} 
                placeholder="Optional UUID" 
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-stone-700">Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Detailed product description..." 
                className="w-full min-h-[120px] p-3 border border-stone-200 rounded-md text-sm outline-none focus:border-ink transition-colors resize-y"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-stone-100 pb-2">
            <h2 className="font-medium text-lg">Variants</h2>
            <Button type="button" onClick={addVariant} variant="outline" className="h-8 text-xs gap-1">
              <Plus className="w-3 h-3" /> Add Variant
            </Button>
          </div>
          
          {variants.map((variant, index) => (
            <div key={index} className="p-4 border border-stone-100 rounded-lg bg-stone-50 relative group">
              {variants.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeVariant(index)}
                  className="absolute top-2 right-2 p-1.5 text-stone-400 hover:text-red-500 rounded-md hover:bg-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-600">Color Name</label>
                  <Input 
                    value={variant.colorName} 
                    onChange={(e) => handleVariantChange(index, 'colorName', e.target.value)} 
                    placeholder="Matte Black" 
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-600">Hex Code</label>
                  <div className="flex gap-2">
                    <Input 
                      value={variant.hexCode} 
                      onChange={(e) => handleVariantChange(index, 'hexCode', e.target.value)} 
                      placeholder="#1A1A1A" 
                      className="h-9 text-sm font-mono"
                    />
                    {variant.hexCode && (
                      <div className="w-9 h-9 rounded border border-stone-200 shrink-0" style={{ backgroundColor: variant.hexCode }} />
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-600">SKU</label>
                  <Input 
                    value={variant.sku} 
                    onChange={(e) => handleVariantChange(index, 'sku', e.target.value)} 
                    placeholder="FLASK-BLK" 
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-600">Price (Override)</label>
                  <Input 
                    type="number" 
                    step="0.01"
                    value={variant.price} 
                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)} 
                    placeholder={formData.basePrice || "120.00"} 
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-600">Stock</label>
                  <Input 
                    type="number" 
                    value={variant.stockQuantity} 
                    onChange={(e) => handleVariantChange(index, 'stockQuantity', e.target.value)} 
                    placeholder="50" 
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <Button as={Link} href="/admin/products" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
