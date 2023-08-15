const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.tsx", "./src/**/*.html", "./src/**/*.html"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        gray: colors.slate,
        primary: colors.slate,
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
