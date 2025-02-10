/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Per la directory App
    "./components/**/*.{js,ts,jsx,tsx}", // Per i componenti
    "./src/**/*.{js,ts,jsx,tsx}", // Se i file sono in src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
