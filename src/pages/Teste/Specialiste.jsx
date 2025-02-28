import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

const Specialiste = () => {
  const [tauxParSpecialite, setTauxParSpecialite] = useState([]);

  // Récupérer les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/tauxSpecialite"
        ); // Remplacez par l'URL de votre API
        const result = await response.json();
        setTauxParSpecialite(result.tauxParSpecialite); // Mettre à jour l'état avec les taux par spécialité
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, []);

  // Formater les données pour le graphique
  const data = [
    ["Task", "Hours per Day"],
    ...tauxParSpecialite.map((item) => [item._id, item.taux]),
  ];

  const options = {
    pieHole: 0.4, // Crée un diagramme en forme de beignet
    is3D: true, // Active la vue 3D
    pieStartAngle: 100, // Fait tourner le graphique
    sliceVisibilityThreshold: 0.02, // Masque les tranches de moins de 2%
    legend: {
      position: "left",
      alignment: "center",
      textStyle: {
        color: "#233238",
        fontSize: 12,
      },
    },
    colors: ["#8AD1C2", "#9F8AD1", "#D18A99", "#BCD18A", "#D1C28A"],
    backgroundColor: "transparent", // Fond transparent
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-700 mb-4">
        LES SPECIALITES LES PLUS SOLLICITEES
      </h2>
      <div className="flex justify-center py-auto">
        {tauxParSpecialite.length > 0 ? (
          <Chart
            chartType="PieChart"
            data={data}
            options={options}
            width={"500px"}
            height={"300px"}
          />
        ) : (
          <p>Chargement des données...</p>
        )}
      </div>
    </div>
  );
};

export default Specialiste;
