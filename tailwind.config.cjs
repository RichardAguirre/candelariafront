module.exports = {
  content: [
    ".\\index.html",
    ".\\src\\**\\*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  experimental: {
    optimizeUniversalDefaults: true,
    oklch: false,
    disableColorOpacityUtilities: true
  },
  plugins: [],
}