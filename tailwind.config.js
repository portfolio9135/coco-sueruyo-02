/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      textShadow: {
        'default': '2px 2px 4px rgba(0, 0, 0, 0.5)', // 影のスタイルを設定
      },
      screens: {
        'xl': '1280px', // これはラージよりも大きなブレイクポイントです
        // 他にも必要なブレイクポイントを定義できます
      },
    },
  },
  plugins: [],
}
