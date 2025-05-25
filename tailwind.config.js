/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-purple': {
          light: '#E2D9F3', // Lighter purple for backgrounds, accents
          DEFAULT: '#6B3F99', // Main purple for primary actions, header, footer
          dark: '#4F2D80',  // Darker purple for hover states, text
        },
        'brand-yellow': {
          DEFAULT: '#FDC84F', // Main yellow for highlights, navigation, secondary actions
          dark: '#E0A82E',   // Darker yellow for hover states
        },
        'brand-background': '#FFFFFF',
        'brand-text': '#1A1A1A', // Dark text for readability
        'brand-text-secondary': '#555555', // Lighter text
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        'patrick-hand': ['"Patrick Hand"', 'cursive'],
      },
      borderRadius: {
        'xl': '1rem', // 16px
        '2xl': '1.5rem', // 24px
        '3xl': '2rem', //32px
      },
      boxShadow: {
        'subtle': '0px 4px 12px rgba(0, 0, 0, 0.05)',
        'card': '0px 8px 20px rgba(79, 45, 128, 0.1)', // Purpleish shadow
      }
    },
  },
  plugins: [],
}