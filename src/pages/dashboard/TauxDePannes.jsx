import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const TauxDePannes = () => {
  const [selectedUnit, setSelectedUnit] = useState("Unité 1");
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Taux de Pannes",
        data: [1, 2, 1.5, 3, 2.5, 4, 3.5, 2, 3, 4],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
      },
      stroke: {
        width: 5,
        curve: "smooth",
      },
      xaxis: {
        categories: [
          "Jan",
          "Fév",
          "Mar",
          "Avr",
          "Mai",
          "Juin",
          "Juil",
          "Août",
          "Sep",
          "Oct",
        ],
        labels: {
          style: {
            colors: "#FFFFFF",
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        title: {
          text: "Taux de Pannes (par heure)",
          style: {
            color: "#FFFFFF",
          },
        },
        labels: {
          style: {
            colors: "#FFFFFF",
          },
        },
      },
      title: {
        text: `Taux de Pannes pour ${selectedUnit}`, // Titre dynamique basé sur l'unité sélectionnée
        align: "center",
        style: {
          fontSize: "19px",
          color: "white",
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#FDD835"],
          shadeIntensity: 1,
          type: "horizontal",
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100],
        },
      },
      tooltip: {
        theme: "dark",
      },
    },
  });

  const units = [
    "UMMC OUMEJRANE TINGHIR",
    "UMMC OUARZAZATE CENTRE",
    "UMMC RISSANI",
    "UMMC MARRAKECH MEDINA",
  ];

  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    setSelectedUnit(newUnit);

    switch (newUnit) {
      case "UMMC OUMEJRANE TINGHIR":
        setChartData({
          series: [
            {
              name: "Taux de Pannes",
              data: [1, 2, 1.5, 3, 2.5, 4, 3.5, 2, 3, 4],
            },
          ],
          options: {
            ...chartData.options,
            title: {
              ...chartData.options.title,
              text: `Taux de Pannes pour ${newUnit}`, // Met à jour le titre
            },
          },
        });
        break;
      case "UMMC OUARZAZATE CENTRE":
        setChartData({
          series: [
            {
              name: "Taux de Pannes",
              data: [0.5, 1.5, 2, 2.5, 1.5, 3, 2, 1, 2, 3],
            },
          ],
          options: {
            ...chartData.options,
            title: {
              ...chartData.options.title,
              text: `Taux de Pannes pour ${newUnit}`, // Met à jour le titre
            },
          },
        });
        break;
      case "UMMC RISSANI":
        setChartData({
          series: [
            {
              name: "Taux de Pannes",
              data: [2, 1, 2.5, 1, 3, 2.5, 4, 3, 2, 1],
            },
          ],
          options: {
            ...chartData.options,
            title: {
              ...chartData.options.title,
              text: `Taux de Pannes pour ${newUnit}`, // Met à jour le titre
            },
          },
        });
        break;
      case "UMMC MARRAKECH MEDINA":
        setChartData({
          series: [
            {
              name: "Taux de Pannes",
              data: [3, 3.5, 4, 3, 4.5, 5, 3, 4, 4.5, 5],
            },
          ],
          options: {
            ...chartData.options,
            title: {
              ...chartData.options.title,
              text: `Taux de Pannes pour ${newUnit}`, // Met à jour le titre
            },
          },
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-4 text-white w-full bg-gray-700 rounded-3xl">
      <h2 className="text-center text-xl mb-4">Suivi du Taux de Pannes</h2>

      <div className="mb-4">
        <label htmlFor="unit-select" className="block mb-2">
          Sélectionnez l'unité mobile :
        </label>
        <select
          id="unit-select"
          value={selectedUnit}
          onChange={handleUnitChange}
          className="p-2 rounded-md bg-gray-800 text-white"
        >
          {units.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>

      <div id="chart" className="w-full h-full">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={480}
          width={870}
        />
      </div>
    </div>
  );
};

export default TauxDePannes;
