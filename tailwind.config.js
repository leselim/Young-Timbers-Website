/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // The site is driven by the CSS custom properties in src/index.css.
      // These are mirrored here so any Tailwind utility used alongside the
      // hand-written CSS resolves to the same brand values.
      colors: {
        background: '#f4f4f2',
        surface: '#16171a',
        ink: '#202124',
        'ink-soft': '#6d6d6a',
        'ink-muted': '#a2a29e',
        hairline: '#dcdcd8',
        'hairline-strong': '#c9c9c4',
        error: '#8e3b2f',
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        container: '1080px',
      },
    },
  },
  plugins: [],
};
