import React, { useEffect, useState } from "react";
import TechnicienInterface from "./TechnicienInterface";
import DocteursInventaire from "./docteursInventaire";

const Index = () => {
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
      {role === "user" && (
        <div>
          <TechnicienInterface />
        </div>
      )}

      {(role === "docteurs" || role === "admin" || role === "superviseur") && (
        <div>
          <DocteursInventaire />
        </div>
      )}

      {!role && <div>Rôle non défini.</div>}
    </div>
  );
};

export default Index;
