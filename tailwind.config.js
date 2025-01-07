/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2C742F', // main green
          dark: '#236027',    // darker shade
          light: '#368939',   // lighter shade
        },
        secondary: {
          DEFAULT: '#E6B31E', // warm yellow
          dark: '#C99B19',    // darker shade
          light: '#F4C439',   // lighter shade
        },
        neutral: {
          lightest: '#F9F9F9', // for backgrounds
          light: '#F3F3F3',    // for secondary backgrounds
          DEFAULT: '#666666',   // for text
          dark: '#333333',     // for headings
        }
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [],
}

