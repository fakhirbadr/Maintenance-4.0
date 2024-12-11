import React, { useState } from "react";
import { rows } from "./data"; // Importez les lignes de data.js
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material"; // Importez useTheme

import { PieChart } from "@mui/x-charts/PieChart";

const CustomCard = ({ className }) => {
  const theme = useTheme();

  const [selectedUnit, setSelectedUnit] = useState("tous"); // Par défaut, tous les unités

  const handleUnitChange = (event) => {
    setSelectedUnit(event.target.value); // Mettre à jour l'unité sélectionnée
  };

  // Filtrer les unités disponibles
  const units = Array.from(new Set(rows.map((row) => row.Nom))); // Récupérer les noms des unités

  // Calculer l'OEE et les indicateurs en fonction de l'unité sélectionnée
  const calculateMetrics = (unit) => {
    const unitRows =
      unit === "tous" ? rows : rows.filter((row) => row.Nom === unit);

    const totalAvailability = unitRows.reduce(
      (acc, row) => acc + row.Temps_de_Disponibilité,
      0
    );
    const totalDowntime = unitRows.reduce(
      (acc, row) => acc + row.Temps_d_Arrêt,
      0
    );
    const totalProductionReal = unitRows.reduce(
      (acc, row) => acc + row.Production_Réelle,
      0
    );
    const totalProductionPlanned = unitRows.reduce(
      (acc, row) => acc + row.Production_Planifiée,
      0
    );
    const totalQuality = unitRows.reduce((acc, row) => acc + row.Qualité, 0);

    const availability =
      (totalAvailability / (totalAvailability + totalDowntime)) * 100;
    const performance = (totalProductionReal / totalProductionPlanned) * 100;
    const quality = (totalQuality / totalProductionReal) * 100;

    const oee = (availability * performance * quality) / 10000; // OEE = Disponibilité x Performance x Qualité

    return {
      oee,
      indicators: {
        disponibilite: availability,
        performance,
        qualite: quality,
      },
    };
  };

  const metrics = calculateMetrics(selectedUnit); // Calculer les métriques pour l'unité sélectionnée

  // Titre dynamique en fonction de l'unité sélectionnée
  const getTitle = () => {
    return selectedUnit === "tous"
      ? "OEE tous les unités"
      : `OEE ${selectedUnit}`;
  };

  // Calculer les données pour le graphique en fonction de l'OEE sélectionné
  const getChartData = () => {
    return [
      {
        label: "Rempli",
        value: metrics.oee, // Valeur correspondant à l'OEE
        color: "#36A2EB",
      },
      {
        label: "Vide",
        value: 100 - metrics.oee, // Le reste du cercle sera vide
        color: "#E0E0E0", // Couleur pour la partie vide
      },
    ];
  };

  return (
    <Card
      className={`card ${className} `}
      sx={{
        backgroundColor: theme.palette.mode === "dark" ? "" : "#b6d9fc",
        width: "100% ",
        borderRadius: "12px",
      }}
    >
      <CardHeader
        title={
          <Typography
            sx={{ color: theme.palette.mode === "dark" ? "" : "black" }}
            variant="h6"
            align="center"
            gutterBottom
          >
            Efficacité globale de l'équipement (OEE)
          </Typography>
        }
        action={
          <Select
            value={selectedUnit}
            onChange={handleUnitChange}
            displayEmpty
            variant="outlined"
            size="small"
            style={{ margin: "10px", minWidth: "200px" }}
          >
            <MenuItem value="tous">Tous les unités</MenuItem>
            {units.map((unit, index) => (
              <MenuItem key={index} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </Select>
        }
      />
      <CardContent>
        <div className="flex sm:justify-center gap-x-3">
          <Typography variant="h6" component="span" fontWeight="bold">
            {getTitle()} {/* Titre dynamique */}
          </Typography>
        </div>
        <div className="flex flex-row">
          <div className="flex justify-center items-center w-[80%]">
            <PieChart
              className="flex justify-center items-center"
              series={[
                { innerRadius: 100, outerRadius: 120, data: getChartData() },
              ]} // OEE dynamique
              width={400}
              height={300}
              slotProps={{ legend: { hidden: true } }}
              sx={{ display: "block" }}
            />
          </div>
          <div className="flex w-[20%] font-extrabold text-2xl md:text-3xl sm:px-5 justify-center items-center p-8 md:w-[5%] sm:w-[5%]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 font-extrabold">
              {metrics.oee.toFixed(2)}% {/* Affichage dynamique de l'OEE */}
            </span>
          </div>
        </div>

        {/* Section dynamique pour les indicateurs */}
        <div className="flex flex-col  md:flex-wrap md:flex-row  justify-evenly sm:gap-y-2">
          {["Disponibilité", "Performance", "Qualité"].map((item, index) => (
            <div
              style={{
                borderColor: theme.palette.mode === "dark" ? "" : "black",
              }}
              key={index}
              className={`flex justify-center items-center  flex-col border border-white px-3 py-1 rounded-lg h-[10%] w-[80%] md:w-[45%] ${
                item === "Disponibilité"
                  ? "text-red-500"
                  : item === "Performance"
                  ? "text-blue-500"
                  : "text-amber-600"
              }`}
            >
              <div className="font-extrabold">{item}</div>
              <div className="font-bold">
                {item === "Disponibilité"
                  ? metrics.indicators.disponibilite.toFixed(2)
                  : item === "Performance"
                  ? metrics.indicators.performance.toFixed(2)
                  : metrics.indicators.qualite.toFixed(2)}
                %
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomCard;
