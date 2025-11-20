import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MUIDataTable from "mui-datatables";
import * as XLSX from "xlsx";
import axios from "axios";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const TicketDemandes = () => {
  const [name, setName] = useState("");
  const [rows, setRows] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!name) return;
      try {
        // Charger les commandes (fournitureRoutes)
        const commandesResponse = await axios.get(
          `${apiUrl}/api/v1/fournitureRoutes?technicien=${name}&isDeleted=false`
        );
        const commandes = commandesResponse.data.fournitures || [];

        // Charger les sous-tickets
        const subticketsResponse = await axios.get(
          `${apiUrl}/api/v1/subtickets?technicien=${name}`
        );
        const subtickets = subticketsResponse.data.subTickets || [];
        console.log("Commandes:", commandes);
        console.log("Sous-tickets:", subtickets);

        // Normaliser et fusionner les données
        // Ajout d'un champ "type" pour distinguer commandes / sous-tickets
        const commandesNormalized = commandes.map((item) => ({
          id: item._id || item.id,
          name: item.name || item.titre || "—",
          categorie: item.categorie || "—",
          besoin: item.besoin || item.description || "—",
          quantite: item.quantite || 0,
          technicien: item.technicien || "—",
          status: item.status || "—",
          isClosed: item.isClosed || false,
          commentaire: item.commentaire || "",
          dateCreation: item.dateCreation || item.createdAt || "",
          technicienReception: item.technicienReception || "",
          type: "Commande",
        }));

        const subticketsNormalized = subtickets.map((item) => ({
          id: item._id || item.id,
          name: item.name || item.titre || "—",
          categorie: item.categorie || "—",
          besoin: item.description || "—",
          quantite: item.quantite || 0,
          technicien: item.technicien || "—",
          status: item.status || "—",
          isClosed: item.isClosed || false,
          commentaire: item.commentaire || "",
          dateCreation: item.dateCreation || item.createdAt || "",
          technicienReception: item.technicienReception || "",
          type: "Sous-ticket",
        }));

        // Fusionner les deux tableaux
        let mergedRows = [...commandesNormalized, ...subticketsNormalized];

        // --- AFFICHER LES NOUVEAUX TICKETS EN PREMIER ---
        mergedRows = mergedRows.sort((a, b) => {
          // Si dateCreation n'est pas valide, remonter en haut
          const dateA = a.dateCreation ? new Date(a.dateCreation).getTime() : 0;
          const dateB = b.dateCreation ? new Date(b.dateCreation).getTime() : 0;
          return dateB - dateA; // Les plus récents (plus grande date) en premier
        });

        setRows(mergedRows);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    fetchData();
  }, [name]);

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");
    XLSX.writeFile(workbook, "tickets_fourniture_et_subtickets.xlsx");
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

  const handleReceptionClick = (rowData) => {
    setSelectedRow(rowData);
    setConfirmDialogOpen(true);
  };

  const handleConfirmReception = async () => {
    const id = selectedRow.id;
    setLoadingId(id);
    setConfirmDialogOpen(false);
    
    try {
      if (selectedRow.type === "Commande") {
        // Pour les commandes (fournitures)
        const updateData = {
          status: "recu",
          technicienReception: name,
          name: selectedRow.name,
          categorie: selectedRow.categorie,
          besoin: selectedRow.besoin,
          quantite: selectedRow.quantite,
          isClosed: selectedRow.isClosed,
          commentaire: selectedRow.commentaire,
        };

        console.log(`Mise à jour fournitureRoutes avec ID:`, id);
        console.log("Données envoyées:", updateData);

        await axios.patch(`${apiUrl}/api/v1/fournitureRoutes/${id}`, updateData);
        
      } else {
        // Pour les sous-tickets - endpoint correct: /sub-tickets/:subTicketId
        const updateData = {
          status: "recu",
          technicienReception: name,
          name: selectedRow.name,
          categorie: selectedRow.categorie,
          description: selectedRow.besoin,
          quantite: selectedRow.quantite,
          isClosed: selectedRow.isClosed,
          commentaire: selectedRow.commentaire,
        };

        console.log(`Mise à jour sous-ticket avec ID:`, id);
        console.log("Données envoyées:", updateData);

        await axios.patch(`${apiUrl}/api/v1/sub-tickets/${id}`, updateData);
      }

      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id
            ? {
                ...row,
                status: "recu",
                technicienReception: name,
              }
            : row
        )
      );

      console.log("Accusé de réception effectué avec succès");
      
    } catch (error) {
      console.error("Erreur lors de l'accusé de réception :", error);
      console.error("Détails de l'erreur:", error.response?.data);
      
      let errorMessage = "Erreur inconnue";
      if (error.response?.status === 404) {
        errorMessage = `L'endpoint pour ${selectedRow.type} n'existe pas. Vérifiez la configuration des routes backend.`;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = error.message;
      }
      
      alert(`Erreur lors de l'accusé de réception : ${errorMessage}`);
    }
    
    setLoadingId(null);
    setSelectedRow(null);
  };

  const handleCancelReception = () => {
    setConfirmDialogOpen(false);
    setSelectedRow(null);
  };

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

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      if (userInfo.nomComplet) {
        setName(userInfo.nomComplet);
      }
    }
  }, []);

  const columns = [
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
      label: "Status",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "isClosed",
      label: "État",
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
        filterType: "dropdown",
        customBodyRender: (value) => {
          if (!value) return "—";
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
      name: "technicienReception",
      label: "Technicien réception",
      options: {
        filter: true,
        sort: false,
        filterType: "dropdown",
        customBodyRenderLite: (dataIndex) => {
          const row = rows[dataIndex];
          if (row.status === "recu") {
            return row.technicienReception || "—";
          }
          if (
            row.status === "En cours de livraison" ||
            row.status === "Achat sur place"
          ) {
            return (
              <Button
                variant="contained"
                color="success"
                size="small"
                disabled={loadingId === row.id}
                onClick={() => handleReceptionClick(row)}
              >
                {loadingId === row.id ? "..." : "Accuser réception"}
              </Button>
            );
          }
          return "—";
        },
      },
    },
    {
      name: "type",
      label: "Type",
      options: {
        filter: true,
        sort: true,
        filterType: "dropdown",
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
          <MUIDataTable title={"Gestion des Tickets"} data={rows} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <Dialog open={confirmDialogOpen} onClose={handleCancelReception}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Voulez-vous vraiment accuser la réception de cette demande ?
            <br />
            <strong>Type:</strong> {selectedRow?.type}
            <br />
            <strong>Nom:</strong> {selectedRow?.name}
            <br />
            Le statut sera automatiquement changé vers "recu".
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelReception} color="secondary">
            Annuler
          </Button>
          <Button
            onClick={handleConfirmReception}
            color="primary"
            variant="contained"
            disabled={loadingId === (selectedRow?.id)}
          >
            {loadingId === (selectedRow?.id) ? "Traitement..." : "Confirmer"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TicketDemandes;