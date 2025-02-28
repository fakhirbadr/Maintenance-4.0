import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const TauxDeCompletudeDesPrescriptions = ({
  selectedRegion,
  selectedProvince,
  selectedComparison,
  selectedActif,
}) => {
  const [data, setData] = useState(null);

  // Dans TauxDeCompletudeDeDossierComplet.js, modifiez useEffect :
  useEffect(() => {
    const fetchData = async () => {
      try {
        let url =
          "http://localhost:3000/api/v1/TauxDeCompletudeDesPrescriptions?";

        if (selectedRegion && selectedRegion !== "Toutes les régions") {
          url += `region=${encodeURIComponent(selectedRegion)}&`;
        }
        if (selectedProvince) {
          url += `province=${encodeURIComponent(selectedProvince)}&`;
        }
        if (selectedActif) {
          url += `unite=${encodeURIComponent(selectedActif)}&`;
        }

        const response = await fetch(url);
        const result = await response.json();
        console.log(
          "TauxDeCompletudeDesPrescriptions reçues de l'API :",
          result
        ); // Ajoutez ce log
        setData(result.tauxHierarchiques);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, [selectedRegion, selectedProvince, selectedActif]);

  const getChartData = () => {
    if (!data) return { categories: [], dataCurrent: [], dataPrevious: [] };

    let categories = [];
    let dataCurrent = [];
    let dataPrevious = [];

    if (selectedRegion === "Toutes les régions") {
      // Cas où toutes les régions sont sélectionnées
      categories = data.map((region) => region.region);
      dataCurrent = data.map((region) => region.weeklyS || 0);
      dataPrevious =
        selectedComparison === "S_vs_S-1"
          ? data.map((region) => region.weeklyS1 || 0)
          : data.map((region) => region.monthlyM1 || 0);
    } else {
      // Cas où une région spécifique est sélectionnée
      const regionData = data.find(
        (region) => region.region === selectedRegion
      );

      if (regionData) {
        if (selectedProvince) {
          // Cas où une province spécifique est sélectionnée
          const provinceData = regionData.provinces.find(
            (province) => province.province.trim() === selectedProvince.trim()
          );

          if (provinceData) {
            let units = provinceData.unites;

            // Appliquer le filtre sur l'actif si sélectionné
            if (selectedActif) {
              units = units.filter((unite) => unite.unite === selectedActif);
            }

            categories = units.map((unite) => unite.unite);
            dataCurrent = units.map((unite) => unite.weeklyS || 0);
            dataPrevious =
              selectedComparison === "S_vs_S-1"
                ? units.map((unite) => unite.weeklyS1 || 0)
                : units.map((unite) => unite.monthlyM1 || 0);
          }
        } else {
          // Cas où aucune province n'est sélectionnée
          categories = regionData.provinces.map(
            (province) => province.province
          );
          dataCurrent = regionData.provinces.map(
            (province) => province.weeklyS || 0
          );
          dataPrevious =
            selectedComparison === "S_vs_S-1"
              ? regionData.provinces.map((province) => province.weeklyS1 || 0)
              : regionData.provinces.map((province) => province.monthlyM1 || 0);
        }
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
      {" "}
      <ReactApexChart
        options={{
          chart: { type: "bar", height: 350 },
          title: { text: "Taux De Completude Des Prescriptions" },
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

export default TauxDeCompletudeDesPrescriptions;
