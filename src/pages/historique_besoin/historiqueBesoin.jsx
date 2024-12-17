import React, { useState, useEffect } from "react";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from "lucide-react";
import * as XLSX from "xlsx"; // Import XLSX to handle the Excel export
import Button from "@mui/material/Button";
import dayjs from "dayjs";

// Define ExcelExporter outside of the component

const HistoriqueBesoin = () => {
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Collaborateurs");
    XLSX.writeFile(workbook, "Historique des Besoins.xlsx");
  };
  const [rows, setRows] = useState([]); // Store data
  const [loading, setLoading] = useState(true); // Loading state

  // Define table columns
  const columns = [
    { name: "name", label: "Nom", options: { filter: true, sort: true } },
    {
      name: "categorie",
      label: "Catégorie",
      options: { filter: true, sort: true },
    },
    { name: "besoin", label: "Besoin", options: { filter: true, sort: true } },
    {
      name: "quantite",
      label: "Quantité",
      options: { filter: false, sort: true },
    },
    {
      name: "technicien",
      label: "créé par",
      options: { filter: true, sort: true },
    },
    {
      name: "commentaire",
      label: "commentaire responsable",
      options: { filter: true, sort: true },
    },
    {
      name: "dateCreation",
      label: "Date de Création",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) =>
          new Date(value).toLocaleString("fr-FR", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
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
      label: "Temps de reponse",
      options: {
        customBodyRender: (_, rowData) => {
          const createdAt =
            rowData.rowData[
              columns.findIndex((c) => c.name === "dateCreation")
            ];
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

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://backend-v1-e3bx.onrender.com/api/v1/fournitureRoutes?isClosed=true"
        );
        setRows(response.data); // Update table rows
        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Define Material UI theme
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

  // MUIDataTable options
  const options = {
    filterType: "checkbox",
    selectableRows: "none",
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 50, 70, 100],
    search: true,
    download: true,
    setRowProps: (_, dataIndex) => {
      const rowData = rows[dataIndex];
      return {
        style: {
          backgroundColor: rowData.isClosed ? "" : "inherit", // Highlight closed rows in green
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

export default HistoriqueBesoin;
