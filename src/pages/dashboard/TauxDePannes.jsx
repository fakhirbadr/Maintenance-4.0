import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import {
  Card,
  CardContent,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Grid,
  TextField,
  InputLabel,
} from "@mui/material";

import { rows } from "../ticket/Data.js"; // Importation des données

const TauxDePannes = () => {
  const [selectedUnit, setSelectedUnit] = useState(""); // Pour afficher toutes les unités par défaut
  const [selectedYear, setSelectedYear] = useState(""); // Pour afficher toutes les années par défaut
  const [selectedMonth, setSelectedMonth] = useState(""); // Ajouter un état pour le mois sélectionné

  // Fonction pour calculer les taux de pannes
  const calculateTauxDepannes = (data) => {
    const tauxDepannes = {};

    data.forEach((row) => {
      const site = row.Site; // Obtenir le nom du site
      const date = new Date(row.date); // Convertir la chaîne de date en objet Date
      const month = date.toLocaleString("default", { month: "long" }); // Obtenir le nom complet du mois
      const year = date.getFullYear(); // Obtenir l'année

      // Initialiser l'objet site s'il n'existe pas
      if (!tauxDepannes[site]) {
        tauxDepannes[site] = {};
      }

      // Initialiser l'objet mois/année s'il n'existe pas
      if (!tauxDepannes[site][`${month} ${year}`]) {
        tauxDepannes[site][`${month} ${year}`] = 0;
      }

      // Incrémenter le compteur pour le site et le mois/année en cours
      tauxDepannes[site][`${month} ${year}`]++;
    });

    return tauxDepannes;
  };

  const tauxDepannes = calculateTauxDepannes(rows); // Calculer les taux de pannes à partir des lignes de données

  // Extraire les unités uniques dynamiquement
  const units = Object.keys(tauxDepannes); // Noms de sites uniques à partir de tauxDepannes

  const availableYears = [
    ...new Set(rows.map((row) => new Date(row.date).getFullYear())), // Obtenir les années disponibles
  ];

  // Obtenir les mois uniques à partir des données
  const availableMonths = [
    ...new Set(
      rows.map((row) =>
        new Date(row.date).toLocaleString("default", { month: "long" })
      )
    ),
  ];

  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Taux de Pannes",
        data: [], // Données initiales vides
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
        categories: [], // Catégories vides pour l'instant
        labels: {
          style: {
            colors: "#FFFFFF",
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        title: {
          text: "Taux de Pannes",
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
        text: "Taux de Pannes pour Toutes les Unités", // Titre dynamique
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

  useEffect(() => {
    updateChartData(selectedUnit, selectedYear, selectedMonth); // Mettre à jour les données du graphique lors du chargement
  }, []); // Exécuter une fois au montage

  const handleUnitChange = (event) => {
    const newUnit = event.target.value;
    setSelectedUnit(newUnit);
    updateChartData(newUnit, selectedYear, selectedMonth);
  };

  const handleYearChange = (event) => {
    const newYear = event.target.value;
    setSelectedYear(newYear);
    updateChartData(selectedUnit, newYear, selectedMonth);
  };

  const handleMonthChange = (event) => {
    const newMonth = event.target.value;
    setSelectedMonth(newMonth);
    updateChartData(selectedUnit, selectedYear, newMonth);
  };

  const updateChartData = (unit, year, month) => {
    let dataForUnit;

    if (!unit) {
      // Si aucune unité n'est sélectionnée, rassembler les données pour toutes les unités
      dataForUnit = Object.keys(tauxDepannes).reduce((acc, site) => {
        Object.keys(tauxDepannes[site]).forEach((key) => {
          acc[key] = (acc[key] || 0) + tauxDepannes[site][key];
        });
        return acc;
      }, {});
    } else {
      dataForUnit = tauxDepannes[unit] || {};
    }

    // Filtrer les données par année et par mois
    const filteredData = Object.keys(dataForUnit).reduce((acc, key) => {
      const [dataMonth, dataYear] = key.split(" ");
      if (
        (year === "" || dataYear === year.toString()) &&
        (month === "" || dataMonth === month)
      ) {
        acc.push({ month: dataMonth, count: dataForUnit[key] });
      }
      return acc;
    }, []);

    // Obtenir les mois pour le graphique
    const categories = filteredData.map((item) => item.month);
    const counts = filteredData.map((item) => item.count);

    setChartData({
      series: [
        {
          name: "Taux de Pannes",
          data: counts, // Mettre à jour les données pour l'unité sélectionnée
        },
      ],
      options: {
        ...chartData.options,
        xaxis: {
          categories: categories, // Mettre à jour les catégories pour l'axe X
          labels: {
            style: {
              colors: "#FFFFFF",
              fontSize: "12px",
            },
          },
        },
        title: {
          ...chartData.options.title,
          text: unit
            ? `Taux de Pannes pour ${unit}`
            : "Taux de Pannes pour Toutes les Unités", // Titre mis à jour
        },
      },
    });
  };

  return (
    <Card className="h-full text-white">
      <CardContent>
        <Typography variant="h6" align="center" gutterBottom>
          Suivi du Taux de Pannes
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              select
              label="Mois"
              value={selectedMonth}
              onChange={handleMonthChange}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="">
                <em>Aucun</em>
              </MenuItem>
              {availableMonths.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField
              select
              label="Année"
              value={selectedYear}
              onChange={handleYearChange}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="">
                <em>Aucune</em>
              </MenuItem>
              {availableYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="unit-select-label">
                Sélectionnez l'unité mobile
              </InputLabel>
              <Select
                labelId="unit-select-label"
                id="unit-select"
                value={selectedUnit}
                onChange={handleUnitChange}
                label="Sélectionnez l'unité mobile"
                className="text-white"
              >
                <MenuItem value="">
                  <em>Toutes les unités</em>{" "}
                  {/* Option pour toutes les unités */}
                </MenuItem>
                {units.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <div className="chart">
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="line"
            height={450}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TauxDePannes;
