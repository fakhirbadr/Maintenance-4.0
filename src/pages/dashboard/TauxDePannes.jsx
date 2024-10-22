import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material"; // Importez les composants MUI
import { rows } from "../ticket/Data.js";

const TauxDePannes = () => {
  const [selectedUnit, setSelectedUnit] = useState("UMMC OUMEJRANE TINGHIR");

  const units = [
    "UMMC OUMEJRANE TINGHIR",
    "UMMC OUARZAZATE CENTRE",
    "UMMC RISSANI",
    "UMMC MARRAKECH MEDINA",
  ];

  const panneData = {
    "UMMC OUMEJRANE TINGHIR": [1, 2, 1.5, 3, 2.5, 4, 3.5, 2, 3, 4],
    "UMMC OUARZAZATE CENTRE": [0.5, 1.5, 2, 2.5, 1.5, 3, 2, 1, 2, 3],
    "UMMC RISSANI": [2, 1, 2.5, 1, 3, 2.5, 4, 3, 2, 1],
    "UMMC MARRAKECH MEDINA": [3, 3.5, 4, 3, 4.5, 5, 3, 4, 4.5, 5],
  };

  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Taux de Pannes",
        data: panneData[selectedUnit],
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
        text: `Taux de Pannes pour ${selectedUnit}`, // Titre dynamique
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

  const handleUnitChange = (event) => {
    const newUnit = event.target.value;
    setSelectedUnit(newUnit);
    setChartData({
      series: [
        {
          name: "Taux de Pannes",
          data: panneData[newUnit], // Met à jour les données du graphique
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
  };

  return (
    <Card className=" h-full text-white ">
      <CardContent>
        <Typography variant="h6" align="center" gutterBottom>
          Suivi du Taux de Pannes
        </Typography>

        <FormControl
          fullWidth
          variant="outlined"
          className="
           flex justify-center items-center"
        >
          <Select
            labelId="unit-select-label"
            id="unit-select"
            value={selectedUnit}
            onChange={handleUnitChange}
            label="Sélectionnez l'unité mobile"
            className="bg-gray-800 text-white w-[30%] "
          >
            {units.map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div id="chart" className="w-full h-full">
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="line"
            height={480}
            width={870}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TauxDePannes;
