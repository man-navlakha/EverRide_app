/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        'syne-bold': ['Syne-Bold'],
        'syne-semibold': ['Syne-SemiBold'],
        'raleway-medium': ['Raleway-Medium'],
        'poppins-regular': ['Poppins-Regular'],
        'poppins-light': ['Poppins-Light'],
        'poppins-medium': ['Poppins-Medium'],
      },
      fontSize: {
        h1: '32px',
        h2: '24px',
        subtitle: '18px',
        body: '16px',
        caption: '14px',
        button: '16px',
      },
    },
  },
  plugins: [],
};
