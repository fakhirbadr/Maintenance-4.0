import React, { useState, useEffect } from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const TrancheAge = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // @ts-ignore
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/api/v1/ummcperformance`)
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.ageRates) {
          const {
            "0-6": age0to6,
            "7-14": age7to14,
            "15-24": age15to24,
            "25-64": age25to64,
          } = responseData.ageRates;

          const formattedData = [
            {
              id: 0,
              value: parseFloat(age0to6),
              label: `0-6 ans (${age0to6}%)`,
              color: "#4CAF50",
            },
            {
              id: 1,
              value: parseFloat(age7to14),
              label: `7-14 ans (${age7to14}%)`,
              color: "#C49991",
            },
            {
              id: 2,
              value: parseFloat(age15to24),
              label: `15-24 ans (${age15to24}%)`,
              color: "#DDE8B9",
            },
            {
              id: 3,
              value: parseFloat(age25to64),
              label: `25-64 ans (${age25to64}%)`,
              color: "#517664",
            },
          ];

          setData(formattedData);
        } else {
          setError("Les données des tranches d'âge sont manquantes");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
        setError(
          "Une erreur s'est produite lors de la récupération des données"
        );
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-700 mb-4">
        REPARTITION DES CONSULTATIONS PAR TRANCHE D’AGE EN %
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
                labelStyle: {
                  fontSize: 14,
                  fontWeight: "bold",
                  fill: "#333",
                },
              },
            ]}
            width={400}
            height={240}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            {data.map((item, index) => (
              <div
                key={index}
                style={{
                  margin: "0 10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: item.color, // Couleur de chaque catégorie
                    marginRight: "5px",
                  }}
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
