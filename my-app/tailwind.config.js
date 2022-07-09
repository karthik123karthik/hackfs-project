/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        homePageBackGroundColour1:"#8D2806",
        homePageBackGroundColour2:"#003F17",
        homePageBackGroundColour3:"#5D1627",
        homePageBackGroundColour4:"#A83E59",
        homePageBackGroundColour5:"#8D2806"
      }
    },
  },
  plugins: [],
}
