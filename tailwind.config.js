/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cozy: {
          bg: '#1a0800',
          dark: '#3d1a0a',
          rust: '#8b3a1a',
          amber: '#c4621a',
          glow: '#e8a84a',
          deep: '#0d0d1a',
        },
        digital: {
          void: '#0a0a12',
          space: '#0d0d1a',
          cyan: '#00ffe1',
          purple: '#b400ff',
          surface: '#1a1a2e',
          text: '#ffffff',
          dim: '#8f90a6',
        }
      },
      fontFamily: {
        grotesk: ['Cabinet Grotesk', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      animation: {
        'lamp-flicker': 'lampFlicker 6s infinite ease-in-out',
        'monitor-glow': 'monitorGlow 4s infinite ease-in-out',
        'spin-slow': 'spin 12s linear infinite',
        'spin-record': 'spin 2.4s linear infinite',
        'float-slow': 'floatSlow 7s ease-in-out infinite',
        'float-reverse': 'floatReverse 8s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        lampFlicker: {
          '0%, 100%': { opacity: '0.95', filter: 'brightness(1)' },
          '28%': { opacity: '0.95', filter: 'brightness(1)' },
          '30%': { opacity: '0.75', filter: 'brightness(0.85)' },
          '32%': { opacity: '0.98', filter: 'brightness(1.05)' },
          '70%': { opacity: '0.95', filter: 'brightness(1)' },
          '72%': { opacity: '0.82', filter: 'brightness(0.9)' },
          '73%': { opacity: '0.95', filter: 'brightness(1)' },
        },
        monitorGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '0.95', transform: 'scale(1.02)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
      }
    },
  },
  plugins: [],
}
