/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Primary: Rosa Seco ---
        primary: {
          DEFAULT: "#915160",
          dim: "#834554",
          container: "#fbabbc",
          fixed: "#fbabbc",
          "fixed-dim": "#eb9eae",
          on: "#ffffff",
          "on-container": "#622a39",
          "on-fixed": "#481624",
          "on-fixed-variant": "#6d3342",
        },
        // --- Secondary: Caramelo ---
        secondary: {
          DEFAULT: "#795f4a",
          dim: "#6c533f",
          container: "#ffdcc2",
          fixed: "#ffdcc2",
          "fixed-dim": "#f1ceb4",
          on: "#ffffff",
          "on-container": "#654d39",
          "on-fixed": "#513b28",
          "on-fixed-variant": "#705642",
        },
        // --- Tertiary: Baunilha / Dourado ---
        tertiary: {
          DEFAULT: "#6e6436",
          dim: "#62582b",
          container: "#fceeb3",
          fixed: "#fceeb3",
          "fixed-dim": "#eee0a6",
          on: "#ffffff",
          "on-container": "#62582b",
          "on-fixed": "#4f461b",
          "on-fixed-variant": "#6c6334",
        },
        // --- Surface: Creme/Baunilha ---
        surface: {
          DEFAULT: "#fffbff",
          bright: "#fffbff",
          dim: "#e6e3d3",
          tint: "#915160",
          "inverse": "#0f0e0b",
          "on-inverse": "#9f9d97",
          container: {
            lowest: "#ffffff",
            low: "#fdf9f1",
            DEFAULT: "#f7f3ea",
            high: "#f1eee2",
            highest: "#ece8db",
          },
        },
        // --- Error ---
        error: {
          DEFAULT: "#b33938",
          container: "#f56965",
          dim: "#70030f",
          on: "#ffffff",
          "on-container": "#65000b",
        },
        // --- Background / On-surface ---
        background: "#fffbff",
        "on-background": "#39382f",
        "on-surface": "#39382f",
        "on-surface-variant": "#66655a",
        outline: "#838175",
        "outline-variant": "#bcb9ad",
        "inverse-primary": "#fbabbc",
        // --- Legacy aliases (for compatibility) ---
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#fdf9f1",
        "surface-container": "#f7f3ea",
        "surface-container-high": "#f1eee2",
        "surface-container-highest": "#ece8db",
        "tertiary-fixed": "#fceeb3",
        "error-container": "#f56965",
      },
      fontFamily: {
        // Plus Jakarta Sans: display + headlines (Stitch spec)
        display: ["var(--font-jakarta)", "sans-serif"],
        jakarta: ["var(--font-jakarta)", "sans-serif"],
        // Inter: body + labels (Stitch spec)
        inter: ["var(--font-inter)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        // Remove Manrope — not in Stitch spec
      },
      borderRadius: {
        // Stitch: ROUND_FULL para chips, lg para cards
        sm: "0.5rem",
        DEFAULT: "1rem",
        md: "1rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        full: "9999px",
      },
      boxShadow: {
        // Warm ambient shadow — usa on_surface warm (#39382f), não preto puro
        atmospheric: "0px 12px 48px -4px rgba(57, 56, 47, 0.05)",
        float: "0px 8px 32px -4px rgba(57, 56, 47, 0.08)",
        lift: "0px 4px 16px -2px rgba(57, 56, 47, 0.06)",
      },
      spacing: {
        "3.5": "0.875rem",
        "7": "1.75rem",
        "10": "3.5rem",
        "14": "3.5rem",
        "18": "4.5rem",
      },
      letterSpacing: {
        "editorial": "-0.02em",
        "label": "0.03em",
      },
    },
  },
  plugins: [],
}
