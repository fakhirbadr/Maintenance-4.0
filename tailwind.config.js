/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("flowbite/plugin"), // Suppression de la configuration non nécessaire
    // Ajoutez d'autres plugins si nécessaire ici
  ],
};
