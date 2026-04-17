/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          container: "var(--primary-container)",
          fixed: "var(--primary-fixed)",
          "fixed-dim": "var(--primary-fixed-dim)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          container: "var(--secondary-container)",
          fixed: "var(--secondary-fixed)",
          "fixed-dim": "var(--secondary-fixed-dim)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Material Design 3 Surface System
        surface: {
          DEFAULT: "var(--surface)",
          container: "var(--surface-container)",
          "container-low": "var(--surface-container-low)",
          "container-lowest": "var(--surface-container-lowest)",
          "container-high": "var(--surface-container-high)",
          "container-highest": "var(--surface-container-highest)",
          dim: "var(--surface-dim)",
          bright: "var(--surface-bright)",
          variant: "var(--surface-variant)",
        },
        tertiary: {
          DEFAULT: "var(--tertiary)",
          foreground: "var(--on-tertiary)",
          container: "var(--tertiary-container)",
          fixed: "var(--tertiary-fixed)",
          "fixed-dim": "var(--tertiary-fixed-dim)",
        },
        outline: {
          DEFAULT: "var(--outline)",
          variant: "var(--outline-variant)",
        },
        // Material Design 3 "On" colors
        "on-surface": "var(--on-surface)",
        "on-surface-variant": "var(--on-surface-variant)",
        "on-primary": "var(--on-primary)",
        "on-secondary": "var(--on-secondary)",
        "on-tertiary": "var(--on-tertiary)",
        "on-tertiary-container": "var(--on-tertiary-container)",
        "on-secondary-container": "var(--on-secondary-container)",
        "on-primary-container": "var(--on-primary-container)",
        "on-secondary-fixed": "var(--on-secondary-fixed)",
        "on-tertiary-fixed": "var(--on-tertiary-fixed)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shimmer": "shimmer 2s infinite linear",
        "float": "float 3s ease-in-out infinite",
        "slide-up": "slide-up 0.4s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
      fontFamily: {
        sans: ["'Manrope'", "'PingFang SC'", "'Noto Sans SC'", "system-ui", "sans-serif"],
        serif: ["'Newsreader'", "'Noto Serif SC'", "Georgia", "serif"],
        headline: ["'Newsreader'", "serif"],
        body: ["'Manrope'", "sans-serif"],
        label: ["'Manrope'", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
