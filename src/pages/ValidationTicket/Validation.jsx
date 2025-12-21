import React, { useEffect, useState } from "react";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MUIDataTable from "mui-datatables";
import ChecklistIcon from '@mui/icons-material/Checklist';
import { Edit, Eye, Delete } from "lucide-react";
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
import * as XLSX from "xlsx";
const apiUrl = import.meta.env.VITE_API_URL;

const Validation = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFourniture, setSelectedFourniture] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedCategorie, setUpdatedCategorie] = useState("");
  const [updatedBesoin, setUpdatedBesoin] = useState("");
  const [updatedQuantite, setUpdatedQuantite] = useState("");
  const [updatedCommentaire, setUpdatedCommentaire] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState("");
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  // Pour sélection multiple
  const [selectedRows, setSelectedRows] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [pendingRowsToOpen, setPendingRowsToOpen] = useState([]);

  const fetchFournitures = async () => {
    try {
      const [source1Response, source2Response] = await Promise.all([
        axios.get(
          `${apiUrl}/api/v1/fournitureRoutes?isClosed=false&status=créé&isDeleted=false`
        ),
        axios.get(`${apiUrl}/api/v1/subtickets?isClosed=false&status=créé`),
      ]);
      const source1Data = source1Response.data.fournitures.map((item) => ({
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
        status: item.status,
        source: "source1",
      }));
      const source2Data = source2Response.data.subTickets.map((item) => ({
        id: item._id,
        name: item.site,
        region: item.region,
        province: item.province,
        technicien: item.technicien,
        categorie: item.categorie,
        quantite: item.quantite,
        besoin: item.equipement_deficitaire,
        commentaire: item.commentaire,
        dateCreation: new Date(item.createdAt),
        status: item.status,
        source: "source2",
        parentId: item.parentId,
      }));
      const combinedData = [...source1Data, ...source2Data];
      combinedData.sort((a, b) => b.dateCreation - a.dateCreation);
      
      // Détecter les doublons - marquer seulement la plus récente
      const duplicateGroups = {};
      
      combinedData.forEach((item, index) => {
        const key = `${item.name}|${item.region}|${item.province}|${item.categorie}|${item.besoin}`;
        
        if (!duplicateGroups[key]) {
          duplicateGroups[key] = [];
        }
        duplicateGroups[key].push(index);
      });
      
      // Marquer seulement la plus récente de chaque groupe de doublons (qui a plus d'un élément)
      combinedData.forEach((item, index) => {
        const key = `${item.name}|${item.region}|${item.province}|${item.categorie}|${item.besoin}`;
        const group = duplicateGroups[key];
        
        // Si le groupe a plus d'un élément ET c'est le premier (le plus récent car trié par date desc)
        item.isDuplicate = group.length > 1 && group[0] === index;
      });
      
      setRows(combinedData);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      setLoading(false);
    }
  };

  // Excel export
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Collaborateurs");
    XLSX.writeFile(workbook, "demande_fourniture.xlsx");
  };

  // Sélection d'une ligne pour view
  const handleView = (rowIndex) => {
    const rowData = rows[rowIndex];
    setSelectedFourniture(rowData);
    setOpenViewDialog(true);
    startTimer(rowData.dateCreation);
  };
  const startTimer = (creationDate) => {
    let interval;
    interval = setInterval(() => {
      const currentTime = new Date();
      const timeDiff = currentTime - new Date(creationDate);
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      setTimeElapsed(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(interval);
  };
  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
  };

  // Edit
  const handleEdit = (rowIndex) => {
    const rowData = rows[rowIndex];
    setSelectedFourniture(rowData);
    setUpdatedName(rowData.name);
    setUpdatedCategorie(rowData.categorie);
    setUpdatedBesoin(rowData.besoin);
    setUpdatedQuantite(rowData.quantite);
    setUpdatedStatus(rowData.status);
    setUpdatedCommentaire(rowData.commentaire);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleChange = (event) => {
    setUpdatedStatus(event.target.value);
  };
  const handleUpdateFourniture = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      if (selectedFourniture.source === "source2") {
        const { id: subTicketId } = selectedFourniture;
        await axios.patch(
          `${apiUrl}/api/v1/sub-tickets/${subTicketId}`,
          {
            name: updatedName,
            categorie: updatedCategorie,
            besoin: updatedBesoin,
            quantite: updatedQuantite,
            status: updatedStatus,
            commentaire: updatedCommentaire,
          },
          { headers }
        );
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === subTicketId
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
        alert("Sous-ticket mis à jour avec succès");
      } else if (selectedFourniture.source === "source1") {
        await axios.patch(
          `${apiUrl}/api/v1/fournitureRoutes/${selectedFourniture.id}`,
          {
            name: updatedName,
            categorie: updatedCategorie,
            besoin: updatedBesoin,
            quantite: updatedQuantite,
            status: updatedStatus,
            commentaire: updatedCommentaire,
          },
          { headers }
        );
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedFourniture.id
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
        alert("Fourniture mise à jour avec succès");
      }
      setOpenDialog(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la fourniture :", error);
      alert("Erreur lors de la mise à jour de la fourniture");
    }
  };

  // Delete
  const handleDelete = async (rowIndex) => {
    const rowData = rows[rowIndex];
    if (!rowData || !rowData.id || !rowData.source) {
      alert("Données invalides pour la suppression.");
      console.error(
        "Erreur: Données invalides pour la suppression. rowData:",
        rowData
      );
      return;
    }
    if (rowData.source === "source1") {
      setSelectedRowIndex(rowIndex);
      
      // Pré-remplir le motif si c'est un doublon
      if (rowData.isDuplicate) {
        setRejectReason("Demande en doublon - Déjà existante dans le système");
      } else {
        setRejectReason("");
      }
      
      setOpenRejectDialog(true);
    } else if (rowData.source === "source2") {
      if (window.confirm("Voulez-vous vraiment supprimer cet élément ?")) {
        try {
          const { parentId, id: subTicketId } = rowData;
          if (!parentId || !subTicketId) {
            alert("Parent ID ou Sub-ticket ID manquant.");
            console.error(
              "Erreur: Parent ID ou Sub-ticket ID manquant. rowData:",
              rowData
            );
            return;
          }
          const response = await axios.delete(
            `${apiUrl}/api/v1/ticketMaintenance/tickets/${parentId}/subTickets/${subTicketId}`
          );
          alert("Sous-ticket supprimé avec succès.");
          setRows((prevRows) =>
            prevRows.filter((_, index) => index !== rowIndex)
          );
        } catch (error) {
          console.error("Erreur lors de la suppression de l'élément :", error);
          alert(
            "Erreur lors de la suppression de l'élément. Veuillez réessayer."
          );
        }
      }
    }
  };
  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      alert("Veuillez fournir une raison de rejet.");
      return;
    }
    const rowData = rows[selectedRowIndex];
    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const deletedBy = JSON.parse(
        localStorage.getItem("userInfo")
      )?.nomComplet;
      if (!deletedBy) {
        alert("Erreur : utilisateur non identifié.");
        return;
      }
      await axios.patch(
        `${apiUrl}/api/v1/fournitureRoutes/${rowData.id}`,
        {
          isDeleted: true,
          deletedBy: deletedBy,
          raisonRejet: rejectReason,
        },
        { headers }
      );
      alert("Fourniture supprimée avec succès.");
      setRows((prevRows) =>
        prevRows.filter((_, index) => index !== selectedRowIndex)
      );
      setRejectReason("");
      setOpenRejectDialog(false);
    } catch (error) {
      console.error("Erreur lors de la suppression avec raison :", error);
      alert("Erreur lors de la suppression. Veuillez réessayer.");
    }
  };
  const handleRejectCancel = () => {
    setRejectReason("");
    setOpenRejectDialog(false);
  };

  // ---- MULTI OPEN STATUS ----
  const handleOpenStatus = (rowIndices) => {
    setPendingRowsToOpen(rowIndices);
    setOpenConfirmDialog(true);
  };

  const handleConfirmOpenStatus = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      for (const rowIndex of pendingRowsToOpen) {
        const rowData = rows[rowIndex];
        if (rowData.status && rowData.status.toLowerCase() === "créé") {
          if (rowData.source === "source1") {
            await axios.patch(`${apiUrl}/api/v1/fournitureRoutes/${rowData.id}`, {
              status: "OUVERT",
            }, { headers });
          } else if (rowData.source === "source2") {
            await axios.patch(`${apiUrl}/api/v1/sub-tickets/${rowData.id}`, {
              status: "OUVERT",
            }, { headers });
          }
        }
      }
      setRows(prevRows =>
        prevRows.map((row, idx) =>
          pendingRowsToOpen.includes(idx)
            ? { ...row, status: "OUVERT" }
            : row
        )
      );
      setOpenConfirmDialog(false);
      setPendingRowsToOpen([]);
      alert("Statut changé à OUVERT pour les éléments sélectionnés !");
    } catch (error) {
      alert("Erreur lors de la mise à jour du statut.");
      setOpenConfirmDialog(false);
    }
  };

  useEffect(() => {
    fetchFournitures();
  }, []);

  const columns = [
    {
      name: "name",
      label: "Nom",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "region",
      label: "Region",
      options: { filter: true, sort: false, filterType: "checkbox" },
    },
    {
      name: "province",
      label: "Province",
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
      label: "créé par",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "status",
      label: "Status",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "isDuplicate",
      label: "Doublon",
      options: {
        filter: true,
        sort: false,
        filterType: "checkbox",
        customBodyRender: (value) => {
          return value ? (
            <span style={{ 
              color: "#f44336", 
              fontWeight: "bold"
            }}>
              OUI
            </span>
          ) : null;
        },
      },
    },
    {
      name: "commentaire",
      label: "commentaire responsable",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "dateCreation",
      label: "Date de création",
      options: {
        filter: true,
        sort: false,
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
        filterType: "dropdown",
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex;
          return (
            <div style={{ display: "flex", gap: "1px" }}>
              <IconButton onClick={() => handleView(rowIndex)} color="primary">
                <Eye style={{ width: "18px", height: "18px" }} />
              </IconButton>
              <IconButton onClick={() => handleOpenStatus([rowIndex])} color="success">
                <ChecklistIcon style={{ width: "18px", height: "18px" }} />
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
    selectableRows: "multiple",
    rowsPerPage: 100,
    rowsPerPageOptions: [10, 50, 70, 100],
    search: true,
    download: true,
    onRowSelectionChange: (currentRowsSelected, allRowsSelected, rowsSelected) => {
      setSelectedRows(rowsSelected);
    },
    setRowProps: (_, dataIndex) => {
      const rowData = rows[dataIndex];
      
      // Garder seulement le style pour les demandes clôturées
      if (rowData.isClosed) {
        return {
          style: {
            backgroundColor: "#4CAF50",
          },
        };
      }
      
      return {};
    },
  };

  return (
    <>
      <div className="flex justify-end gap-4">
        <Button onClick={handleDownloadExcel} variant="outlined">
          Télécharger Excel
        </Button>
        <Button
          variant="contained"
          color="success"
          disabled={selectedRows.length === 0}
          onClick={() => handleOpenStatus(selectedRows)}
        >
          Ouvrir sélectionnés
        </Button>
      </div>
      <div className="w-[100%] py-3">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Validation des demandes"}
            data={rows}
            columns={columns}
            options={options}
          />
        </ThemeProvider>

        {/* Dialog edit */}
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
              disabled
            />
            <TextField
              margin="dense"
              label="Catégorie"
              type="text"
              fullWidth
              variant="standard"
              value={updatedCategorie}
              onChange={(e) => setUpdatedCategorie(e.target.value)}
              disabled
            />
            <TextField
              margin="dense"
              label="Besoin"
              type="text"
              fullWidth
              variant="standard"
              value={updatedBesoin}
              onChange={(e) => setUpdatedBesoin(e.target.value)}
              disabled
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
                {["Ouvert"].map((status, index) => (
                  <MenuItem key={index} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
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
                />
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

      <Dialog open={openRejectDialog} onClose={handleRejectCancel}>
        <DialogTitle>Raison de rejet</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Veuillez entrer la raison de rejet"
            type="text"
            fullWidth
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRejectCancel} color="primary">
            Annuler
          </Button>
          <Button onClick={handleRejectSubmit} color="secondary">
            Soumettre
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Confirmer l'ouverture</DialogTitle>
        <DialogContent>
          <Typography>
            Voulez-vous vraiment changer le status à <b>OUVERT</b> pour {pendingRowsToOpen.length} demande(s) ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={handleConfirmOpenStatus} color="success">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Validation;