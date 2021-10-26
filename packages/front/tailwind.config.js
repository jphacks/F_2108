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
        secondary: "#333333",
      },
      boxShadow: {
        main: "4px 8px 4px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
