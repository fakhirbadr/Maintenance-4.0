import React, { useState, useEffect } from "react";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import * as XLSX from "xlsx"; // Import XLSX to handle the Excel export
import dayjs from "dayjs";

const HistoriqueVehicule = () => {
  const [rows, setRows] = useState([]); // Store data
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://backend-v1-e3bx.onrender.com/api/ticketvehicules?isClosed=true"
        );
        setRows(response.data); // Update table rows
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchData();
  }, []);

  // Handle Excel download
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historique des Besoins");
    XLSX.writeFile(workbook, "Historique_des_Besoins.xlsx");
  };

  // Define columns for the table
  const columns = [
    {
      name: "technicien",
      label: "Créé par",
      options: { filter: true, sort: true },
    },
    {
      name: "immatriculation",
      label: "immatriculation",
      options: { filter: true, sort: true },
    },
    {
      name: "categorie",
      label: "Catégorie",
      options: { filter: true, sort: true },
    },
    {
      name: "commande",
      label: "Besoin",
      options: { filter: true, sort: true },
    },

    {
      name: "description",
      label: "Description",
      options: { filter: true, sort: true },
    },

    {
      name: "commentaire",
      label: "Commentaire responsable",
      options: { filter: true, sort: true },
    },
    {
      name: "status",
      label: "Status",
      options: { filter: true, sort: true },
    },
    {
      name: "createdAt",
      label: "Date de Création",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value
            ? new Date(value).toLocaleString("fr-FR", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A";
        },
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
      name: "isClosed",
      label: "Statut",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => (value ? "Fermé" : "Ouvert"),
      },
    },
    {
      name: "tempsreponse",
      label: "Temps de Réponse",
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
              title={"Historique des Besoins"}
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

export default HistoriqueVehicule;
