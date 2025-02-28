import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const TeleExpertise = ({ selectedRegion, selectedProvince, selectedActif }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: { type: "area", height: 350, toolbar: { show: false } },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
      xaxis: { type: "datetime", categories: [] },
      tooltip: { x: { format: "dd/MM/yyyy" } },
      colors: ["#33B5FF", "#FF5733"], // Couleurs pour les deux séries
      yaxis: { title: { text: "Nombre de Télé-Expertise" } },
      legend: { position: "top" },
    },
  });

  const [currentMonthTotal, setCurrentMonthTotal] = useState(0);
  const [previousMonthTotal, setPreviousMonthTotal] = useState(0);
  const [evolutionRate, setEvolutionRate] = useState(0);

  // Fonction pour agréger les données par date
  const aggregateDataByDate = (data) => {
    const aggregatedData = {};

    data.forEach((item) => {
      const date = item.date.split("T")[0]; // On ne garde que la partie date (YYYY-MM-DD)
      if (!aggregatedData[date]) {
        aggregatedData[date] = {
          date: date,
          Teleexpertises: 0,
        };
      }
      aggregatedData[date].Teleexpertises += item.Teleexpertises || 0;
    });

    return Object.values(aggregatedData);
  };

  // Fonction pour aligner les jours du mois actuel avec ceux du mois précédent
  const alignDays = (currentMonthData, previousMonthData) => {
    const alignedData = [];

    currentMonthData.forEach((currentDay) => {
      const currentDate = new Date(currentDay.date);
      const previousMonthDate = new Date(currentDate);
      previousMonthDate.setMonth(previousMonthDate.getMonth() - 1); // Mois précédent

      const previousDay = previousMonthData.find(
        (d) => new Date(d.date).getDate() === previousMonthDate.getDate()
      );

      alignedData.push({
        date: currentDate.toISOString().split("T")[0], // Date du mois actuel
        currentMonthValue: currentDay.Teleexpertises,
        previousMonthValue: previousDay ? previousDay.Teleexpertises : 0,
      });
    });

    return alignedData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construire l'URL avec les filtres
        const url = new URL(
          "http://localhost:3000/api/v1/ummcperformance/teleexpertises"
        );
        if (selectedRegion) url.searchParams.append("region", selectedRegion);
        if (selectedProvince)
          url.searchParams.append("province", selectedProvince);
        if (selectedActif) url.searchParams.append("unite", selectedActif); // Assurez-vous que "unite" est le bon paramètre côté API

        const response = await fetch(url.toString());
        const data = await response.json();
        console.log("Données de l'API :", data);

        if (data) {
          // Extraire les données du mois actuel et du mois précédent
          const currentMonthData = data.currentMonth.data;
          const previousMonthData = data.previousMonth.data;

          // Extraire les totaux
          const totalCurrentMonth = data.currentMonth.totalTeleexpertises;
          const totalPreviousMonth = data.previousMonth.totalTeleexpertises;

          // Calculer le taux d'évolution
          let rate = 0;
          if (totalPreviousMonth !== 0) {
            rate =
              ((totalCurrentMonth - totalPreviousMonth) / totalPreviousMonth) *
              100;
          }

          // Mettre à jour les états
          setCurrentMonthTotal(totalCurrentMonth);
          setPreviousMonthTotal(totalPreviousMonth);
          setEvolutionRate(rate);

          // Agrégation des données par date
          const aggregatedCurrentMonth = aggregateDataByDate(currentMonthData);
          const aggregatedPreviousMonth =
            aggregateDataByDate(previousMonthData);

          // Aligner les jours du mois actuel avec ceux du mois précédent
          const alignedData = alignDays(
            aggregatedCurrentMonth,
            aggregatedPreviousMonth
          );

          // Extraire les dates et les valeurs de télé-expertise
          const categories = alignedData.map((item) => item.date);
          const currentMonthSeries = alignedData.map(
            (item) => item.currentMonthValue
          );
          const previousMonthSeries = alignedData.map(
            (item) => item.previousMonthValue
          );

          // Mettre à jour les données du graphique
          setChartData({
            series: [
              { name: "Mois actuel", data: currentMonthSeries },
              { name: "Mois précédent", data: previousMonthSeries },
            ],
            options: {
              ...chartData.options,
              xaxis: { ...chartData.options.xaxis, categories },
            },
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, [selectedRegion, selectedProvince, selectedActif]); // Déclencheur des filtres

  return (
    <div className="w-full p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Évolution du Flux de Télé-Expertise
      </h2>
      <div className="mb-4">
        <p className="text-gray-600">
          Total ce mois-ci :{" "}
          <span className="font-bold">{currentMonthTotal}</span>{" "}
          <span
            className={`font-bold ${
              evolutionRate >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            ({evolutionRate.toFixed(2)}%)
          </span>
        </p>
        <p className="text-gray-600">
          Total le mois dernier :{" "}
          <span className="font-bold">{previousMonthTotal}</span>
        </p>
      </div>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="area"
        height={300}
      />
    </div>
  );
};

export default TeleExpertise;
