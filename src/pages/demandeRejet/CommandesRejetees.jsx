import { useEffect, useState } from "react";
import { ContentCopy } from "@mui/icons-material";
import { Tooltip, Button } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";
import * as XLSX from "xlsx"; // ✅ Import pour Excel

const CommandesRejetees = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/fournitureRoutes?isClosed=false&isDeleted=true`
        );
        console.log("Données récupérées :", response.data.fournitures);

        const sortedData = response.data.fournitures.sort((a, b) => {
          return new Date(b.dateCreation) - new Date(a.dateCreation);
        });

        setRows(sortedData);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };

    fetchData();
  }, []);

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Commandes rejetées");
    XLSX.writeFile(workbook, "commandes_rejetees.xlsx");
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
    rowsPerPage: 50,
    rowsPerPageOptions: [10, 50, 70, 100],
    search: true,
    download: false, // ❌ Désactivé car on gère nous-mêmes l'export
    setRowProps: () => ({}),
  };

  const columns = [
    {
      name: "_id",
      label: "",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => (
          <div className="flex items-center">
            <Tooltip title="Copier ID">
              <ContentCopy
                sx={{
                  cursor: "pointer",
                  marginLeft: "8px",
                  color: "#2973B2",
                }}
                onClick={() => {
                  navigator.clipboard.writeText(value);
                }}
              />
            </Tooltip>
          </div>
        ),
      },
    },
    {
      name: "dateCreation",
      label: "Date de création",
      options: {
        filter: true,
        sort: true,
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
    { name: "name", label: "Nom" },
    { name: "region", label: "Region" },
    { name: "province", label: "Province" },
    { name: "status", label: "status" },
    { name: "categorie", label: "Catégorie" },
    { name: "besoin", label: "Besoin" },
    { name: "quantite", label: "Quantité" },
    { name: "technicien", label: "Créé par" },
    { name: "commentaire", label: "Commentaire responsable" },
    { name: "deletedBy", label: "Supprimé par" },
    { name: "raisonRejet", label: "raison de Rejet" },
  ];

  return (
    <ThemeProvider theme={getMuiTheme()}>
      <div className="mb-4">
        <Button variant="outlined" onClick={handleDownloadExcel}>
          Télécharger Excel
        </Button>
      </div>

      <MUIDataTable
        title={"Liste des commandes rejetées (supprimées)"}
        data={rows}
        columns={columns}
        options={options}
      />
    </ThemeProvider>
  );
};

export default CommandesRejetees;
