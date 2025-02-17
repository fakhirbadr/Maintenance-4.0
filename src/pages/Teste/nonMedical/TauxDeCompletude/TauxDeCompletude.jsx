import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = ({
  selectedRegion,
  selectedProvince,
  selectedComparison,
  selectedActif,
}) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/tauxDeCompletudeMedical"
        );
        const result = await response.json();
        console.log("Données reçues :", result); // Debugging
        setData(result.tauxHierarchiques);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, []);

  const getChartData = () => {
    if (!data) return { categories: [], dataCurrent: [], dataPrevious: [] };

    let categories = [];
    let dataCurrent = [];
    let dataPrevious = [];

    if (selectedRegion === "Toutes les régions") {
      categories = data.map((region) => region.region);
      dataCurrent = data.map((region) => region.weeklyS);
      dataPrevious =
        selectedComparison === "S_vs_S-1"
          ? data.map((region) => region.weeklyS1 || 0)
          : data.map((region) => region.monthlyM1 || 0);
    } else {
      const regionData = data.find(
        (region) => region.region === selectedRegion
      );

      console.log("✅ Région trouvée :", regionData);

      if (regionData && Array.isArray(regionData.provinces)) {
        console.log("📌 Provinces disponibles :", regionData.provinces);

        if (selectedProvince) {
          const provinceData = regionData.provinces.find(
            (province) => province.province.trim() === selectedProvince.trim()
          );

          console.log("🔍 Province trouvée :", provinceData);

          if (provinceData && Array.isArray(provinceData.unites)) {
            let units = provinceData.unites;

            // Appliquer le filtre sur l'actif si sélectionné
            if (selectedActif) {
              units = units.filter((unite) => unite.unite === selectedActif);
            }

            categories = units.map((unite) => unite.unite);
            dataCurrent = units.map((unite) => unite.weeklyS);
            dataPrevious =
              selectedComparison === "S_vs_S-1"
                ? units.map((unite) => unite.weeklyS1 || 0)
                : units.map((unite) => unite.monthlyM1 || 0);
          } else {
            console.warn(
              "⚠️ Aucune unité trouvée pour la province :",
              selectedProvince
            );
          }
        } else {
          categories = regionData.provinces.map(
            (province) => province.province
          );
          dataCurrent = regionData.provinces.map(
            (province) => province.weeklyS
          );
          dataPrevious =
            selectedComparison === "S_vs_S-1"
              ? regionData.provinces.map((province) => province.weeklyS1 || 0)
              : regionData.provinces.map((province) => province.monthlyM1 || 0);
        }
      } else {
        console.warn(
          "⚠️ Aucune province trouvée pour la région :",
          selectedRegion
        );
      }
    }

    return { categories, dataCurrent, dataPrevious };
  };

  const { categories, dataCurrent, dataPrevious } = getChartData();

  if (!data) {
    return <div>Chargement des données...</div>;
  }

  if (categories.length === 0) {
    return <div>Aucune donnée disponible.</div>;
  }

  return (
    <div>
      <ReactApexChart
        options={{
          chart: { type: "bar", height: 350 },
          title: { text: "Taux de Complétude Médicale" },
          xaxis: { categories },
          yaxis: {
            min: 0,
            max: 100,
            title: { text: "Taux (%)" },
            labels: { formatter: (value) => value.toFixed(0) },
          },
          tooltip: {
            y: { formatter: (value) => Math.round(value) + "%" },
          },
          dataLabels: {
            enabled: true,
            formatter: (value) => Math.round(value) + "%",
          },
        }}
        series={[
          { name: "Période actuelle", data: dataCurrent },
          ...(selectedComparison
            ? [{ name: "Période précédente", data: dataPrevious }]
            : []),
        ]}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default ApexChart;
