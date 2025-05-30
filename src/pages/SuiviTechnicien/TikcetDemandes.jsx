import React, { useEffect, useState } from "react";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MUIDataTable from "mui-datatables";
import * as XLSX from "xlsx";
import moment from "moment";
import axios from "axios";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;
const TicketDemandes = () => {
  const [name, setName] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!name) return; // Évite de faire une requête si name est vide
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/fournitureRoutes?technicien=${name}&isDeleted=false`
        );
        setRows(response.data.fournitures);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    fetchData();
  }, [name]); // Ajout de name comme dépendance

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Collaborateurs");
    XLSX.writeFile(workbook, "demande_fourniture.xlsx");
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
  const options = {
    filterType: "checkbox",
    selectableRows: "none",

    rowsPerPage: 100,
    rowsPerPageOptions: [10, 50, 70, 100],
    search: true,
    download: true,
    setRowProps: (_, dataIndex) => {
      // Check if the ticket is closed
      const rowData = rows[dataIndex];
      return {
        style: {
          backgroundColor: rowData.isClosed ? "" : "inherit", // Green if closed
        },
      };
    },
  };
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo); // Parse the stored JSON object

      if (userInfo.nomComplet) {
        setName(userInfo.nomComplet);
        // Mise à jour du technicien
      }

      console.log(name);
    }
  }, []);
  const columns = [
    // { name: "id", options: { filter: false } },
    {
      name: "name",
      label: "Nom",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "categorie",
      label: "Catégorie",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "besoin",
      label: "Besoin",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "quantite",
      label: "Quantité",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "technicien",
      label: "Créé par",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "status",
      label: "status",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "isClosed",
      label: "etat",
      options: {
        filter: true,
        filterType: "dropdown",
        customBodyRender: (value) => (value ? "traité" : "en cours"),
        filterOptions: {
          names: ["traité", "en cours"], // Valeurs personnalisées dans la liste déroulante
          logic: (value, filterValue) => {
            if (filterValue.length === 0) return false; // Aucune condition si aucun filtre sélectionné
            return (
              (filterValue.includes("traité") && !value) ||
              (filterValue.includes("en cours") && value)
            );
          },
        },
      },
    },
    {
      name: "commentaire",
      label: "Commentaire responsable",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "dateCreation",
      label: "Date de création",
      options: {
        filter: true,
        sort: false,
        filterType: "dropdown", // Liste déroulante pour les dates
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
  ];

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
            title={"Gestion des fournitures"}
            data={rows}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      </div>
    </div>
  );
};

export default TicketDemandes;
