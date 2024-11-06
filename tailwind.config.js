/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter"],
        montserrat: ["Montserrat"],
        poppins: ["Poppins"],
        reddit: ["Reddit Sans", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        sora: ["Sora", "sans-serif"],
        tiny: ["Tiny5", "sans-serif"],
      },
    },
  },
  plugins: [],
}
