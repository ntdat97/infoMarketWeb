module.exports = {
  purge: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      boxShadow: {
        blue: "0 4px 6px -1px rgba(79, 146, 255, 0.1)",
      },
      outline: {
        blue: "1px solid #0000ff",
        red: "1px solid #ff0000",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
