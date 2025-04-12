/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        black: '#0f172a', // redefine black as slate-900
        // or redefine slate-900 as black if needed
      },
    },
  },
  plugins: [],
}