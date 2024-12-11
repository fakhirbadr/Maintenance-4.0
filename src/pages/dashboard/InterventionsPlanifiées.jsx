import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardContent, Typography } from "@mui/material"; // Importez les composants MUI

const InterventionsPlanifiées = () => {
  const seriesData = [
    {
      name: "Taux de Respect",
      data: [85, 75, 90, 80, 70, 95, 60, 88, 82, 78], // Taux en pourcentage pour chaque région
    },
  ];

  const options = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true, // Graphe horizontal
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["black"],
        fontSize: "17px", // Texte des étiquettes de données en noir
      },
    },
    xaxis: {
      categories: [
        "Rabat-Salé-Kénitra",
        "Casablanca-Settat",
        "Marrakech-Safi",
        "Tanger-Tétouan-Al Hoceima",
        "Fès-Meknès",
        "Beni Mellal-Khénifra",
        "Souss-Massa",
        "Drâa-Tafilalet",
        "Guelmim-Oued Noun",
        "Laâyoune-Sakia El Hamra",
      ],
      labels: {
        style: {
          colors: "#FFFFFF", // Étiquettes de l'axe X en blanc
          fontSize: "17px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Taux de Respect (%)",
        style: {
          color: "#FFFFFF",
          fontSize: "17px", // Titre de l'axe Y en blanc
        },
      },
      labels: {
        style: {
          colors: "#FFFFFF", // Étiquettes de l'axe Y en blanc
        },
      },
    },
    title: {
      text: "Taux de Respect des Interventions Planifiées",
      align: "center",
      style: {
        fontSize: "19px",
        color: "white", // Titre en blanc
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
      theme: "dark", // Thème sombre pour l'info-bulle
    },
  };

  return (
    <Card className="bg-gray-700 text-white rounded-3xl">
      <CardContent>
        <Typography variant="h6" align="center" gutterBottom>
          Suivi des Interventions Planifiées
        </Typography>
        <div id="chart" className="w-full h-full">
          <ReactApexChart
            options={options}
            series={seriesData}
            type="bar"
            height={590}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default InterventionsPlanifiées;
