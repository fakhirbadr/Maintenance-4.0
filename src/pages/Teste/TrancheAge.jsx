import React, { useState, useEffect } from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const TrancheAge = ({ selectedRegion, selectedProvince, selectedActif }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Construire les paramètres de requête en fonction des filtres
    const params = {};
    if (selectedRegion) params.region = selectedRegion;
    if (selectedProvince) params.province = selectedProvince;
    if (selectedActif) params.unite = selectedActif;

    // Convertir les paramètres en chaîne de requête
    const queryString = new URLSearchParams(params).toString();

    // Faire la requête API avec les filtres
    fetch(`${apiUrl}/api/v1/ummcperformance?${queryString}`)
      .then((response) => response.json())
      .then((responseData) => {
        if (
          responseData.ageRates &&
          typeof responseData.ageRates === "object"
        ) {
          const {
            "0-6": age0to6,
            "7-14": age7to14,
            "15-24": age15to24,
            "25-64": age25to64,
            "65-100": age65to100,
          } = responseData.ageRates;

          const formattedData = [
            {
              id: 0,
              value: Number(age0to6) || 0,
              label: `0-6 ans (${age0to6}%)`,
              color: "#4CAF50",
            },
            {
              id: 1,
              value: Number(age7to14) || 0,
              label: `7-14 ans (${age7to14}%)`,
              color: "#C49991",
            },
            {
              id: 2,
              value: Number(age15to24) || 0,
              label: `15-24 ans (${age15to24}%)`,
              color: "#DDE8B9",
            },
            {
              id: 3,
              value: Number(age25to64) || 0,
              label: `25-64 ans (${age25to64}%)`,
              color: "#517664",
            },
            {
              id: 4,
              value: Number(age65to100) || 0,
              label: `65+ ans (${age65to100}%)`,
              color: "#D1C28A",
            },
          ];

          setData(formattedData);
        } else {
          setError(
            "Les données des tranches d'âge sont absentes ou incorrectes."
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
        setError(
          "Une erreur s'est produite lors de la récupération des données."
        );
        setLoading(false);
      });
  }, [selectedRegion, selectedProvince, selectedActif]); // Déclencher l'effet lorsque les filtres changent

  if (loading) return <div className="text-center">Chargement...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">
        RÉPARTITION DES CONSULTATIONS PAR TRANCHE D’ÂGE EN %
      </h2>
      <div className="flex justify-center pt-8">
        <div style={{ textAlign: "center" }}>
          <PieChart
            series={[
              {
                data,
                labelPosition: "outside",
                outerRadius: 80,
                innerRadius: 50,
                labelStyle: { fontSize: 14, fontWeight: "bold", fill: "#333" },
              },
            ]}
            width={400}
            height={240}
            aria-label="Répartition des consultations par tranche d'âge"
          />
          <div className="flex justify-center mt-4">
            {data.map((item) => (
              <div key={item.id} className="flex items-center mx-2">
                <div
                  className="w-4 h-4 mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrancheAge;
