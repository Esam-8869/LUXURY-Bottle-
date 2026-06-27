import React from 'react';
import Link from 'next/link';

const footerLinks = {
  shop: [
    { name: 'Children', href: '/categories/children' },
    { name: 'Women', href: '/categories/women' },
    { name: 'Aesthetic Collection', href: '/categories/aesthetic-collection' },
    { name: 'All Products', href: '/products' },
  ],
  help: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Shipping', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Contact Us', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookie-policy' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-ink-soft text-cream-light pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-1">
            <Link href="/" className="font-display text-3xl tracking-display font-medium block mb-4">
              BOTTLE
            </Link>
            <p className="text-sm text-sand-dark mb-6 max-w-xs">
              The world's finest crafted bottles, designed with uncompromising luxury and utility.
            </p>
            {/* Social Icons Placeholder */}
            <div className="flex space-x-4">
              <div className="w-8 h-8 rounded-full border border-sand-dark flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer">IN</div>
              <div className="w-8 h-8 rounded-full border border-sand-dark flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer">TW</div>
              <div className="w-8 h-8 rounded-full border border-sand-dark flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer">FB</div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold tracking-caps uppercase text-sm mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-sand-dark">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-dusty-rose transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold tracking-caps uppercase text-sm mb-6">Help</h4>
            <ul className="space-y-4 text-sm text-sand-dark">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-dusty-rose transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold tracking-caps uppercase text-sm mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-sand-dark">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-dusty-rose transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-ink-muted/30 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-sand-dark">
          <p>&copy; {new Date().getFullYear()} Bottle Inc. All rights reserved.</p>
          <div className="flex space-x-3 mt-4 md:mt-0">
            {/* Payment Icons Placeholder */}
            <span className="opacity-70">Stripe</span>
            <span className="opacity-70">Razorpay</span>
            <span className="opacity-70">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
