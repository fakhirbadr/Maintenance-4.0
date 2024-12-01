import React, { useState, useEffect } from "react";

const DataDetails = ({ ticket }) => {
  if (!ticket) return null; // If no ticket is selected, return nothing.

  const [timeElapsed, setTimeElapsed] = useState("");

  // Fonction pour formater la date avec heure et minutes
  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(date).toLocaleDateString("fr-FR", options);
  };

  // Fonction pour calculer le temps écoulé
  const calculateTimeElapsed = (date) => {
    const now = new Date();
    const startDate = new Date(date);
    const diffInMs = now - startDate; // Différence en millisecondes

    const seconds = Math.floor((diffInMs / 1000) % 60);
    const minutes = Math.floor((diffInMs / (1000 * 60)) % 60);
    const hours = Math.floor((diffInMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    return `${days}j ${hours}h ${minutes}m ${seconds}s`;
  };

  // Mettre à jour dynamiquement le chronomètre
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(calculateTimeElapsed(ticket.createdAt));
    }, 1000); // Met à jour chaque seconde

    return () => clearInterval(interval); // Nettoie l'intervalle lors du démontage du composant
  }, [ticket.createdAt]);

  // Fonction pour obtenir la couleur de l'urgence
  const getUrgencyColor = (urgence) => {
    if (urgence === "élevée") {
      return "text-red-500"; // Urgence élevée = Rouge
    } else if (urgence === "moyenne") {
      return "text-yellow-500"; // Urgence modérée = Jaune
    } else {
      return "text-green-500"; // Urgence faible = Vert
    }
  };

  return (
    <div className="font-thin leading-relaxed space-y-3 text-xl">
      <div>
        <strong>Site:</strong>
        <span className="ml-2">{ticket.site}</span>
      </div>
      <div>
        <strong>Province:</strong>
        <span className="ml-2">{ticket.province}</span>
      </div>
      <div>
        <strong>Nom:</strong>
        <span className="ml-2">{ticket.name}</span>
      </div>
      <div>
        <strong>Technicien:</strong>
        <span className="ml-2">{ticket.technicien}</span>
      </div>
      <div>
        <strong>Catégorie:</strong>
        <span className="ml-2">{ticket.categorie}</span>
      </div>
      <div>
        <strong>Description:</strong>
        <span className="ml-2">{ticket.description}</span>
      </div>
      <div>
        <strong>Équipement défectueux:</strong>
        <span className="ml-2">{ticket.equipement_deficitaire}</span>
      </div>
      <div>
        <strong>Urgence:</strong>
        <span className={`ml-2 ${getUrgencyColor(ticket.urgence)}`}>
          {ticket.urgence}
        </span>
      </div>
      <div>
        <strong>Date de création:</strong>
        <span className="ml-2">{formatDate(ticket.createdAt)}</span>
        <span className="ml-4 text-gray-500">(il y a {timeElapsed})</span>
      </div>
    </div>
  );
};

export default DataDetails;
