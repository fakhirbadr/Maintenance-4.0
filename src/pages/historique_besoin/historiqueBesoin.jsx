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
    // Mapper les données pour inclure les colonnes souhaitées
    const formattedRows = rows.map((row) => {
      const dateCreation = new Date(row.dateCreation);
      const dateCloture = row.dateCloture ? new Date(row.dateCloture) : null;

      return {
        Nom: row.name,
        Région: row.region,
        Province: row.province,
        Catégorie: row.categorie,
        Besoin: row.besoin,
        Quantité: row.quantite,
        "Créé par": row.technicien,
        Commentaire: row.commentaire,
        "Date de création": dateCreation.toLocaleDateString("fr-FR"),
        "Heure de création": dateCreation.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        "Date de clôture": dateCloture
          ? dateCloture.toLocaleDateString("fr-FR")
          : "N/A",
        "Heure de clôture": dateCloture
          ? dateCloture.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A",
        Statut: row.isClosed ? "Fermé" : "Ouvert",
        "Temps de réponse": calculateResponseTime(
          row.dateCreation,
          row.dateCloture
        ),
      };
    });

    // Générer le fichier Excel
    const worksheet = XLSX.utils.json_to_sheet(formattedRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historique des Besoins");
    XLSX.writeFile(workbook, "Historique des Besoins.xlsx");
  };

  // Fonction pour calculer le temps de réponse
  const calculateResponseTime = (dateCreation, dateCloture) => {
    if (!dateCreation || !dateCloture) return "N/A";

    const duration = dayjs.duration(
      dayjs(dateCloture).diff(dayjs(dateCreation))
    );
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();

    return `${hours}h ${minutes}m`;
  };

  const [rows, setRows] = useState([]); // Store data
  const [loading, setLoading] = useState(true); // Loading state

  // Define table columns
  const columns = [
    {
      name: "region",
      label: "Region",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "province",
      label: "Province",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "name",
      label: "Nom",
      options: { filter: true, sort: true, filterType: "dropdown" },
    },
    {
      name: "categorie",
      label: "Catégorie",
      options: { filter: true, sort: true, filterType: "dropdown" },
    },
    {
      name: "besoin",
      label: "Besoin",
      options: { filter: true, sort: true, filterType: "dropdown" },
    },
    {
      name: "quantite",
      label: "Quantité",
      options: { filter: false, sort: true },
    },
    {
      name: "technicien",
      label: "créé par",
      options: { filter: true, sort: true, filterType: "dropdown" },
    },
    {
      name: "commentaire",
      label: "commentaire ",
      options: { filter: true, sort: true, filterType: "dropdown" },
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
        filterType: "dropdown",
      },
    },
    {
      name: "dateCloture",
      label: "Date de Clôture",
      options: {
        customBodyRender: (value) =>
          value ? dayjs(value).format("DD/MM/YY HH:mm") : "N/A", // Affiche "N/A" si dateCloture est null
        filterType: "dropdown",
      },
    },
    {
      name: "isClosed",
      label: "Statut",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => (value ? "Fermé" : "Ouvert"),
        filterType: "dropdown",
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
        filterType: "dropdown",
      },
    },
  ];

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Effectuer les deux appels d'API en parallèle
        const [fournitureResponse, subTicketResponse] = await Promise.all([
          axios.get(
            "https://backend-v1-1.onrender.com/api/v1/fournitureRoutes?isClosed=true"
          ),
          axios.get(
            "https://backend-v1-1.onrender.com/api/v1/subtickets?isClosed=true"
          ),
        ]);

        // Mapper les données de fourniture
        const fournitures = fournitureResponse.data.fournitures.map((item) => ({
          id: item.id,
          name: item.name,
          region: item.region,
          province: item.province,
          categorie: item.categorie,
          technicien: item.technicien,
          besoin: item.besoin,
          quantite: item.quantite,
          commentaire: item.commentaire,
          dateCreation: new Date(item.dateCreation),
          dateCloture: new Date(item.dateCloture),
          source: "source1",
        }));

        // Mapper les données des sous-tickets
        const subTickets = subTicketResponse.data.subTickets.map((item) => ({
          id: item.id,
          name: item.name,
          region: item.region,
          province: item.province,
          categorie: item.categorie,
          technicien: item.technicien,
          besoin: item.equipement_deficitaire,
          quantite: item.quantite,
          commentaire: item.commentaire,
          dateCreation: new Date(item.createdAt),
          dateCloture: new Date(item.updatedAt),
          source: "source2",
        }));

        // Fusionner les deux listes
        const combinedData = [...fournitures, ...subTickets];

        // Trier par date de clôture (ordre décroissant)
        combinedData.sort((a, b) => b.dateCloture - a.dateCloture);

        // Mettre à jour les lignes du tableau
        setRows(combinedData);
        setLoading(false);
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
