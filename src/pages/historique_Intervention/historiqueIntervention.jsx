import React, { useState, useEffect } from "react";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import dayjs from "dayjs";
import * as XLSX from "xlsx"; // Import XLSX to handle the Excel export
import useStore from "../../store/useUserStore.js"; // Importer le store Zustand

import duration from "dayjs/plugin/duration"; // Pour calculer la durée
import Button from "@mui/material/Button";
dayjs.extend(duration);

const HistoriqueIntervention = () => {
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Collaborateurs");
    XLSX.writeFile(workbook, "Historique_Intervention.xlsx");
  };
  const { email, role } = useStore(); // Récupérer l'email et le rôle du store

  const [rows, setRows] = useState([]); // Stocker les données
  const [loading, setLoading] = useState(true); // Gérer l'état de chargement

  // Définir les colonnes du tableau
  const columns = [
    { name: "name", label: "Nom" },
    { name: "site", label: "Site" },
    { name: "province", label: "Province" },
    { name: "technicien", label: "Technicien" },
    { name: "categorie", label: "Catégorie" },
    { name: "equipement_deficitaire", label: "Équipement Déficitaire" },
    { name: "description", label: "Description" },
    { name: "commentaire", label: "Commentaire responsable" },
    { name: "urgence", label: "Urgence" },
    {
      name: "createdAt",
      label: "Date de Création",
      options: {
        customBodyRender: (value) => dayjs(value).format("DD/MM/YY HH:mm"), // Formatage de la date
      },
    },
    {
      name: "dateCloture",
      label: "Date de Clôture",
      options: {
        customBodyRender: (value) =>
          value ? dayjs(value).format("DD/MM/YY HH:mm") : "N/A", // Affiche "N/A" si dateCloture est null
      },
    },
    {
      name: "tempsMaintenance",
      label: "Temps de Maintenance",
      options: {
        customBodyRender: (_, rowData) => {
          const createdAt =
            rowData.rowData[columns.findIndex((c) => c.name === "createdAt")];
          const dateCloture =
            rowData.rowData[columns.findIndex((c) => c.name === "dateCloture")];

          if (!createdAt || !dateCloture) return "N/A";

          const duration = dayjs.duration(
            dayjs(dateCloture).diff(dayjs(createdAt))
          );
          const hours = Math.floor(duration.asHours());
          const minutes = duration.minutes();

          return `${hours}h ${minutes}m`;
        },
      },
    },
  ];

  // Récupérer les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://backend-v1-e3bx.onrender.com/api/v1/ticketMaintenance?isClosed=true"
        );
        setRows(response.data); // Mettre à jour les lignes du tableau
        setLoading(false); // Arrêter l'état de chargement
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Définir le thème de Material-UI
  const getMuiTheme = () =>
    createTheme({
      typography: { fontFamily: "sans-serif" },
      palette: {
        background: { paper: "#1E1E1E", default: "#0f172a" },
        mode: "dark",
      },
      components: {
        MuiTableCell: {
          styleOverrides: {
            head: { padding: "10px 4px" },
            body: {
              padding: "7px 15px",
              color: "#e2e8f0",
              textOverflow: "ellipsis",
            },
          },
        },
      },
    });

  // Options de MUIDataTable
  const options = {
    filterType: "checkbox",
    selectableRows: "none",
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 50, 70, 100],
    search: true,
    download: true,
    setRowProps: (_, dataIndex) => {
      // Vérifie si le ticket est fermé
      const rowData = rows[dataIndex];
      return {
        style: {
          backgroundColor: rowData.isClosed ? "" : "inherit", // Vert si fermé
        },
      };
    },
  };

  return (
    <>
      <div className="flex justify-end gap-4">
        <Button onClick={handleDownloadExcel} variant="outlined">
          Télécharger Excel
        </Button>
      </div>
      <div className="w-[100%] py-3">
        {loading ? (
          <p>Chargement des données...</p>
        ) : (
          <ThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              title={"Historique des Interventions"}
              data={rows}
              columns={columns}
              options={options}
            />
          </ThemeProvider>
        )}
      </div>
    </>
  );
};

export default HistoriqueIntervention;
