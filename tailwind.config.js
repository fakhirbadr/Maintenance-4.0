/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        upbar: "var(--upbar-height)",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
      },
      animation: {
        heartbeat: "heartbeat 2s infinite",
        "fade-in-down": "fade-in-down 0.6s ease-out",
        shake: "shake 0.4s ease-in-out",
      },
    },
  },
  plugins: [
    require("flowbite/plugin"),

    // Suppression de la configuration non nécessaire
    // Ajoutez d'autres plugins si nécessaire ici
  ],
};
