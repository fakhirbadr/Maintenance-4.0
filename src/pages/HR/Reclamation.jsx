import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import RecalamationVueTechnicien from "./Reclamation/RecalamationVueTechnicien";
import { Typography } from "@mui/material";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;
const Reclamation = () => {
  const [role, setRole] = useState("");
  useEffect(() => {
    // Récupérer userInfo depuis localStorage
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo); // Convertir en objet
        setRole(parsedUserInfo.role || ""); // Récupérer le rôle ou une valeur par défaut
      } catch (error) {
        console.error("Erreur lors de l'analyse de userInfo :", error);
      }
    }
  }, []);

  return (
    <div>
      <Layout />
      <div className="pt-44 bg-[#d1dffa] h-screen">
        {role === "user" || role === "admin" || role === "superviseur" ? (
          <div>
            <RecalamationVueTechnicien />
          </div>
        ) : role === "docteurs" ? (
          <div>xoordinateur</div>
        ) : (
          <div>
            <Typography variant="h6" color="error">
              Rôle non défini.
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reclamation;
