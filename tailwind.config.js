const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: colors.slate,
        primary: colors.slate,
      },
    },
  },
  plugins: [
    // require('@danielfgray/tw-heropatterns'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
