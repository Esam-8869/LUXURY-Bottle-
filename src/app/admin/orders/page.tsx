'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Eye, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const orders = [
  { id: '#ORD-001', customer: 'Emma Thompson', email: 'emma.t@example.com', date: '2023-10-15', items: 2, total: '$450.00', status: 'PENDING', payment: 'PAID' },
  { id: '#ORD-002', customer: 'Michael Chen', email: 'm.chen@example.com', date: '2023-10-14', items: 1, total: '$120.00', status: 'SHIPPED', payment: 'PAID' },
  { id: '#ORD-003', customer: 'Sarah Jenkins', email: 's.jenkins@example.com', date: '2023-10-14', items: 5, total: '$890.00', status: 'DELIVERED', payment: 'PAID' },
  { id: '#ORD-004', customer: 'James Wilson', email: 'j.wilson@example.com', date: '2023-10-13', items: 1, total: '$250.00', status: 'PROCESSING', payment: 'PENDING' },
  { id: '#ORD-005', customer: 'Amanda Clarke', email: 'aclarke@example.com', date: '2023-10-12', items: 3, total: '$345.00', status: 'CANCELLED', payment: 'REFUNDED' },
];

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-ink mb-1">Orders</h1>
          <p className="text-stone-500 text-sm">View and manage customer orders.</p>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search by order ID or customer..." 
              className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-md text-sm outline-none focus:border-ink transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium border border-stone-200 rounded-md text-stone-600 hover:bg-stone-50 transition-colors">
              Filter Status
            </button>
            <button className="px-3 py-1.5 text-sm font-medium border border-stone-200 rounded-md text-stone-600 hover:bg-stone-50 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-600">
            <thead className="bg-stone-50 text-stone-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-ink">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-ink">{order.customer}</span>
                      <span className="text-xs text-stone-500">{order.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">
                    <span className={twMerge(
                      clsx(
                        'flex items-center gap-1.5 text-xs font-medium',
                        order.payment === 'PAID' ? 'text-green-600' :
                        order.payment === 'PENDING' ? 'text-yellow-600' : 'text-red-600'
                      )
                    )}>
                      {order.payment === 'PAID' ? <CheckCircle className="w-3.5 h-3.5" /> :
                       order.payment === 'PENDING' ? <Clock className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {order.payment}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={twMerge(
                      clsx(
                        'px-2 py-1 text-xs font-medium rounded-full',
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'PROCESSING' ? 'bg-indigo-100 text-indigo-700' :
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      )
                    )}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{order.total}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-stone-400 hover:text-ink transition-colors opacity-0 group-hover:opacity-100" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-stone-200 flex items-center justify-between text-sm text-stone-500">
          <span>Showing 1 to 5 of 5 entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-stone-200 rounded hover:bg-stone-50 disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 border border-stone-200 rounded hover:bg-stone-50 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
