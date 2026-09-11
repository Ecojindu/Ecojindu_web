import type { Config } from "tailwindcss";

/**
 * Ecojindu's identity, expressed as tokens.
 *
 * cream    #EAE8DB  page background — warm, not clinical
 * leaf     #7CB342  primary green
 * moss     #4C8C2B  darker green for actions and links
 * forest   #2F5233  deep green for headers and headings
 * teal     #2BAE8E  accent, used sparingly for highlights
 * ink      #15181A  near-black body text
 * clay     #C4562F  errors only
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
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        cream: {
          DEFAULT: "#EAE8DB",
          50: "#FAFAF6",
          100: "#F5F4EC",
          200: "#EAE8DB",
          300: "#E2E0D2",
          400: "#D4D1BF",
        },
        leaf: { DEFAULT: "#7CB342", light: "#9CCB6A", dark: "#68A032" },
        moss: { DEFAULT: "#4C8C2B", light: "#5FA338", dark: "#3D7222" },
        forest: { DEFAULT: "#2F5233", light: "#3F6B44", dark: "#223D25" },
        teal: { DEFAULT: "#2BAE8E", light: "#4FC7A9", dark: "#1F7A63" },
        ink: { DEFAULT: "#15181A", muted: "#4A5450", soft: "#8A918D" },
        clay: { DEFAULT: "#C4562F", light: "#FBF3EE", dark: "#9E3F1E" },

        border: "#E2E0D2",
        input: "#E2E0D2",
        ring: "#4C8C2B",
        background: "#EAE8DB",
        foreground: "#15181A",
        primary: { DEFAULT: "#4C8C2B", foreground: "#FFFFFF" },
        secondary: { DEFAULT: "#F5F4EC", foreground: "#2F5233" },
        destructive: { DEFAULT: "#C4562F", foreground: "#FFFFFF" },
        muted: { DEFAULT: "#F5F4EC", foreground: "#8A918D" },
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
        // Slightly tighter tracking on display sizes — the brand reads confident.
        "display-sm": ["1.875rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "display-md": ["2.5rem", { lineHeight: "1.15", letterSpacing: "-0.025em" }],
        "display-lg": ["3.25rem", { lineHeight: "1.08", letterSpacing: "-0.03em" }],
        "display-xl": ["4rem", { lineHeight: "1.04", letterSpacing: "-0.035em" }],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(47,82,51,0.04), 0 4px 16px rgba(47,82,51,0.06)",
        lift: "0 2px 4px rgba(47,82,51,0.05), 0 12px 32px rgba(47,82,51,0.10)",
        ring: "0 0 0 3px rgba(76,140,43,0.18)",
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
