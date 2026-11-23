/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#1e40af',
          600: '#1e3a8a',
          700: '#14213d',
        },
        edu: {
          paper: '#FAF8F3',
          sheet: '#FFFDF8',
          recessed: '#F2EFE6',
          line: '#E5DEC9',
          lineStrong: '#CFC6AE',
          ink: '#14213D',
          inkSecondary: '#3D4B66',
          inkMuted: '#5C6B85',
          cobalt: '#1E40AF',
          cobaltHover: '#1E3A8A',
          cobaltSoft: '#EFF6FF',
          amber: '#B45309',
          amberSoft: '#FEF3C7',
          amberBorder: '#FCD34D',
          pine: '#15803D',
          pineSoft: '#DCFCE7',
        },
      },
    },
  },
  plugins: [],
}
