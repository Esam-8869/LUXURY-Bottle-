import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          light: "#EDEEE9",
        },
        warm: {
          white: "#F5EBE1",
        },
        blush: {
          mist: "#E3D5CA",
        },
        sand: {
          dark: "#D6CCC2",
        },
        dusty: {
          rose: "#D7BDB0",
        },
        ink: {
          DEFAULT: "#1A1A1A",
          soft: "#4A4A4A",
          muted: "#8A8A8A",
        },
        glass: {
          DEFAULT: "rgba(245, 235, 225, 0.72)",
          border: "rgba(214, 204, 194, 0.35)",
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant-garamond)', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      fontSize: {
        'xs': 'clamp(0.625rem, 0.5vw + 0.5rem, 0.75rem)',
        'sm': 'clamp(0.75rem, 0.6vw + 0.6rem, 0.875rem)',
        'base': 'clamp(0.875rem, 0.8vw + 0.7rem, 1rem)',
        'md': 'clamp(1rem, 1vw + 0.75rem, 1.125rem)',
        'lg': 'clamp(1.125rem, 1.2vw + 0.8rem, 1.5rem)',
        'xl': 'clamp(1.5rem, 2vw + 1rem, 2.25rem)',
        '2xl': 'clamp(2.25rem, 4vw + 1.5rem, 4rem)',
        '3xl': 'clamp(3rem, 6vw + 2rem, 7rem)',
      },
      letterSpacing: {
        display: '-0.03em',
        heading: '-0.015em',
        body: '0em',
        caps: '0.1em',
      },
      lineHeight: {
        display: '1.0',
        heading: '1.15',
        body: '1.65',
        ui: '1.3',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '24px',
        6: '32px',
        7: '48px',
        8: '64px',
        9: '96px',
        10: '128px',
        11: '192px',
        12: '256px',
      },
      transitionDuration: {
        instant: '80ms',
        fast: '160ms',
        normal: '300ms',
        slow: '500ms',
        cinematic: '900ms',
        hero: '1400ms',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
        decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
        accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        luxury: 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        pill: '9999px',
        card: '24px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(26,26,26,0.04)',
        md: '0 4px 12px rgba(26,26,26,0.06), 0 1px 3px rgba(26,26,26,0.04)',
        lg: '0 12px 40px rgba(26,26,26,0.08), 0 4px 12px rgba(26,26,26,0.04)',
        xl: '0 24px 80px rgba(26,26,26,0.10), 0 8px 24px rgba(26,26,26,0.05)',
        glass: '0 8px 32px rgba(180,160,145,0.15), inset 0 1px 0 rgba(255,255,255,0.6)',
        product: '0 20px 60px rgba(180,160,145,0.20)',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        'scroll-indicator': 'scroll 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
};
export default config;
