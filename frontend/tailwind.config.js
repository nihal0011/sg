/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F4F7F4',
          100: '#E6EDE7',
          200: '#CDDC CF',
          300: '#AEC4B2',
          400: '#8CA992',
          500: '#6B8E72',
          600: '#527258',
          700: '#405A45',
          800: '#2E4132',
          900: '#1D2A20',
          950: '#0F1611',
        },
        cream: {
          50: '#FDFAF5',
          100: '#FAF6EE',
          200: '#F5ECDC',
          300: '#EDE0C6',
          400: '#E1CFA9',
          500: '#CDB788',
        },
        blush: {
          50: '#FDF7F7',
          100: '#FCEEEE',
          200: '#F8DADA',
          300: '#F2B8B8',
          400: '#E98D8D',
          500: '#DC6767',
        },
        gold: {
          50: '#FCF9EE',
          100: '#F9F2D3',
          200: '#F2E2A1',
          300: '#E9CE67',
          400: '#DFB835',
          500: '#C99D1C',
          600: '#A47D14',
          700: '#7F5E12',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(64, 90, 69, 0.08)',
        'soft-lg': '0 12px 30px -4px rgba(64, 90, 69, 0.12)',
        'glow-gold': '0 0 25px rgba(223, 184, 53, 0.25)',
      }
    },
  },
  plugins: [],
}
