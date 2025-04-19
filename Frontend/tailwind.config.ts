import type { Config } from 'tailwindcss'
import tailwindAnimate from 'tailwindcss-animate'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      width: {
        container: '1300px',
      },
      colors: {
        main: '#FFF',
        mainAccent: '#88cc19', // not needed for shadcn components
        overlay: 'rgba(0,0,0,0.8)', // background color overlay for alert dialogs, modals, etc.

        // light mode
        bg: '#FFF',
        text: '#000',
        border: '#000',

        // dark mode
        darkBg: '#1F283B',
        darkText: '#fff',
        darkBorder: '#000',
        secondaryBlack: '#18181b', // opposite of plain white, not used pitch black because borders and box-shadows are that color 

        specialBlue: '#5F8FBD',
        specialIndigo: '#A1AEDF',
        specialTan: '#FBF9C5',
        darkerBlue: '#435875',
        logoBlue: '#3357cc',
      },
      borderRadius: {
        base: '0px',
      },
      boxShadow: {
        light: '3px 3px 0px 0px #000',
        dark: '4px 4px 0px 0px #000',
        lightSm: '1px 1px 0px 0px #000',
        darkSm: '2px 2px 0px 0px #000',
        lightLg: '8px 8px 0px 0px #000',
        darkLg: '9px 9px 0px 0px #000',
      },
      translate: {
        boxShadowX: '3px',
        boxShadowY: '3px',
        boxShadowXSm: '1px',
        boxShadowYSm: '1px',
        reverseBoxShadowX: '-4px',
        reverseBoxShadowY: '-4px',
      },
      fontWeight: {
        base: '500',
        heading: '700',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        fadeIn: {
          "0%": {
            backgroundColor: "rgba(34, 197, 94, 1)",
            opacity: "1",
          },
          "100%": {
            backgroundColor: "rgba(30, 58, 138, 1)",
            opacity: "1",
          },
        },
        bounceYOnce: {
          '0%': { transform: 'translateY(0) scale(0.9)' },
          '30%': { transform: 'translateY(-4px) scale(0.9)' },
          '60%': { transform: 'translateY(4px) scale(0.9)' },
          '100%': { transform: 'translateY(0) scale(0.9)' },
        },
        bounceYThree: {
          '0%':   { transform: 'translateY(0) scale(0.9)' },
          '10%':  { transform: 'translateY(-20px) scale(0.9)' }, // big bounce
          '25%':  { transform: 'translateY(0) scale(0.9)' },
          '35%':  { transform: 'translateY(-12px) scale(0.9)' }, // smaller
          '45%':  { transform: 'translateY(0) scale(0.9)' },
          '55%':  { transform: 'translateY(-6px) scale(0.9)' },  // tiny
          '65%':  { transform: 'translateY(0) scale(0.9)' },
          '100%': { transform: 'translateY(0) scale(0.9)' },     // settle
        },
        
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        marquee: 'marquee 15s linear infinite',
        marquee2: 'marquee2 15s linear infinite',
        fadeIn: 'fadeIn 1s ease-out',
        'spin-slow': 'spin 1.5s linear infinite',
        'bounce-y-once': 'bounceYOnce 0.5s ease-in-out',
        'bounce-y-three': 'bounceYThree 1.2s linear',
      },
      screens: {
        w900: { raw: '(max-width: 900px)' },
        w500: { raw: '(max-width: 500px)' },
      },
    },
  },
  plugins: [tailwindAnimate],
  darkMode: 'class',
}
export default config
