/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'pitch-black': '#070f0b',
        turf: '#10241a',
        'turf-line': '#1f3f2c',
        chalk: '#f3f1ea',
        sage: '#8aa290',
        floodlight: '#f5c518',
        'live-red': '#e6484f',
      },
      fontFamily: {
        display: ['Rajdhani', 'Arial Narrow', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};