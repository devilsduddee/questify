/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
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
        background: "#0F172A",
        foreground: "hsl(var(--foreground))",
        "background-night": "#0F172A",
        "background-deep": "#1E293B",
        primary: {
          DEFAULT: "#6D28D9",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#F59E0B",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "hsl(var(--destructive-foreground))",
        },
        "boss-red": "#EF4444",
        success: {
          DEFAULT: "#10B981",
        },
        "success-green": "#10B981",
        muted: {
          DEFAULT: "#1E293B",
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
          DEFAULT: "#1E293B",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Cinzel", "serif"],
        pixel: ['"Press Start 2P"', "cursive"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: 1, filter: "brightness(1)" },
          "50%": { opacity: 0.8, filter: "brightness(1.2)" },
        },
        "twinkle": {
          "0%, 100%": { opacity: 0.2, transform: "scale(0.8)" },
          "50%": { opacity: 1, transform: "scale(1.2)" },
        },
        "sparkle": {
          "0%, 100%": { opacity: 0, transform: "scale(0) rotate(0deg)" },
          "50%": { opacity: 1, transform: "scale(1) rotate(180deg)" },
        },
        "magic-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: 0.8 },
          "50%": { transform: "scale(1.05)", opacity: 1 },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "twinkle": "twinkle 3s ease-in-out infinite",
        "sparkle": "sparkle 2s ease-in-out infinite",
        "magic-pulse": "magic-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
