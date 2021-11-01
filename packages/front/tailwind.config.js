// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const plugin = require("tailwindcss/plugin")
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const defaultTheme = require("tailwindcss/defaultTheme")
/** @type {import('@types/tailwindcss/tailwind-config').TailwindConfig} */
// eslint-disable-next-line no-undef
module.exports = {
  purge: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#F4E12F",
        black: "#333333",
        bgBlack: "#b6b6b6",
      },
      boxShadow: {
        paper: "4px 8px 4px rgba(0, 0, 0, 0.1)",
        stamp: "2px 4px 8px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      fontFamily: {
        sans: ["Zen Maru Gothic", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".skew-10deg": {
          transform: "skewY(-10deg)",
        },
        ".skew-15deg": {
          transform: "skewY(-15deg)",
        },
        ".text-decoration-transparent": {
          "text-decoration-color": "transparent",
        },

        ".text-decoration-auto": {
          "text-decoration-color": "currentColor",
        },
      }

      addUtilities(newUtilities)
    }),
  ],
}
