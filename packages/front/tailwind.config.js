// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const plugin = require("tailwindcss/plugin")
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
        "paper-inverse": "-4px 8px 4px rgba(0, 0, 0, 0.1)",
        stamp: "2px 4px 8px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "spin-slow": "spin 4s linear infinite",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".text-decoration-transparent": {
          "text-decoration-color": "transparent",
        },

        ".text-decoration-auto": {
          "text-decoration-color": "currentColor",
        },
        ".drag-none": {
          "user-drag": "none",
          "-webkit-user-drag": "none",
          "-moz-user-select": "none",
        },
        ".highlight": {
          "background-color": "yellow",
          color: "#333333",
          "font-weight": "bold",
        },
      }

      addUtilities(newUtilities)
    }),
  ],
}
