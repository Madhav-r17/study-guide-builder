/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF8F4",
        ink: "#1C1B1A",
        accent: "#3D5A80",
        "accent-dark": "#2C4259",
        border: "#E8DCC8",
        warn: "#9B2C2C",
        // Category colors — desaturated, from one consistent family
        cat: {
          dbms: "#3D5A80", // steady blue
          os: "#3D7A6E",   // teal
          dsa: "#B8862F",  // amber
          se: "#6B5B95",   // violet
        },
      },
      fontFamily: {
        serif: ["Source Serif 4", "Lora", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(28, 27, 26, 0.08), 0 1px 2px rgba(28, 27, 26, 0.06)",
        "card-hover": "0 4px 12px rgba(28, 27, 26, 0.10), 0 2px 4px rgba(28, 27, 26, 0.06)",
      },
    },
  },
  plugins: [],
};