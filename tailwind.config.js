/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      /* colors: {
        forestGreen:{
          50: '#f0fdf3',
          100: '#dcfce5',
          200: '#baf8cc',
          300: '#85f0a5',
          400: '#48e076',
          500: '#20c752',
          600: '#14a540',
          700: '#148336',
          800: '#15662f',
          900: '#135429',
          950: '#052e13',
        },
        chambray:{
          50: '#f1f6fd',
          100: '#dfebfa',
          200: '#c7dcf6',
          300: '#a0c6f0',
          400: '#74a6e6',
          500: '#5387de',
          600: '#3e6bd2',
          700: '#3558c0',
          800: '#2f4798',
          900: '#2c417c',
          950: '#1f294c',
        },
        seashell:{
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#dcdcdc',
          300: '#bdbdbd',
          400: '#989898',
          500: '#7c7c7c',
          600: '#656565',
          700: '#525252',
          800: '#464646',
          900: '#3d3d3d',
          950: '#292929',
        },
      }, */
      fontFamily: {
        quicksand: ["Quicksand", "sans-serif"],
        jetBrainsMono: ["JetBrains Mono", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        navbar: {
          DEFAULT: "hsl(var(--navbar))",
          foreground: "hsl(var(--navbar-foreground))",
        },
        forestGreen: {
          50: "hsl(var(--forestGreen-50))",
          100: "hsl(var(--forestGreen-100))",
          200: "hsl(var(--forestGreen-200))",
          300: "hsl(var(--forestGreen-300))",
          400: "hsl(var(--forestGreen-400))",
          500: "hsl(var(--forestGreen-500))",
          600: "hsl(var(--forestGreen-600))",
          700: "hsl(var(--forestGreen-700))",
          800: "hsl(var(--forestGreen-800))",
          900: "hsl(var(--forestGreen-900))",
          950: "hsl(var(--forestGreen-950))",
        },
        chambray: {
          50: "hsl(var(--chambray-50))",
          100: "hsl(var(--chambray-100))",
          200: "hsl(var(--chambray-200))",
          300: "hsl(var(--chambray-300))",
          400: "hsl(var(--chambray-400))",
          500: "hsl(var(--chambray-500))",
          600: "hsl(var(--chambray-600))",
          700: "hsl(var(--chambray-700))",
          800: "hsl(var(--chambray-800))",
          900: "hsl(var(--chambray-900))",
          950: "hsl(var(--chambray-950))",
        },
        seashell: {
          50: "hsl(var(--seashell-50))",
          100: "hsl(var(--seashell-100))",
          200: "hsl(var(--seashell-200))",
          300: "hsl(var(--seashell-300))",
          400: "hsl(var(--seashell-400))",
          500: "hsl(var(--seashell-500))",
          600: "hsl(var(--seashell-600))",
          700: "hsl(var(--seashell-700))",
          800: "hsl(var(--seashell-800))",
          900: "hsl(var(--seashell-900))",
          950: "hsl(var(--seashell-950))",
        },
        pinkk: {
          50: "hsl(var(--pinkk-50))",
          100: "hsl(var(--pinkk-100))",
          200: "hsl(var(--pinkk-200))",
        },
      },
      // spacing: {
      //   '128': '32rem',
      //   '144': '36rem',
      // },
      // borderRadius: {
      //   '4xl': '2rem',
      // },
      // fontFamily: {
      //   sans: ['Graphik', 'sans-serif'],
      //   serif: ['Merriweather', 'serif'],
      // },
    },
  },
  plugins: [
    require('flowbite/plugin') 
  ],

  daisyui: {
    themes: false, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "light", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
};
