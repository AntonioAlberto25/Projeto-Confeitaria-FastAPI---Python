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
        primary: {
          DEFAULT: "#874c3c",
          container: "#a46453",
          fixed: "#ffdbd2",
          on: "#ffffff",
        },
        secondary: {
          DEFAULT: "#5d5e5f",
          container: "#e0dfe0",
        },
        tertiary: {
          DEFAULT: "#21665c",
          container: "#3e8074",
          fixed: "#adefe2",
        },
        surface: {
          DEFAULT: "#f9f9f9",
          bright: "#f9f9f9",
          dim: "#dadada",
          container: {
            lowest: "#ffffff",
            low: "#f3f3f3",
            DEFAULT: "#eeeeee",
            high: "#e8e8e8",
            highest: "#e2e2e2",
          },
        },
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
        },
      },
      fontFamily: {
        manrope: ["var(--font-manrope)", "sans-serif"],
        jakarta: ["var(--font-jakarta)", "sans-serif"],
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
      },
      boxShadow: {
        atmospheric: "0px 12px 32px rgba(83, 67, 64, 0.06)",
      },
      spacing: {
        "3.5": "0.875rem",
        "7": "1.75rem",
        "10": "3.5rem",
      },
    },
  },
  plugins: [],
}
