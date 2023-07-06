/** @type {import('tailwindcss').Config} */
const { createThemes } = require('tw-colors');

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        greycliff: ['greycliff-cf', 'sans-serif']
      }
    },
  },
  plugins: [
    createThemes({
      'bright-side': {
        'primary': 'black',
        'secondary': 'white',
      },
      'dark-night': {
        'primary': 'white',
        'primary-100': '#333333',
        'secondary': 'black',
        'link': '#bbc7ef',
      },
      'space-grey': {
        'primary': 'white',
        'secondary': 'grey',
      },
    })
  ],
}

