import {
  Button,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { data } from "autoprefixer";
import axios from "axios";
import { CheckCircle, Delete, Edit, Eye } from "lucide-react";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx"; // Assurez-vous que XLSX est installé dans votre projet

const BesoinVehicule = () => {
  // Données fictives pour tester le tableau
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchVehicule = async () => {
    try {
      const response = await axios.get(
        "https://backend-v1-1.onrender.com/api/ticketvehicules?isClosed=false"
      );
      console.log(response.data); // Vérifiez ici
      setRows(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des fournitures :", error);
      setLoading(false);
    }
  };
  // Appeler fetchVehicule au montage du composant
  useEffect(() => {
    fetchVehicule();
  }, []); // [] signifie que l'effet s'exécute uniquement au montage

  // Afficher un message de chargement pendant la récupération des données
  if (loading) {
    return <p>Chargement des données...</p>;
  }

  // Gestion des actions
  const handleView = (rowIndex) => {
    console.log("Afficher la ligne :", rows[rowIndex]);
  };

  const handleEdit = (rowIndex) => {
    setSelectedRow(rows[rowIndex]);
    setOpenDialog(true);
  };

  const handleDelete = async (rowIndex) => {
    const rowData = rows[rowIndex];
    console.log("Supprimer :", rowData);

    if (window.confirm("Voulez-vous vraiment supprimer cet élément ?")) {
      try {
        // Send a DELETE request to the backend
        await axios.delete(
          `https://backend-v1-1.onrender.com/api/ticketvehicules/${rowData._id}`
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

  const handleClose = async (rowIndex) => {
    const rowData = rows[rowIndex]; // Get the selected row data
    console.log("Clôturer :", rowData);

    try {
      const currentDate = new Date(); // Get the current date and time
      currentDate.setHours(currentDate.getHours()); // Ajoute 1 heure si nécessaire (pour ajuster selon le fuseau horaire)

      // Send a PATCH request to update `isClosed` and `dateCloture`
      const response = await axios.put(
        `https://backend-v1-1.onrender.com/api/ticketvehicules/${rowData._id}`,

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
        alert("Demande clôturée avec succès");
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
  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  const handleDialogSave = async () => {
    if (!selectedRow) return;

    try {
      const response = await axios.put(
        `https://backend-v1-1.onrender.com/api/ticketvehicules/${selectedRow._id}`,
        selectedRow
      );

      if (response.status === 200) {
        setRows((prevRows) =>
          prevRows.map((row) =>
            row._id === selectedRow._id ? selectedRow : row
          )
        );
        alert("Mise à jour réussie");
        setOpenDialog(false);
      } else {
        alert("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Collaborateurs");
    XLSX.writeFile(workbook, "demande_véhicule.xlsx");
  };

  // Définition des colonnes
  const columns = [
    {
      name: "technicien",
      label: "créé par",
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
      name: "KM",
      label: "kilométrage",
      options: { filter: true, sort: true },
    },
    {
      name: "prix",
      label: "Prix",
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
      label: "ACTION",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex;
          return (
            <div style={{ display: "flex", gap: "8px" }}>
              <IconButton onClick={() => handleView(rowIndex)} color="primary">
                <Eye style={{ width: "18px", height: "18px" }} />
              </IconButton>
              <IconButton onClick={() => handleEdit(rowIndex)} color="default">
                <Edit style={{ width: "18px", height: "18px" }} />
              </IconButton>
              <IconButton
                onClick={() => handleDelete(rowIndex)}
                color="secondary"
              >
                <Delete style={{ width: "18px", height: "18px" }} />
              </IconButton>
              <IconButton onClick={() => handleClose(rowIndex)} color="success">
                <CheckCircle style={{ width: "18px", height: "18px" }} />
              </IconButton>
            </div>
          );
        },
      },
    },
  ];

  // Thème personnalisé
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

  // Options du tableau
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
          backgroundColor: rowData.isClosed ? "#4CAF50" : "inherit",
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
            title={"Gestion des demande véhicule"}
            data={rows}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      </div>
      {/* Dialog for Editing */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Modifier la demande</DialogTitle>
        <DialogContent>
          {selectedRow && (
            <>
              <TextField
                label="Technicien"
                value={selectedRow.technicien}
                onChange={(e) =>
                  setSelectedRow({ ...selectedRow, technicien: e.target.value })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Immatriculation"
                value={selectedRow.immatriculation}
                onChange={(e) =>
                  setSelectedRow({
                    ...selectedRow,
                    immatriculation: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Catégorie"
                value={selectedRow.categorie}
                onChange={(e) =>
                  setSelectedRow({ ...selectedRow, categorie: e.target.value })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Besoin"
                value={selectedRow.commande}
                onChange={(e) =>
                  setSelectedRow({ ...selectedRow, commande: e.target.value })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={selectedRow.description}
                onChange={(e) =>
                  setSelectedRow({
                    ...selectedRow,
                    description: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Commentaire responsable"
                value={selectedRow.commentaire}
                onChange={(e) =>
                  setSelectedRow({
                    ...selectedRow,
                    commentaire: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              {/* Dropdown for status */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Statut</InputLabel>
                <Select
                  value={selectedRow.status || ""}
                  onChange={(e) =>
                    setSelectedRow({
                      ...selectedRow,
                      status: e.target.value,
                    })
                  }
                >
                  <MenuItem value="cree">Créé</MenuItem>
                  <MenuItem value="ouvert">Ouvert</MenuItem>
                  <MenuItem value="livre">Livré</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleDialogSave} color="primary">
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BesoinVehicule;
