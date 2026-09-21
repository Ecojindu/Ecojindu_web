import type { Config } from "tailwindcss";

/**
 * Ecojindu tokens — one action green, neutrals for surfaces, forest reserved
 * for chrome (header accents / footer) and headings.
 *
 * cream    page + section backgrounds
 * moss     #3D7223  primary actions (clears 4.5:1 with white)
 * leaf     #7CB342  decorative accent only — never body text on light
 * forest   #2F5233  headings, footer, logo mark
 * ink      body text / muted captions
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1120px" },
    },
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F8F7F2",
          50: "#FCFBF7",
          100: "#F5F4EE",
          200: "#EFECE2",
          300: "#E2DFD3",
          400: "#CEC9BA",
        },
        leaf: { DEFAULT: "#7CB342", light: "#9DE25D", dark: "#5A8B28" },
        moss: { DEFAULT: "#1F4A1C", light: "#2D6828", dark: "#163814" },
        forest: { DEFAULT: "#1A361D", light: "#2C542F", dark: "#111A13" },
        teal: { DEFAULT: "#1F8A6F", light: "#36B392", dark: "#14614E" },
        ink: { DEFAULT: "#141716", muted: "#353D38", soft: "#545E58" },
        clay: { DEFAULT: "#B84A24", light: "#FAF1EC", dark: "#8A3214" },
        surface: {
          DEFAULT: "#FFFFFF",
          raised: "#FFFFFF",
          sunken: "#F8F7F2",
        },

        border: "#E2DFD3",
        input: "#E2DFD3",
        ring: "#1F4A1C",
        background: "#F8F7F2",
        foreground: "#141716",
        primary: { DEFAULT: "#1F4A1C", foreground: "#FFFFFF" },
        secondary: { DEFAULT: "#F5F4EE", foreground: "#1A361D" },
        destructive: { DEFAULT: "#B84A24", foreground: "#FFFFFF" },
        muted: { DEFAULT: "#F5F4EE", foreground: "#545E58" },
        accent: { DEFAULT: "#1F8A6F", foreground: "#FFFFFF" },
        card: { DEFAULT: "#FFFFFF", foreground: "#141716" },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-sm": ["1.875rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "display-md": ["2.5rem", { lineHeight: "1.15", letterSpacing: "-0.025em" }],
        "display-lg": ["3.25rem", { lineHeight: "1.08", letterSpacing: "-0.03em" }],
        "display-xl": ["4rem", { lineHeight: "1.04", letterSpacing: "-0.035em" }],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(21,24,26,0.04), 0 4px 16px rgba(21,24,26,0.06)",
        lift: "0 2px 4px rgba(21,24,26,0.05), 0 12px 32px rgba(21,24,26,0.10)",
        ring: "0 0 0 3px rgba(61,114,35,0.22)",
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
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "draw-line": {
          from: { strokeDashoffset: "1000" },
          to: { strokeDashoffset: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "shimmer 1.6s infinite",
        "draw-line": "draw-line 2.4s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
