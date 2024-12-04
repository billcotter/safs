const theme = require("./src/config/theme.json");

let font_base = Number(theme.fonts.font_size.base.replace("px", ""));
let font_scale = Number(theme.fonts.font_size.scale);
let h6 = font_scale;
let h5 = h6 * font_scale;
let h4 = h5 * font_scale;
let h3 = h4 * font_scale;
let h2 = h3 * font_scale;
let h1 = h2 * font_scale;

let fontPrimaryType, fontSecondaryType;
if (theme.fonts.font_family.primary) {
  fontPrimaryType = theme.fonts.font_family.primary_type;
}
if (theme.fonts.font_family.secondary) {
  fontSecondaryType = theme.fonts.font_family.secondary_type;
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        dark: "var(--dark)",
        light: "var(--light)",
        text: "var(--text)",
        body: "var(--body)",
        border: "var(--border)",
        "theme-light": "var(--theme-light)",
        "theme-dark": "var(--theme-dark)",
      },
      fontSize: {
        'h1': ['3.5rem', '1.2'],
        'h2': ['3rem', '1.2'],
        'h3': ['2.5rem', '1.2'],
        'h4': ['2rem', '1.2'],
        'h5': ['1.5rem', '1.2'],
        'h6': ['1.25rem', '1.2'],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};
