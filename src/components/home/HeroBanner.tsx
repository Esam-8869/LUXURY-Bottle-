'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn, Button } from '../ui/Button';

export function HeroBanner() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const headline = "THE NEW COLLECTION";
  const words = headline.split(" ");

  return (
    <section className="relative w-full h-[100svh] overflow-hidden bg-ink">
      {/* Video Background */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
        poster="/images/hero-placeholder.jpg"
      >
        <source src="/videos/hero-placeholder.mp4" type="video/mp4" />
      </video>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/15 to-ink/35" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end items-center pb-24 md:pb-32 px-4 text-center z-10">
        
        {/* Eyebrow */}
        <div className="overflow-hidden mb-6">
          <p 
            className={cn(
              "text-[11px] text-cream-light uppercase tracking-[0.2em] transition-transform duration-[800ms] ease-luxury",
              isLoaded ? "translate-y-0" : "translate-y-full"
            )}
            style={{ transitionDelay: '400ms' }}
          >
            Spring / Summer 2026
          </p>
        </div>

        {/* Headline */}
        <h1 className="font-display text-white text-[clamp(3rem,8vw,7rem)] leading-display flex flex-wrap justify-center gap-x-4 max-w-5xl mx-auto mb-8">
          {words.map((word, i) => (
            <div key={i} className="overflow-hidden pb-2">
              <span 
                className={cn(
                  "block transition-transform duration-[1000ms] ease-luxury",
                  isLoaded ? "translate-y-0" : "translate-y-[120%]"
                )}
                style={{ transitionDelay: `${600 + (i * 80)}ms` }}
              >
                {word}
              </span>
            </div>
          ))}
        </h1>

        {/* Subtext */}
        <p 
          className={cn(
            "text-base text-white/75 max-w-md mx-auto mb-10 transition-all duration-cinematic ease-luxury",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: '900ms' }}
        >
          Discover uncompromising luxury and utility. Designed for the everyday.
        </p>

        {/* CTA */}
        <div
          className={cn(
            "transition-all duration-cinematic ease-luxury",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: '1100ms' }}
        >
          <Link href="/products">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-dusty-rose hover:text-ink hover:border-dusty-rose">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center overflow-hidden h-16 w-px">
        <div className="w-full h-full bg-white/30" />
        <div className="absolute top-0 w-full h-1/2 bg-white animate-scroll-indicator" />
      </div>
    </section>
  );
}
