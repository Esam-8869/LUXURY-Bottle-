'use client';

import React from 'react';
import { ShoppingCart, Users, DollarSign, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const stats = [
  {
    title: 'Total Revenue',
    value: '$124,500',
    trend: '+12.5%',
    isPositive: true,
    icon: DollarSign,
  },
  {
    title: 'Total Orders',
    value: '452',
    trend: '+5.2%',
    isPositive: true,
    icon: ShoppingCart,
  },
  {
    title: 'Active Customers',
    value: '2,103',
    trend: '-1.1%',
    isPositive: false,
    icon: Users,
  },
  {
    title: 'Products Sold',
    value: '1,204',
    trend: '+18.4%',
    isPositive: true,
    icon: Package,
  }
];

const recentOrders = [
  { id: '#ORD-001', customer: 'Emma Thompson', date: '2023-10-15', total: '$450.00', status: 'PENDING' },
  { id: '#ORD-002', customer: 'Michael Chen', date: '2023-10-14', total: '$120.00', status: 'SHIPPED' },
  { id: '#ORD-003', customer: 'Sarah Jenkins', date: '2023-10-14', total: '$890.00', status: 'DELIVERED' },
  { id: '#ORD-004', customer: 'James Wilson', date: '2023-10-13', total: '$250.00', status: 'PROCESSING' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-serif text-ink mb-2">Dashboard</h1>
        <p className="text-stone-500 text-sm">Welcome back. Here is an overview of your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-stone-500">{stat.title}</span>
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-ink">{stat.value}</span>
              <span className={twMerge(clsx('flex items-center text-xs font-medium', stat.isPositive ? 'text-green-600' : 'text-red-600'))}>
                {stat.isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-ink">Recent Orders</h2>
          <button className="text-sm font-medium text-stone-500 hover:text-ink transition-colors">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-600">
            <thead className="bg-stone-50 text-stone-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-ink">{order.id}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">{order.total}</td>
                  <td className="px-6 py-4">
                    <span className={twMerge(
                      clsx(
                        'px-2 py-1 text-xs font-medium rounded-full',
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-stone-100 text-stone-700'
                      )
                    )}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
