import React, { useEffect, useState } from "react";
import {
  Button,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import MUIDataTable from "mui-datatables";
import * as XLSX from "xlsx";
import axios from "axios";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const TicketVehicule = () => {
  const [name, setName] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // Récupère le nom du technicien connecté
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      if (userInfo.nomComplet) {
        setName(userInfo.nomComplet);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!name) return; // Évite la requête si pas de nom
      try {
        const response = await axios.get(
          `${apiUrl}/api/ticketvehicules?technicien=${encodeURIComponent(name)}`
        );
        setRows(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des tickets véhicule :", error);
      }
    };
    fetchData();
  }, [name]);

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TicketsVehicule");
    XLSX.writeFile(workbook, "tickets_vehicule.xlsx");
  };

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

  const columns = [
    { name: "name", label: "Nom", options: { filter: true, sort: false, filterType: "dropdown" } },
    { name: "province", label: "Province", options: { filter: true, sort: false, filterType: "dropdown" } },
    { name: "technicien", label: "Technicien", options: { filter: true, sort: false, filterType: "dropdown" } },
    { name: "categorie", label: "Catégorie", options: { filter: true, sort: false, filterType: "dropdown" } },
    { name: "commande", label: "Commande", options: { filter: true, sort: false, filterType: "dropdown" } },
    { name: "marque", label: "Marque", options: { filter: true, sort: false, filterType: "dropdown" } },
    { name: "immatriculation", label: "Immatriculation", options: { filter: true, sort: false, filterType: "dropdown" } },
    { name: "urgence", label: "Urgence", options: { filter: true, sort: false, filterType: "dropdown" } },
    { name: "KM", label: "KM", options: { filter: true, sort: false, filterType: "dropdown" } },
    { name: "prix", label: "Prix", options: { filter: true, sort: false, filterType: "dropdown" } },
    { name: "status", label: "Statut", options: { filter: true, sort: false, filterType: "dropdown" } },
    {
      name: "isClosed",
      label: "Etat",
      options: {
        filter: true,
        filterType: "dropdown",
        customBodyRender: (value) => (value ? "traité" : "en cours"),
        filterOptions: {
          names: ["traité", "en cours"],
          logic: (value, filterValue) => {
            if (filterValue.length === 0) return false;
            return (
              (filterValue.includes("traité") && !value) ||
              (filterValue.includes("en cours") && value)
            );
          },
        },
      },
    },
    { name: "commentaire", label: "Commentaire", options: { filter: true, sort: false, filterType: "dropdown" } },
    {
      name: "createdAt",
      label: "Date de création",
      options: {
        filter: true,
        sort: false,
        filterType: "dropdown",
        customBodyRender: (value) => {
          const date = new Date(value);
          return date.toLocaleString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        },
      },
    },
    {
      name: "dateCloture",
      label: "Date de clôture",
      options: {
        filter: true,
        sort: false,
        filterType: "dropdown",
        customBodyRender: (value) =>
          value
            ? new Date(value).toLocaleString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-",
      },
    },
  ];

  const options = {
    filterType: "checkbox",
    selectableRows: "none",
    rowsPerPage: 100,
    rowsPerPageOptions: [10, 50, 70, 100],
    search: true,
    download: true,
    setRowProps: (_, dataIndex) => {
      const rowData = rows[dataIndex];
      return {
        style: {
          backgroundColor: rowData.isClosed ? "" : "inherit",
        },
      };
    },
  };

  return (
    <div>
      <div className="flex justify-end gap-4">
        <Button onClick={handleDownloadExcel} variant="outlined">
          Télécharger Excel
        </Button>
      </div>
      <div className="w-[100%] py-3">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Gestion des tickets véhicule"}
            data={rows}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      </div>
    </div>
  );
};

export default TicketVehicule;