/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.tsx", "./components/**/*.tsx", "./screens/**/*.tsx"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        blueText: "#131C55", 
        blueTitle: "#0000FF", 
        blueButton: "#0000AC",
        blueButtonHover: "#3232D1",
        yellowButton: "#E2B93B",
        yellowButtonHover: "#F0C756",
        redButton: "#F52524",
        redButtonHover: "#FF514F",
        greenButton: "#27AE60",
        greenButtonHover: "#34C277",
        primary: "#9EC6F3",      
        secondary: "#BDDDE4",      
        info: "#9FB3DF",         
        warning: "#FFF1D5",        
        warningText: "#8A6D00",   
      },
    },
  },
  plugins: [],
}