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
        // Ini biar warna emas lu bisa dipanggil via class 'text-gold'
        gold: {
          light: "#FFFDE0",
          DEFAULT: "#FFD700",
          dark: "#B8860B",
        },
      },
      backgroundImage: {
        // Custom gradient buat tema glossy lu
        "gold-glossy": "radial-gradient(circle at 35% 30%, #FFFDE0 0%, #FFD700 28%, #E6A800 55%, #B8860B 78%, #7A5C00 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
