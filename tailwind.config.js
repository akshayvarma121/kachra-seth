/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'], // Sets Outfit as default
      },
      colors: {
        brand: {
          neon: '#39FF14',    // Cyberpunk Green
          dark: '#022c22',    // Deep Forest
          light: '#ecfdf5',   // Mint
        }
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px rgba(0,0,0,1)', // Brutalist Shadow
        'neo-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
        'glow': '0 0 20px rgba(57, 255, 20, 0.5)',
      },
      // 👇 NEW ANIMATIONS ADDED HERE
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(57, 255, 20, 0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(57, 255, 20, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}