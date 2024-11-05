import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardContent, Typography, Grid, TextField } from "@mui/material";
import { rows } from "../ticket/Data.js"; // Importation des données des tickets

class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    // Initialisation de l'état local pour les filtres d'année et de mois, ainsi que pour les données du graphique
    this.state = {
      selectedYear: "", // Année sélectionnée par l'utilisateur
      selectedMonth: "", // Mois sélectionné par l'utilisateur
      series: [], // Données des séries pour le graphique
      availableYears: [], // Années disponibles extraites des données
      availableMonths: [], // Mois disponibles extraits des données
      options: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: true,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 10,
            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: "13px",
                  fontWeight: 900,
                  color: "#FFFFFF",
                },
              },
            },
          },
        },
        xaxis: {
          type: "category",
          categories: [], // Catégories d'axe X (les dates seront utilisées)
          labels: {
            style: {
              colors: "#FFFFFF",
              fontSize: "12px",
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: "#FFFFFF",
            },
          },
        },
        legend: {
          position: "right",
          offsetY: 40,
          labels: {
            colors: "#FFFFFF",
          },
        },
        fill: {
          opacity: 1,
        },
      },
    };

    // Liaison des méthodes
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  componentDidMount() {
    // Appel de la fonction pour extraire les années et mois disponibles dans les données
    this.extractAvailableFilters();
    // Met à jour les données du graphique lors du montage du composant
    this.updateChartData();
  }

  // Fonction pour extraire dynamiquement les années et mois disponibles dans les données
  extractAvailableFilters() {
    const availableYears = new Set(); // Utilisation d'un ensemble pour éviter les doublons
    const availableMonths = new Set();

    rows.forEach((row) => {
      const date = new Date(row.date);
      availableYears.add(date.getFullYear()); // Extraction de l'année
      availableMonths.add(date.getMonth() + 1); // Extraction du mois (commence à 0 en JavaScript, d'où l'ajout de 1)
    });

    // Mise à jour de l'état avec les années et mois uniques
    this.setState({
      availableYears: Array.from(availableYears).sort(), // Tri des années par ordre croissant
      availableMonths: Array.from(availableMonths).sort((a, b) => a - b), // Tri des mois par ordre croissant
    });
  }

  // Fonction pour mettre à jour les données du graphique selon les filtres d'année et de mois
  updateChartData() {
    const { selectedYear, selectedMonth } = this.state;

    // Filtrage des lignes de tickets selon les filtres d'année et de mois sélectionnés
    const filteredRows = rows.filter((row) => {
      const date = new Date(row.date);
      const yearMatches = selectedYear
        ? date.getFullYear() === parseInt(selectedYear)
        : true; // Vérification si l'année correspond
      const monthMatches = selectedMonth
        ? date.getMonth() + 1 === parseInt(selectedMonth)
        : true; // Vérification si le mois correspond
      return yearMatches && monthMatches;
    });

    // Préparation des données filtrées pour le graphique
    const seriesData = this.prepareData(filteredRows);

    // Mise à jour de l'état avec les nouvelles séries et catégories
    this.setState({
      series: seriesData.series,
      options: {
        ...this.state.options,
        xaxis: {
          ...this.state.options.xaxis,
          categories: seriesData.categories,
        },
      },
    });
  }

  // Fonction pour préparer les données pour les séries du graphique
  prepareData(rows) {
    const groupedData = {}; // Objet pour regrouper les données par date
    rows.forEach((row) => {
      const date = row.date;
      const priority = row.priorité.toLowerCase(); // Récupération de la priorité

      if (!groupedData[date]) {
        groupedData[date] = { basse: 0, moyenne: 0, élevée: 0, critique: 0 }; // Initialisation des priorités par date
      }

      // Incrémentation des valeurs selon la priorité
      if (priority === "basse") groupedData[date].basse += 1;
      else if (priority === "moyenne") groupedData[date].moyenne += 1;
      else if (priority === "élevée") groupedData[date].élevée += 1;
      else if (priority === "critique") groupedData[date].critique += 1;
    });

    const categories = Object.keys(groupedData); // Récupération des dates comme catégories
    const seriesData = {
      Basse: [],
      Moyenne: [],
      Élevée: [],
      Critique: [],
    };

    // Remplissage des séries avec les données regroupées
    categories.forEach((date) => {
      seriesData.Basse.push(groupedData[date].basse);
      seriesData.Moyenne.push(groupedData[date].moyenne);
      seriesData.Élevée.push(groupedData[date].élevée);
      seriesData.Critique.push(groupedData[date].critique);
    });

    return {
      series: [
        { name: "Basse", data: seriesData.Basse },
        { name: "Moyenne", data: seriesData.Moyenne },
        { name: "Élevée", data: seriesData.Élevée },
        { name: "Critique", data: seriesData.Critique },
      ],
      categories: categories,
    };
  }

  // Gestionnaire de changement des filtres
  handleFilterChange(event) {
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.updateChartData(); // Mise à jour des données du graphique après modification du filtre
    });
  }

  // Rendu du composant graphique et des filtres
  render() {
    return (
      <Card className="bg-gray-700 text-white h-full">
        <CardContent>
          <Typography variant="h6" align="center" gutterBottom>
            Nombre de Tickets & Priorité ({rows.length})
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                select
                label="Année"
                name="selectedYear"
                value={this.state.selectedYear}
                onChange={this.handleFilterChange}
                fullWidth
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
              >
                <option value=""></option>
                {/* Afficher dynamiquement les années disponibles */}
                {this.state.availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="Mois"
                name="selectedMonth"
                value={this.state.selectedMonth}
                onChange={this.handleFilterChange}
                fullWidth
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
              >
                <option value=""></option>
                {/* Afficher dynamiquement les mois disponibles */}
                {this.state.availableMonths.map((month) => (
                  <option key={month} value={month}>
                    {month.toString().padStart(2, "0")}{" "}
                    {/* Ajouter un zéro avant pour formater les mois */}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <div id="chart">
            <ReactApexChart
              options={this.state.options}
              series={this.state.series}
              type="bar"
              height={350}
            />
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default ApexChart;
