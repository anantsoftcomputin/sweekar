const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#f3f1f9',
          100: '#e8e4f3',
          200: '#d1cae7',
          300: '#b9afdb',
          400: '#a294cf',
          500: '#8b79c3',
          600: '#7461b7',
          700: '#5d4d9b',
          800: '#4a3d7d',
          900: '#372c5e',
        },
        accent: {
          pink: '#EC407A',
          orange: '#FFA726',
          blue: '#42A5F5',
          green: '#66BB6A',
        },
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      maxWidth: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
      },
      zIndex: {
        '-10': '-10',
        '60': '60',
        '70': '70',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.lavender.800'),
            a: {
              color: theme('colors.lavender.600'),
              '&:hover': {
                color: theme('colors.lavender.800'),
              },
            },
            h1: {
              color: theme('colors.lavender.900'),
            },
            h2: {
              color: theme('colors.lavender.800'),
            },
            h3: {
              color: theme('colors.lavender.800'),
            },
            h4: {
              color: theme('colors.lavender.800'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}