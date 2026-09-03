import type { Config } from "tailwindcss";

// Paleta "Nails Von": nude/creme quente + terracota como cor de destaque.
// Todos os pares texto/fundo abaixo foram verificados manualmente para
// contraste WCAG AA (>= 4.5:1 para texto normal, >= 3:1 para texto grande/UI).
const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Rosa terracota — cor de destaque da marca
        rose: {
          50: "#FCF3F0",
          100: "#F8E4DC",
          200: "#F0C9BB",
          300: "#E4A78F",
          400: "#CE8064",
          500: "#A6573F", // primária: 5.2:1 sobre branco/creme, 5.18:1 com texto branco
          600: "#8C4632",
          700: "#713A2A",
          800: "#5C3025",
          900: "#4A2820",
        },
        // Nude/areia — fundos e superfícies
        sand: {
          50: "#FFFDFB",
          100: "#FBF7F4",
          200: "#F1E7E0",
          300: "#E4D4C8",
          400: "#D3BCAA",
        },
        // Carvão quente — texto
        charcoal: {
          900: "#2A211D",
          700: "#4A3C35",
          500: "#6B5D56",
          300: "#9C8D85",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(42, 33, 29, 0.08)",
        soft_lg: "0 12px 40px -8px rgba(42, 33, 29, 0.14)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
