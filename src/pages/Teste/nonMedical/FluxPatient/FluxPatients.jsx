import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const Consultation = ({ selectedRegion, selectedProvince, selectedActif }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: { type: "area", height: 350, toolbar: { show: false } },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
      xaxis: { type: "datetime", categories: [] },
      tooltip: { x: { format: "dd/MM/yyyy" } },
      colors: ["#33B5FF", "#FF5733"], // Couleurs pour les deux séries
      yaxis: { title: { text: "Nombre de Prises en Charge" } },
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
      if (!aggregatedData[item.date]) {
        aggregatedData[item.date] = 0;
      }
      aggregatedData[item.date] += item.totalPriseEnCharge;
    });

    return Object.keys(aggregatedData).map((date) => ({
      date,
      totalPriseEnCharge: aggregatedData[date],
    }));
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
        currentMonthValue: currentDay.totalPriseEnCharge,
        previousMonthValue: previousDay ? previousDay.totalPriseEnCharge : 0,
      });
    });

    return alignedData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construire l'URL avec les filtres
        const url = new URL(`${apiUrl}/api/v1/ummcperformance/consultations`);
        if (selectedRegion) url.searchParams.append("region", selectedRegion);
        if (selectedProvince)
          url.searchParams.append("province", selectedProvince);
        if (selectedActif) url.searchParams.append("actif", selectedActif);

        const response = await fetch(url.toString());
        const data = await response.json();
        console.log("Données de l'API :", data);

        if (data) {
          // Agréger les données par date
          const aggregatedCurrentMonth = aggregateDataByDate(
            data.currentMonth.data
          );
          const aggregatedPreviousMonth = aggregateDataByDate(
            data.previousMonth.data
          );

          // Aligner les jours du mois actuel avec ceux du mois précédent
          const alignedData = alignDays(
            aggregatedCurrentMonth,
            aggregatedPreviousMonth
          );

          // Calculer les totaux pour les prises en charge
          const totalCurrentMonth = aggregatedCurrentMonth.reduce(
            (acc, item) => acc + item.totalPriseEnCharge,
            0
          );
          const totalPreviousMonth = aggregatedPreviousMonth.reduce(
            (acc, item) => acc + item.totalPriseEnCharge,
            0
          );

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

          // Extraire les dates et les valeurs pour le graphique
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
        Évolution du Flux de Prises en Charge
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

export default Consultation;
