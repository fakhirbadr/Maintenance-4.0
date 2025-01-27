import React, { useEffect, useState } from "react";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MUIDataTable from "mui-datatables";
import UpdateDialog from "../besoin/updateBesoin"; // Import du composant UpdateDialog
import moment from "moment";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;
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
  Grid,
} from "@mui/material";
import * as XLSX from "xlsx"; // Import XLSX to handle the Excel export

const ModuleAchat = () => {
  const handleDownloadExcel = () => {
    // Filtrer les colonnes nécessaires
    const filteredRows = rows.map((row) => ({
      Nom: row.name,
      Région: row.region,
      Province: row.province,
      Catégorie: row.categorie,
      Besoin: row.besoin,
      Quantité: row.quantite,
      "Créé par": row.technicien,
      Status: row.status,
      "Commentaire Responsable": row.commentaire,
      "Date de Création": new Date(row.dateCreation).toLocaleDateString(
        "fr-FR"
      ),
      "Heure de Création": new Date(row.dateCreation).toLocaleTimeString(
        "fr-FR"
      ),
    }));

    // Générer le fichier Excel
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
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
  const [updatedPrix, setUpdatedPrix] = useState(0); // Valeur modifiable du prix (number)
  const [updatedTarifLivraison, setUpdatedTarifLivraison] = useState(0); // Valeur modifiable du tarif de livraison (number)
  const [updatedFournisseur, setUpdatedFournisseur] = useState(""); // Valeur modifiable du fournisseur (string)
  const [updateDateLivraisonEstimee, setUpdateDateLivraisonEstimee] =
    useState("");

  const [openViewDialog, setOpenViewDialog] = useState(false); // State to control View Dialog visibility
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [timeElapsed, setTimeElapsed] = useState(""); // Timer state to show elapsed time
  const handleChangeStatus = (event) => {
    const newStatus = event.target.value;
    setUpdatedStatus(newStatus);

    // Mettre à jour directement les lignes sans attendre la réponse de l'API
    const updatedRows = rows.map((row) =>
      row.id === selectedFourniture.id ? { ...row, status: newStatus } : row
    );

    setRows(updatedRows); // Mettre à jour l'état rows
  };
  const fetchFournitures = async () => {
    try {
      // Effectuer les deux requêtes en parallèle
      const [source1Response, source2Response] = await Promise.all([
        axios.get(
          `${apiUrl}/api/v1/fournitureRoutes?isClosed=false&status=Demandé aux achats,reçue par le service des achats,en cours traitement,lancé au finance,en stock`
        ),
        axios.get(
          `${apiUrl}/api/v1/subtickets?isClosed=false&status=Demandé aux achats,reçue par le service des achats,en cours traitement,lancé au finance,en stock`
        ),
      ]);

      // Mapper les données de la première source
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
        dateCreation: new Date(item.dateCreation), // Convertir en objet Date
        status: item.status,
        prix: item.prix,
        tarifLivraison: item.tarifLivraison,
        fournisseur: item.fournisseur,
        dateLivraisonEstimee: item.dateLivraisonEstimee,

        source: "source1",
      }));

      console.log("Données source 1 après mapping :", source1Data);

      // Mapper les données de la deuxième source
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
        dateCreation: new Date(item.createdAt), // Convertir en objet Date
        status: item.status,
        prix: item.prix,
        tarifLivraison: item.tarifLivraison,
        fournisseur: item.fournisseur,
        dateLivraisonEstimee: item.dateLivraisonEstimee,

        source: "source2",
        parentId: item.parentId,
      }));

      console.log("Données source 2 après mapping :", source2Data);

      // Fusionner les deux sources de données
      const combinedData = [...source1Data, ...source2Data];

      // Trier par date de création (ordre décroissant)
      combinedData.sort((a, b) => b.dateCreation - a.dateCreation);

      // Mettre à jour les lignes
      setRows(combinedData);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
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
    setUpdatedPrix(rowData.prix);
    setUpdatedTarifLivraison(rowData.tarifLivraison);
    setUpdatedFournisseur(rowData.fournisseur);
    setUpdateDateLivraisonEstimee(rowData.dateLivraisonEstimee);

    setOpenDialog(true); // Ouvrir le dialogue pour modification
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdateFourniture = async () => {
    try {
      if (selectedFourniture.source === "source2") {
        // Mise à jour pour source2 (utilisation de l'endpoint des sous-tickets)
        const { id: subTicketId } = selectedFourniture; // Récupérer l'ID du sous-ticket

        await axios.patch(
          `${apiUrl}/api/v1/sub-tickets/${subTicketId}`, // URL de mise à jour du sous-ticket
          {
            name: updatedName,
            categorie: updatedCategorie,
            besoin: updatedBesoin,
            quantite: updatedQuantite,
            status: updatedStatus,
            commentaire: updatedCommentaire,
            prix: updatedPrix,
            tarifLivraison: updatedTarifLivraison,
            fournisseur: updatedFournisseur,
            dateLivraisonEstimee: updateDateLivraisonEstimee,
          }
        );

        // Mettre à jour la ligne localement dans l'état après la modification
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
                  prix: updatedPrix,
                  tarifLivraison: updatedTarifLivraison,
                  fournisseur: updatedFournisseur,
                  dateLivraisonEstimee: updateDateLivraisonEstimee,
                }
              : row
          )
        );

        alert("Sous-ticket mis à jour avec succès");
      } else if (selectedFourniture.source === "source1") {
        // Mise à jour pour source1 (URL de fournitureRoutes)
        await axios.patch(
          `${apiUrl}/api/v1/fournitureRoutes/${selectedFourniture.id}`,
          {
            name: updatedName,
            categorie: updatedCategorie,
            besoin: updatedBesoin,
            quantite: updatedQuantite,
            status: updatedStatus,
            commentaire: updatedCommentaire,
            prix: updatedPrix,
            tarifLivraison: updatedTarifLivraison,
            fournisseur: updatedFournisseur,
            dateLivraisonEstimee: updateDateLivraisonEstimee,
          }
        );

        // Mettre à jour la ligne localement dans l'état après la modification
        setRows((prevRows) =>
          prevRows.map((row) =>
            row._id === selectedFourniture.id
              ? {
                  ...row,
                  name: updatedName,
                  categorie: updatedCategorie,
                  besoin: updatedBesoin,
                  quantite: updatedQuantite,
                  status: updatedStatus,
                  commentaire: updatedCommentaire,
                  prix: updatedPrix,
                  tarifLivraison: updatedTarifLivraison,
                  fournisseur: updatedFournisseur,
                  dateLivraisonEstimee: updateDateLivraisonEstimee,
                }
              : row
          )
        );

        alert("Fourniture mise à jour avec succès");
      }

      setOpenDialog(false); // Fermer le dialogue après la mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la fourniture :", error);
      alert("Erreur lors de la mise à jour de la fourniture");
    }
  };

  //   const handleClose = async (rowIndex) => {
  //     const rowData = rows[rowIndex]; // Récupérer les données de la ligne sélectionnée
  //     console.log("Clôturer :", rowData);

  //     try {
  //       const currentDate = new Date(); // Date et heure actuelles
  //       currentDate.setHours(currentDate.getHours()); // Ajustez si nécessaire

  //       // Vérifier l'origine de la donnée pour décider de l'API à appeler
  //       if (rowData.source === "source1") {
  //         // Clôturer le ticket parent pour "source1"
  //         const response = await axios.patch(
  //           `${apiUrl}/api/v1/fournitureRoutes/${rowData.id}`,
  //           {
  //             isClosed: true,
  //             dateCloture: currentDate.toISOString(),
  //           }
  //         );

  //         if (response.status === 200) {
  //           setRows((prevRows) =>
  //             prevRows.map((row) =>
  //               row.id === rowData.id
  //                 ? {
  //                     ...row,
  //                     isClosed: true,
  //                     dateCloture: currentDate.toISOString(),
  //                   }
  //                 : row
  //             )
  //           );
  //           alert("Fourniture clôturée avec succès");
  //         }
  //       } else if (rowData.source === "source2") {
  //         // Clôturer directement le ticket parent
  //         const firstPatchResponse = await axios.patch(
  //           `${apiUrl}/api/v1/ticketMaintenance/${rowData.parentId}`,
  //           {
  //             isClosed: true,
  //             dateCloture: currentDate.toISOString(),
  //             cloturerPar:
  //               JSON.parse(localStorage.getItem("userInfo"))?.nomComplet ||
  //               "Nom inconnu", // Récupère le nomComplet depuis localStorage, ou un nom par défaut
  //           }
  //         );

  //         if (firstPatchResponse.status === 200) {
  //           // Imprimer le ticket parent dans le console.log
  //           console.log("Ticket parent clôturé:", firstPatchResponse.data);

  //           const url = `${apiUrl}/api/actifs/${firstPatchResponse.data.selectedActifId}/categories/${firstPatchResponse.data.selectedCategoryId}/equipments/${firstPatchResponse.data.selectedEquipmentId}`;
  //           const body = {
  //             isFunctionel: true, // Exemple de mise à jour du statut
  //           };

  //           try {
  //             // Envoyer la requête PATCH pour mettre à jour l'équipement
  //             const patchResponse = await axios.put(url, body, {
  //               headers: {
  //                 "Content-Type": "application/json", // Définir le type de contenu comme JSON
  //               },
  //             });

  //             if (patchResponse.status === 200) {
  //               console.log("Mise à jour réussie de l'équipement");
  //             } else {
  //               console.error("Erreur lors de la mise à jour de l'équipement");
  //             }
  //           } catch (error) {
  //             console.error(
  //               "Erreur lors de la requête de mise à jour:",
  //               error.message
  //             );
  //           }

  //           // Clôturer directement le sous-ticket sans vérifier
  //           const subTicketId = rowData.id; // Supposons que vous avez l'ID du sous-ticket directement dans rowData
  //           if (subTicketId) {
  //             try {
  //               const subTicketResponse = await axios.patch(
  //                 `${apiUrl}/api/v1/sub-tickets/${subTicketId}`,
  //                 {
  //                   isClosed: true,
  //                   dateCloture: currentDate.toISOString(),
  //                 }
  //               );

  //               if (subTicketResponse.status === 200) {
  //                 console.log(`Sous-ticket ${subTicketId} clôturé avec succès`);
  //               } else {
  //                 console.error(
  //                   `Erreur lors de la mise à jour du sous-ticket ${subTicketId}`
  //                 );
  //               }
  //             } catch (error) {
  //               console.error(
  //                 `Erreur lors de la requête pour le sous-ticket ${subTicketId}: ${error.message}`
  //               );
  //             }
  //           }

  //           // Après avoir fermé le sous-ticket, mettre à jour le ticket parent
  //           setRows((prevRows) =>
  //             prevRows.map((row) =>
  //               row.id === rowData.id
  //                 ? {
  //                     ...row,
  //                     isClosed: true,
  //                     dateCloture: currentDate.toISOString(),
  //                   }
  //                 : row
  //             )
  //           );
  //           alert("Sous-ticket et ticket parent clôturés avec succès");
  //         } else {
  //           console.error("Erreur lors de la clôture du ticket parent");
  //           alert("Erreur lors de la clôture du ticket parent.");
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Erreur lors de la clôture de l'élément :", error.message);
  //       alert(
  //         "Erreur lors de la clôture de l'élément. Veuillez vérifier votre connexion ou réessayer."
  //       );
  //     }
  //   };

  //   const handleDelete = async (rowIndex) => {
  //     const rowData = rows[rowIndex];
  //     console.log("Données de la ligne avant suppression :", rowData);

  //     // Vérifiez les données avant la suppression
  //     if (!rowData || !rowData.id || !rowData.source) {
  //       // Utilisez 'id' au lieu de '_id'
  //       alert("Données invalides pour la suppression.");
  //       console.error(
  //         "Erreur: Données invalides pour la suppression. rowData:",
  //         rowData
  //       );
  //       return;
  //     }

  //     if (window.confirm("Voulez-vous vraiment supprimer cet élément ?")) {
  //       try {
  //         if (rowData.source === "source1") {
  //           // Suppression pour source1
  //           console.log(`Suppression de fourniture avec ID: ${rowData.id}`);
  //           const response = await axios.delete(
  //             `${apiUrl}/api/v1/fournitureRoutes/${rowData.id}` // Utilisez 'id' au lieu de '_id'
  //           );
  //           console.log("Réponse après suppression de source1:", response);
  //           alert("Fourniture supprimée avec succès.");
  //         } else if (rowData.source === "source2") {
  //           // Suppression pour source2
  //           const { parentId, id: subTicketId } = rowData; // Extraction des IDs nécessaires
  //           if (!parentId || !subTicketId) {
  //             alert("Parent ID ou Sub-ticket ID manquant.");
  //             console.error(
  //               "Erreur: Parent ID ou Sub-ticket ID manquant. rowData:",
  //               rowData
  //             );
  //             return;
  //           }

  //           console.log(
  //             `Suppression du sous-ticket avec Parent ID: ${parentId} et Sub-ticket ID: ${subTicketId}`
  //           );
  //           const response = await axios.delete(
  //             `${apiUrl}/api/v1/ticketMaintenance/tickets/${parentId}/subTickets/${subTicketId}`
  //           );
  //           console.log("Réponse après suppression de source2:", response);
  //           alert("Sous-ticket supprimé avec succès.");
  //         }

  //         // Mise à jour de l'état local après suppression
  //         setRows((prevRows) =>
  //           prevRows.filter((_, index) => index !== rowIndex)
  //         );
  //       } catch (error) {
  //         console.error("Erreur lors de la suppression de l'élément :", error);
  //         alert(
  //           "Erreur lors de la suppression de l'élément. Veuillez réessayer."
  //         );
  //       }
  //     }
  //   };

  //   const styles = {
  //     largeIcon: {
  //       width: 60,
  //       height: 60,
  //     },
  //   };

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
      name: "prix",
      label: "Prix",
      options: {
        filter: true,
        sort: false,
        filterType: "dropdown",
        customBodyRender: (value) => {
          return value !== undefined ? `${value} MAD` : "-";
        },
      },
    },
    {
      name: "tarifLivraison",
      label: "Tarif Livraison",
      options: {
        filter: true,
        sort: false,
        filterType: "dropdown",
        customBodyRender: (value) => {
          return value !== undefined ? `${value} MAD` : "-";
        },
      },
    },
    {
      name: "fournisseur",
      label: "Fournisseur",
      options: {
        filter: true,
        sort: false,
        filterType: "dropdown",
        customBodyRender: (value) => {
          return value !== undefined ? `${value}` : "-";
        },
      },
    },
    {
      name: "dateLivraisonEstimee",
      label: "Date Livraison Estimée",
      options: {
        filter: true,
        sort: false,
        filterType: "dropdown",
        customBodyRender: (value) => {
          if (value) {
            const date = new Date(value); // Convertit la valeur en objet Date
            const formattedDate = date.toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            });
            return formattedDate; // Retourne la date formatée
          }
          return "-"; // Valeur par défaut si aucune date n'est fournie
        },
      },
    },
    {
      name: "commentaire",
      label: "Commentaire technicien",
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
          const rowIndex = tableMeta.rowIndex; // Obtient l'index de la ligne
          return (
            <div style={{ display: "flex", gap: "1px" }}>
              {/* <IconButton onClick={() => handleView(rowIndex)} color="primary">
                <Eye style={{ width: "18px", height: "18px" }} />
              </IconButton> */}
              <IconButton onClick={() => handleEdit(rowIndex)} color="primary">
                <Edit style={{ width: "18px", height: "18px" }} />
              </IconButton>
              {/* <IconButton
                onClick={() => handleDelete(rowIndex)}
                color="secondary"
              >
                <Delete style={{ width: "18px", height: "18px" }} />
              </IconButton> */}
              {/* <IconButton
                onClick={async () => await handleClose(rowIndex)} // Wrap handleClose with async/await
                color="success"
              >
                <CheckCircle style={{ width: "18px", height: "18px" }} />
              </IconButton> */}
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

    rowsPerPage: 100,
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
            title={"Gestion des achats"}
            data={rows}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Modifier la fourniture</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {/* Ligne 1 : Nom et Catégorie */}
              <Grid item xs={6}>
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
              </Grid>
              <Grid item xs={6}>
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
              </Grid>

              {/* Ligne 2 : Besoin et Quantité */}
              <Grid item xs={6}>
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
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  label="Quantité"
                  type="number"
                  fullWidth
                  variant="standard"
                  value={updatedQuantite}
                  onChange={(e) => setUpdatedQuantite(e.target.value)}
                />
              </Grid>

              {/* Ligne 3 : Commentaire responsable et Date de création */}
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  label="Commentaire responsable"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={updatedCommentaire}
                  onChange={(e) => setUpdatedCommentaire(e.target.value)}
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  label="Date de création"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={
                    selectedFourniture
                      ? new Date(
                          selectedFourniture.dateCreation
                        ).toLocaleString("fr-FR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                      : ""
                  }
                  disabled
                />
              </Grid>

              {/* Ligne 4 : Commentaire responsable et Date de création */}
              <Grid item xs={4}>
                <TextField
                  margin="dense"
                  label="Prix"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={updatedPrix}
                  onChange={(e) =>
                    setUpdatedPrix(parseFloat(e.target.value) || 0)
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  margin="dense"
                  label="Date Livraison Estimée"
                  type="date" // Remplacez "text" par "date"
                  fullWidth
                  variant="standard"
                  value={updateDateLivraisonEstimee}
                  onChange={
                    (e) => setUpdateDateLivraisonEstimee(e.target.value) // Directement utiliser e.target.value (format ISO)
                  }
                  InputLabelProps={{
                    shrink: true, // Assurez-vous que le label reste au-dessus
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  margin="dense"
                  label="tarif livraison"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={updatedTarifLivraison}
                  onChange={(e) =>
                    setUpdatedTarifLivraison(parseFloat(e.target.value))
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  margin="dense"
                  label="fournisseur"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={updatedFournisseur}
                  onChange={(e) => setUpdatedFournisseur(e.target.value)}
                />
              </Grid>

              {/* Ligne 4 : Status */}
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={updatedStatus}
                    onChange={handleChangeStatus}
                    label="Status"
                    name="status"
                  >
                    {[
                      "reçue par le service des achats",
                      "en cours traitement",
                      "lancé au finance",
                      "en stock",
                    ].map((status, index) => (
                      <MenuItem key={index} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
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

export default ModuleAchat;
