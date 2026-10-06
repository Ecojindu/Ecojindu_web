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
          DEFAULT: "#F4F3EE",
          50: "#FAFAF8",
          100: "#F7F6F2",
          200: "#F4F3EE",
          300: "#E8E6DE",
          400: "#D9D6CC",
        },
        leaf: { DEFAULT: "#7CB342", light: "#9CCB6A", dark: "#68A032" },
        moss: { DEFAULT: "#4C8C2B", light: "#5FA338", dark: "#3D7222" },
        forest: { DEFAULT: "#2F5233", light: "#3F6B44", dark: "#223D25" },
        /** Hero photo tint + frosted overlay */
        "hero-tint": { DEFAULT: "#1E4927" },
        /** How-it-works section wash */
        "mint-section": { DEFAULT: "#C5EDCB" },
        teal: { DEFAULT: "#2BAE8E", light: "#4FC7A9", dark: "#1F7A63" },
        ink: { DEFAULT: "#15181A", muted: "#3F4744", soft: "#5C6561" },
        clay: { DEFAULT: "#C4562F", light: "#FBF3EE", dark: "#9E3F1E" },
        surface: {
          DEFAULT: "#FFFFFF",
          raised: "#FFFFFF",
          sunken: "#F4F3EE",
        },

        border: "#E8E6DE",
        input: "#E8E6DE",
        ring: "#3D7223",
        background: "#F4F3EE",
        foreground: "#15181A",
        primary: { DEFAULT: "#3D7223", foreground: "#FFFFFF" },
        secondary: { DEFAULT: "#F7F6F2", foreground: "#2F5233" },
        destructive: { DEFAULT: "#C4562F", foreground: "#FFFFFF" },
        muted: { DEFAULT: "#F7F6F2", foreground: "#5C6561" },
        accent: { DEFAULT: "#2BAE8E", foreground: "#FFFFFF" },
        card: { DEFAULT: "#FFFFFF", foreground: "#15181A" },
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
        "foam-in": {
          from: { opacity: "0", transform: "translateY(10px) scale(0.985)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
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
        "foam-in": "foam-in 0.38s cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "shimmer 1.6s infinite",
        "draw-line": "draw-line 2.4s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
