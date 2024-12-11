import React from "react";
import { useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";

const Location = () => {
  const theme = useTheme();
  const location = useLocation();
  const pathnameWithoutSlash = location.pathname.startsWith("/")
    ? location.pathname.slice(1)
    : location.pathname;

  // Définissez les couleurs pour le mode clair et sombre
  const textColor =
    theme.palette.mode === "dark" ? "text-orange-500" : "text-blue-500";

  return (
    <h2
      className={`mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl uppercase ${textColor}`}
    >
      {pathnameWithoutSlash}
    </h2>
  );
};

export default Location;
