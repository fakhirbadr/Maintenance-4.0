import React, { useEffect, useState } from "react";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MUIDataTable from "mui-datatables";
import UpdateDialog from "./updateBesoin"; // Import du composant UpdateDialog
import moment from "moment";

import { CheckCircle, Edit, Eye, Delete } from "lucide-react"; // Icônes Lucide React
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
import * as XLSX from "xlsx"; // Import XLSX to handle the Excel export

const ListeBesoin = () => {
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Collaborateurs");
    XLSX.writeFile(workbook, "demande_fourniture.xlsx");
  };
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closedRows, setClosedRows] = useState(new Set()); // New state to track closed rows
  const [openDialog, setOpenDialog] = useState(false); // Gestion de l'ouverture du dialogue
  const [selectedFourniture, setSelectedFourniture] = useState(null); // Fourniture sélectionnée pour modification
  const [updatedName, setUpdatedName] = useState(""); // Valeur modifiable du nom
  const [updatedCategorie, setUpdatedCategorie] = useState(""); // Valeur modifiable de la catégorie
  const [updatedBesoin, setUpdatedBesoin] = useState(""); // Valeur modifiable du besoin
  const [updatedQuantite, setUpdatedQuantite] = useState(""); // Valeur modifiable de la quantité
  const [updatedCommentaire, setUpdatedCommentaire] = useState(""); // Valeur modifiable de la commentaire

  const [openViewDialog, setOpenViewDialog] = useState(false); // State to control View Dialog visibility
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [timeElapsed, setTimeElapsed] = useState(""); // Timer state to show elapsed time

  const fetchFournitures = async () => {
    try {
      const response = await axios.get(
        "https://backend-v1-e3bx.onrender.com/api/v1/fournitureRoutes?isClosed=false"
      );
      setRows(response.data); // Assurez-vous que la structure des données de l'API correspond
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des fournitures :", error);
      setLoading(false);
    }
  };

  // Handle view dialog opening and start timer
  const handleView = (rowIndex) => {
    const rowData = rows[rowIndex];
    setSelectedFourniture(rowData); // Set selected row
    setOpenViewDialog(true); // Open the View dialog
    startTimer(rowData.dateCreation); // Start the countdown timer
  };
  // Start the timer to show elapsed time
  const startTimer = (creationDate) => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const timeDiff = currentTime - new Date(creationDate);
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setTimeElapsed(`${hours}h ${minutes}m ${seconds}s`); // Update elapsed time

      // Optionally stop the timer after a certain period
    }, 1000);

    return () => clearInterval(interval); // Cleanup timer on component unmount
  };
  const handleCloseViewDialog = () => {
    setOpenViewDialog(false); // Close the View dialog
  };

  const handleEdit = (rowIndex) => {
    const rowData = rows[rowIndex];
    setSelectedFourniture(rowData); // Mettre à jour la ligne sélectionnée
    setUpdatedName(rowData.name); // Mettre à jour le formulaire avec les données existantes
    setUpdatedCategorie(rowData.categorie);
    setUpdatedBesoin(rowData.besoin);
    setUpdatedQuantite(rowData.quantite);
    setUpdatedStatus(rowData.status);
    setUpdatedCommentaire(rowData.commentaire);

    setOpenDialog(true); // Ouvrir le dialogue pour modification
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleChange = (event) => {
    setUpdatedStatus(event.target.value);
  };
  const handleUpdateFourniture = async () => {
    try {
      await axios.patch(
        `https://maintenance-4-0-backend-9.onrender.com/api/v1/fournitureRoutes/${selectedFourniture._id}`,
        {
          name: updatedName,
          categorie: updatedCategorie,
          besoin: updatedBesoin,
          quantite: updatedQuantite,
          status: updatedStatus,
          commentaire: updatedCommentaire,
        }
      );

      // Mettre à jour la ligne localement dans l'état après la modification
      setRows((prevRows) =>
        prevRows.map((row) =>
          row._id === selectedFourniture._id
            ? {
                ...row,
                name: updatedName,
                categorie: updatedCategorie,
                besoin: updatedBesoin,
                quantite: updatedQuantite,
                status: updatedStatus,
                commentaire: updatedCommentaire,
              }
            : row
        )
      );

      setOpenDialog(false); // Fermer le dialogue après la mise à jour
      alert("Fourniture mise à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la fourniture :", error);
      alert("Erreur lors de la mise à jour de la fourniture");
    }
  };

  const handleClose = async (rowIndex) => {
    const rowData = rows[rowIndex]; // Get the selected row data
    console.log("Clôturer :", rowData);

    try {
      const currentDate = new Date(); // Get the current date and time
      currentDate.setHours(currentDate.getHours()); // Ajoute 1 heure si nécessaire (pour ajuster selon le fuseau horaire)

      // Send a PATCH request to update `isClosed` and `dateCloture`
      const response = await axios.patch(
        `https://backend-v1-e3bx.onrender.com/api/v1/fournitureRoutes/${rowData._id}`,
        {
          isClosed: true,
          dateCloture: currentDate.toISOString(), // Format ISO for the date
        }
      );

      // Check if the request was successful
      if (response.status === 200) {
        // Update the state locally after successful request
        setRows((prevRows) =>
          prevRows.map((row) =>
            row._id === rowData._id
              ? {
                  ...row,
                  isClosed: true,
                  dateCloture: currentDate.toISOString(),
                }
              : row
          )
        );
        alert("Fourniture clôturée avec succès");
      } else {
        console.error(
          "Erreur lors de la mise à jour sur le serveur :",
          response
        );
        alert("Impossible de clôturer la fourniture. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de la clôture de l'élément :", error.message);
      alert(
        "Erreur lors de la clôture de l'élément. Veuillez vérifier votre connexion ou réessayer."
      );
    }
  };

  const handleDelete = async (rowIndex) => {
    const rowData = rows[rowIndex];
    console.log("Supprimer :", rowData);

    if (window.confirm("Voulez-vous vraiment supprimer cet élément ?")) {
      try {
        // Send a DELETE request to the backend
        await axios.delete(
          `https://backend-v1-e3bx.onrender.com/api/v1/fournitureRoutes/${rowData._id}`
        );

        // Remove the item from the local state after successful deletion
        setRows(rows.filter((_, index) => index !== rowIndex));
        alert("Fourniture supprimée avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression de l'élément :", error);
        alert("Erreur lors de la suppression de l'élément");
      }
    }
  };

  useEffect(() => {
    fetchFournitures();
  }, []);

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
      options: { filter: true, sort: true },
    },
    {
      name: "technicien",
      label: "Technicien",
      options: { filter: true, sort: true },
    },

    {
      name: "status",
      label: "Status",
      options: { filter: true, sort: true },
    },
    {
      name: "commentaire",
      label: "commentaire responsable",
      options: { filter: true, sort: true },
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
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex; // Obtient l'index de la ligne
          return (
            <div style={{ display: "flex", gap: "8px" }}>
              <IconButton onClick={() => handleView(rowIndex)} color="primary">
                <Eye />
              </IconButton>
              <IconButton onClick={() => handleEdit(rowIndex)} color="default">
                <Edit />
              </IconButton>
              <IconButton
                onClick={() => handleDelete(rowIndex)}
                color="secondary"
              >
                <Delete />
              </IconButton>
              <IconButton onClick={() => handleClose(rowIndex)} color="success">
                <CheckCircle />
              </IconButton>
            </div>
          );
        },
      },
    },
  ];

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
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 50, 70, 100],
    search: true,
    download: true,
    setRowProps: (_, dataIndex) => {
      // Check if the ticket is closed
      const rowData = rows[dataIndex];
      return {
        style: {
          backgroundColor: rowData.isClosed ? "#4CAF50" : "inherit", // Green if closed
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
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Gestion des fournitures"}
            data={rows}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Modifier la fourniture</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nom"
              type="text"
              fullWidth
              variant="standard"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Catégorie"
              type="text"
              fullWidth
              variant="standard"
              value={updatedCategorie}
              onChange={(e) => setUpdatedCategorie(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Besoin"
              type="text"
              fullWidth
              variant="standard"
              value={updatedBesoin}
              onChange={(e) => setUpdatedBesoin(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Quantité"
              type="number"
              fullWidth
              variant="standard"
              value={updatedQuantite}
              onChange={(e) => setUpdatedQuantite(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Commentaire responsable"
              type="text"
              fullWidth
              variant="standard"
              value={updatedCommentaire}
              onChange={(e) => setUpdatedCommentaire(e.target.value)}
            />

            <TextField
              margin="dense"
              label="Date de création"
              type="text"
              fullWidth
              variant="standard"
              value={
                selectedFourniture
                  ? new Date(selectedFourniture.dateCreation).toLocaleString(
                      "fr-FR",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }
                    )
                  : ""
              }
              disabled
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={updatedStatus}
                onChange={handleChange}
                label="Status"
                name="status"
              >
                {["Ouvert", "En cours", "Livré"].map((status, index) => (
                  <MenuItem key={index} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}{" "}
                    {/* Capitalize first letter */}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Annuler
            </Button>
            <Button onClick={handleUpdateFourniture} color="primary">
              Mettre à jour
            </Button>
          </DialogActions>
        </Dialog>
        {/* View Dialog */}
        <Dialog open={openViewDialog} onClose={handleCloseViewDialog}>
          <DialogTitle>Voir la fourniture</DialogTitle>
          <DialogContent>
            {selectedFourniture && (
              <>
                <TextField
                  margin="dense"
                  label="Nom"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={selectedFourniture.name}
                  disabled
                />
                <TextField
                  margin="dense"
                  label="Besoin"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={selectedFourniture.besoin}
                  disabled
                />
                <TextField
                  margin="dense"
                  label="Quantité"
                  type="number"
                  fullWidth
                  variant="standard"
                  value={selectedFourniture?.quantite || ""}
                  disabled
                />
                <TextField
                  margin="dense"
                  label="Technicien"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={selectedFourniture?.technicien || ""}
                  disabled
                />{" "}
                <TextField
                  margin="dense"
                  label="Status"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={selectedFourniture?.status || ""}
                  disabled
                />
                <TextField
                  margin="dense"
                  label="Commentaire responsable"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={selectedFourniture?.commentaire || ""}
                  disabled
                />
                <TextField
                  margin="dense"
                  label="Date de création"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={new Date(
                    selectedFourniture.dateCreation
                  ).toLocaleString("fr-FR")}
                  disabled
                />
                <Typography variant="h6" style={{ marginTop: "10px" }}>
                  Temps écoulé : {timeElapsed}
                </Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseViewDialog} color="primary">
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default ListeBesoin;
