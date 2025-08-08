/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "winky-rough": "Winky Rough",
      },
      colors: {
        "mybg": "#F2EDDF",
        "myPrimary": "#3754DB",
        "mySecondary": "#FBBE37",
      },
      screens: {
        "4xl": "1921px",
        'max-992': { 'max': '992px' },
        'max-768': { 'max': '768px' },
        'max-576': { 'max': '576px' },
      },
    },
  },
  plugins: [],
}

