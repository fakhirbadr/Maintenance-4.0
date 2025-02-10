import React from "react";
import NetworkPatientData from "./NetworkPatientData";
import NetworkPatientSythese from "./NetworkPatientSynthese";

const NetworkPatient = () => {
  // Récupération des informations utilisateur
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const role = userInfo?.role?.toLowerCase(); // Normalisation en minuscules

  // Vérification des rôles admin/superviseur
  if (role === "admin" || role === "superviseur") {
    return <NetworkPatientSythese />;
  }

  // Cas par défaut (user, rôle inconnu ou non défini)
  return <NetworkPatientData />;
};

export default NetworkPatient;
