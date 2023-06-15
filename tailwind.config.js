const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/components/**/*.tsx", "./src/client/**/*.tsx"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gray: colors.neutral,
        primary: colors.emerald,
      },
    },
  },
  plugins: [
    require("@danielfgray/tw-heropatterns"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms")({ strategy: "class" }),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/typography"),
  ],
};
