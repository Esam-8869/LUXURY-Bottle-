import React from 'react';
import { cn } from './Button';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'amber' | 'red' | 'green';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: "bg-ink text-cream-light",
    outline: "border border-sand-dark text-ink",
    amber: "bg-amber-100 text-amber-800 border border-amber-200",
    red: "bg-red-100 text-red-800 border border-red-200",
    green: "bg-green-100 text-green-800 border border-green-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
