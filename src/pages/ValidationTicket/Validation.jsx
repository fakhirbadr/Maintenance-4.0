// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import MUIDataTable from "mui-datatables";
// import UpdateDialog from "./updateBesoin"; // Import du composant UpdateDialog
// import moment from "moment";

// import { CheckCircle, Edit, Eye, Delete } from "lucide-react"; // Icônes Lucide React
// import {
//   IconButton,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   Button,
//   Typography,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import * as XLSX from "xlsx"; // Import XLSX to handle the Excel export

// const ListeBesoin = () => {
//   const handleDownloadExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(rows);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Collaborateurs");
//     XLSX.writeFile(workbook, "demande_fourniture.xlsx");
//   };
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [closedRows, setClosedRows] = useState(new Set()); // New state to track closed rows
//   const [openDialog, setOpenDialog] = useState(false); // Gestion de l'ouverture du dialogue
//   const [selectedFourniture, setSelectedFourniture] = useState(null); // Fourniture sélectionnée pour modification
//   const [updatedName, setUpdatedName] = useState(""); // Valeur modifiable du nom
//   const [updatedCategorie, setUpdatedCategorie] = useState(""); // Valeur modifiable de la catégorie
//   const [updatedBesoin, setUpdatedBesoin] = useState(""); // Valeur modifiable du besoin
//   const [updatedQuantite, setUpdatedQuantite] = useState(""); // Valeur modifiable de la quantité
//   const [updatedCommentaire, setUpdatedCommentaire] = useState(""); // Valeur modifiable de la commentaire

//   const [openViewDialog, setOpenViewDialog] = useState(false); // State to control View Dialog visibility
//   const [updatedStatus, setUpdatedStatus] = useState("");
//   const [timeElapsed, setTimeElapsed] = useState(""); // Timer state to show elapsed time

//   const fetchFournitures = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:3000/api/v1/fournitureRoutes?isClosed=false"
//       );
//       const reversedData = response.data.fournitures.reverse(); // Inverser l'ordre des données
//       setRows(reversedData); // Mettre à jour l'état avec les données inversées
//       setLoading(false);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des fournitures :", error);
//       setLoading(false);
//     }
//   };
//   // Handle view dialog opening and start timer
//   const handleView = (rowIndex) => {
//     const rowData = rows[rowIndex];
//     setSelectedFourniture(rowData); // Set selected row
//     setOpenViewDialog(true); // Open the View dialog
//     startTimer(rowData.dateCreation); // Start the countdown timer
//   };
//   // Start the timer to show elapsed time
//   const startTimer = (creationDate) => {
//     const interval = setInterval(() => {
//       const currentTime = new Date();
//       const timeDiff = currentTime - new Date(creationDate);
//       const hours = Math.floor(timeDiff / (1000 * 60 * 60));
//       const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

//       setTimeElapsed(`${hours}h ${minutes}m ${seconds}s`); // Update elapsed time

//       // Optionally stop the timer after a certain period
//     }, 1000);

//     return () => clearInterval(interval); // Cleanup timer on component unmount
//   };
//   const handleCloseViewDialog = () => {
//     setOpenViewDialog(false); // Close the View dialog
//   };

//   const handleEdit = (rowIndex) => {
//     const rowData = rows[rowIndex];
//     setSelectedFourniture(rowData); // Mettre à jour la ligne sélectionnée
//     setUpdatedName(rowData.name); // Mettre à jour le formulaire avec les données existantes
//     setUpdatedCategorie(rowData.categorie);
//     setUpdatedBesoin(rowData.besoin);
//     setUpdatedQuantite(rowData.quantite);
//     setUpdatedStatus(rowData.status);
//     setUpdatedCommentaire(rowData.commentaire);

//     setOpenDialog(true); // Ouvrir le dialogue pour modification
//   };
//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//   };
//   const handleChange = (event) => {
//     setUpdatedStatus(event.target.value);
//   };
//   const handleUpdateFourniture = async () => {
//     try {
//       await axios.patch(
//         `http://localhost:3000/api/v1/fournitureRoutes/${selectedFourniture._id}`,
//         {
//           name: updatedName,
//           categorie: updatedCategorie,
//           besoin: updatedBesoin,
//           quantite: updatedQuantite,
//           status: updatedStatus,
//           commentaire: updatedCommentaire,
//         }
//       );

//       // Mettre à jour la ligne localement dans l'état après la modification
//       setRows((prevRows) =>
//         prevRows.map((row) =>
//           row._id === selectedFourniture._id
//             ? {
//                 ...row,
//                 name: updatedName,
//                 categorie: updatedCategorie,
//                 besoin: updatedBesoin,
//                 quantite: updatedQuantite,
//                 status: updatedStatus,
//                 commentaire: updatedCommentaire,
//               }
//             : row
//         )
//       );

//       setOpenDialog(false); // Fermer le dialogue après la mise à jour
//       alert("Fourniture mise à jour avec succès");
//     } catch (error) {
//       console.error("Erreur lors de la mise à jour de la fourniture :", error);
//       alert("Erreur lors de la mise à jour de la fourniture");
//     }
//   };

//   const handleClose = async (rowIndex) => {
//     const rowData = rows[rowIndex]; // Get the selected row data
//     console.log("Clôturer :", rowData);

//     try {
//       const currentDate = new Date(); // Get the current date and time
//       currentDate.setHours(currentDate.getHours()); // Ajoute 1 heure si nécessaire (pour ajuster selon le fuseau horaire)

//       // Send a PATCH request to update `isClosed` and `dateCloture`
//       const response = await axios.patch(
//         `http://localhost:3000/api/v1/fournitureRoutes/${rowData._id}`,
//         {
//           isClosed: true,
//           dateCloture: currentDate.toISOString(), // Format ISO for the date
//         }
//       );

//       // Check if the request was successful
//       if (response.status === 200) {
//         // Update the state locally after successful request
//         setRows((prevRows) =>
//           prevRows.map((row) =>
//             row._id === rowData._id
//               ? {
//                   ...row,
//                   isClosed: true,
//                   dateCloture: currentDate.toISOString(),
//                 }
//               : row
//           )
//         );
//         alert("Fourniture clôturée avec succès");
//       } else {
//         console.error(
//           "Erreur lors de la mise à jour sur le serveur :",
//           response
//         );
//         alert("Impossible de clôturer la fourniture. Veuillez réessayer.");
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
//     console.log("Supprimer :", rowData);

//     if (window.confirm("Voulez-vous vraiment supprimer cet élément ?")) {
//       try {
//         // Send a DELETE request to the backend
//         await axios.delete(
//           `http://localhost:3000/api/v1/fournitureRoutes/${rowData._id}`
//         );

//         // Remove the item from the local state after successful deletion
//         setRows(rows.filter((_, index) => index !== rowIndex));
//         alert("Fourniture supprimée avec succès");
//       } catch (error) {
//         console.error("Erreur lors de la suppression de l'élément :", error);
//         alert("Erreur lors de la suppression de l'élément");
//       }
//     }
//   };
//   const styles = {
//     largeIcon: {
//       width: 60,
//       height: 60,
//     },
//   };

//   useEffect(() => {
//     fetchFournitures();
//   }, []);

//   const columns = [
//     {
//       name: "name",
//       label: "Nom",
//       options: { filter: true, sort: false, filterType: "dropdown" },
//     },
//     {
//       name: "region",
//       label: "Region",
//       options: { filter: true, sort: false, filterType: "checkbox" },
//     },
//     {
//       name: "province",
//       label: "Province",
//       options: { filter: true, sort: false, filterType: "dropdown" },
//     },
//     {
//       name: "categorie",
//       label: "Catégorie",
//       options: { filter: true, sort: false, filterType: "dropdown" },
//     },
//     {
//       name: "besoin",
//       label: "Besoin",
//       options: { filter: true, sort: false, filterType: "dropdown" },
//     },
//     {
//       name: "quantite",
//       label: "Quantité",
//       options: { filter: true, sort: false, filterType: "dropdown" },
//     },
//     {
//       name: "technicien",
//       label: "créé par",
//       options: { filter: true, sort: false, filterType: "dropdown" },
//     },
//     {
//       name: "status",
//       label: "Status",
//       options: { filter: true, sort: false, filterType: "dropdown" },
//     },
//     {
//       name: "commentaire",
//       label: "commentaire responsable",
//       options: { filter: true, sort: false, filterType: "dropdown" },
//     },
//     {
//       name: "dateCreation",
//       label: "Date de création",
//       options: {
//         filter: true,
//         sort: false,
//         customBodyRender: (value) => {
//           const date = new Date(value);
//           return date.toLocaleString("fr-FR", {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//             hour: "2-digit",
//             minute: "2-digit",
//           });
//         },
//         filterType: "dropdown",
//       },
//     },
//     {
//       name: "actions",
//       label: "Actions",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const rowIndex = tableMeta.rowIndex; // Obtient l'index de la ligne
//           return (
//             <div style={{ display: "flex", gap: "1px" }}>
//               <IconButton onClick={() => handleView(rowIndex)} color="primary">
//                 <Eye style={{ width: "18px", height: "18px" }} />
//               </IconButton>
//               <IconButton onClick={() => handleEdit(rowIndex)} color="default">
//                 <Edit style={{ width: "18px", height: "18px" }} />
//               </IconButton>
//               <IconButton
//                 onClick={() => handleDelete(rowIndex)}
//                 color="secondary"
//               >
//                 <Delete style={{ width: "18px", height: "18px" }} />
//               </IconButton>
//               <IconButton onClick={() => handleClose(rowIndex)} color="success">
//                 <CheckCircle style={{ width: "18px", height: "18px" }} />
//               </IconButton>
//             </div>
//           );
//         },
//       },
//     },
//   ];

//   const getMuiTheme = () =>
//     createTheme({
//       typography: { fontFamily: "sans-serif" },
//       palette: {
//         background: { paper: "#1E1E1E", default: "#0f172a" },
//         mode: "dark",
//       },
//       components: {
//         MuiTableCell: {
//           styleOverrides: {
//             head: { padding: "10px 4px" },
//             body: {
//               padding: "7px 15px",
//               color: "#e2e8f0",
//               textOverflow: "ellipsis",
//             },
//           },
//         },
//       },
//     });

//   const options = {
//     filterType: "checkbox",
//     selectableRows: "none",

//     rowsPerPage: 50,
//     rowsPerPageOptions: [10, 50, 70, 100],
//     search: true,
//     download: true,
//     setRowProps: (_, dataIndex) => {
//       // Check if the ticket is closed
//       const rowData = rows[dataIndex];
//       return {
//         style: {
//           backgroundColor: rowData.isClosed ? "#4CAF50" : "inherit", // Green if closed
//         },
//       };
//     },
//   };

//   return (
//     <>
//       <div className="flex justify-end gap-4">
//         <Button onClick={handleDownloadExcel} variant="outlined">
//           Télécharger Excel
//         </Button>
//       </div>
//       <div className="w-[100%] py-3">
//         <ThemeProvider theme={getMuiTheme()}>
//           <MUIDataTable
//             title={"Gestion des fournitures"}
//             data={rows}
//             columns={columns}
//             options={options}
//           />
//         </ThemeProvider>
//         <Dialog open={openDialog} onClose={handleCloseDialog}>
//           <DialogTitle>Modifier la fourniture</DialogTitle>
//           <DialogContent>
//             <TextField
//               autoFocus
//               margin="dense"
//               label="Nom"
//               type="text"
//               fullWidth
//               variant="standard"
//               value={updatedName}
//               onChange={(e) => setUpdatedName(e.target.value)}
//               disabled
//             />
//             <TextField
//               margin="dense"
//               label="Catégorie"
//               type="text"
//               fullWidth
//               variant="standard"
//               value={updatedCategorie}
//               onChange={(e) => setUpdatedCategorie(e.target.value)}
//               disabled
//             />
//             <TextField
//               margin="dense"
//               label="Besoin"
//               type="text"
//               fullWidth
//               variant="standard"
//               value={updatedBesoin}
//               onChange={(e) => setUpdatedBesoin(e.target.value)}
//               disabled
//             />
//             <TextField
//               margin="dense"
//               label="Quantité"
//               type="number"
//               fullWidth
//               variant="standard"
//               value={updatedQuantite}
//               onChange={(e) => setUpdatedQuantite(e.target.value)}
//             />
//             <TextField
//               margin="dense"
//               label="Commentaire responsable"
//               type="text"
//               fullWidth
//               variant="standard"
//               value={updatedCommentaire}
//               onChange={(e) => setUpdatedCommentaire(e.target.value)}
//               disabled
//             />

//             <TextField
//               margin="dense"
//               label="Date de création"
//               type="text"
//               fullWidth
//               variant="standard"
//               value={
//                 selectedFourniture
//                   ? new Date(selectedFourniture.dateCreation).toLocaleString(
//                       "fr-FR",
//                       {
//                         weekday: "long",
//                         year: "numeric",
//                         month: "long",
//                         day: "numeric",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         second: "2-digit",
//                       }
//                     )
//                   : ""
//               }
//               disabled
//             />
//             <FormControl fullWidth margin="normal">
//               <InputLabel>Status</InputLabel>
//               <Select
//                 value={updatedStatus}
//                 onChange={handleChange}
//                 label="Status"
//                 name="status"
//               >
//                 {[
//                   "Ouvert",
//                   "En cours",
//                   "Reçu par le support",
//                   "Expédié",
//                   "Demandé aux achats",
//                   "Demandé à Biopetra",
//                   "Demandé à la pharmacie",
//                   "En cours de livraison",
//                   "Livré",
//                 ].map((status, index) => (
//                   <MenuItem key={index} value={status}>
//                     {status.charAt(0).toUpperCase() + status.slice(1)}{" "}
//                     {/* Capitalize first letter */}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseDialog} color="primary">
//               Annuler
//             </Button>
//             <Button onClick={handleUpdateFourniture} color="primary">
//               Mettre à jour
//             </Button>
//           </DialogActions>
//         </Dialog>
//         {/* View Dialog */}
//         <Dialog open={openViewDialog} onClose={handleCloseViewDialog}>
//           <DialogTitle>Voir la fourniture</DialogTitle>
//           <DialogContent>
//             {selectedFourniture && (
//               <>
//                 <TextField
//                   margin="dense"
//                   label="Nom"
//                   type="text"
//                   fullWidth
//                   variant="standard"
//                   value={selectedFourniture.name}
//                   disabled
//                 />
//                 <TextField
//                   margin="dense"
//                   label="Besoin"
//                   type="text"
//                   fullWidth
//                   variant="standard"
//                   value={selectedFourniture.besoin}
//                   disabled
//                 />
//                 <TextField
//                   margin="dense"
//                   label="Quantité"
//                   type="number"
//                   fullWidth
//                   variant="standard"
//                   value={selectedFourniture?.quantite || ""}
//                   disabled
//                 />
//                 <TextField
//                   margin="dense"
//                   label="Technicien"
//                   type="text"
//                   fullWidth
//                   variant="standard"
//                   value={selectedFourniture?.technicien || ""}
//                   disabled
//                 />{" "}
//                 <TextField
//                   margin="dense"
//                   label="Status"
//                   type="text"
//                   fullWidth
//                   variant="standard"
//                   value={selectedFourniture?.status || ""}
//                   disabled
//                 />
//                 <TextField
//                   margin="dense"
//                   label="Commentaire responsable"
//                   type="text"
//                   fullWidth
//                   variant="standard"
//                   value={selectedFourniture?.commentaire || ""}
//                   disabled
//                 />
//                 <TextField
//                   margin="dense"
//                   label="Date de création"
//                   type="text"
//                   fullWidth
//                   variant="standard"
//                   value={new Date(
//                     selectedFourniture.dateCreation
//                   ).toLocaleString("fr-FR")}
//                   disabled
//                 />
//                 <Typography variant="h6" style={{ marginTop: "10px" }}>
//                   Temps écoulé : {timeElapsed}
//                 </Typography>
//               </>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseViewDialog} color="primary">
//               Fermer
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </div>
//     </>
//   );
// };

// export default ListeBesoin;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MUIDataTable from "mui-datatables";
import UpdateDialog from "../besoin/updateBesoin"; // Import du composant UpdateDialog
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
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const Validation = () => {
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

  const [openRejectDialog, setOpenRejectDialog] = useState(false); // État pour ouvrir/fermer le dialogue
  const [rejectReason, setRejectReason] = useState(""); // Raison de rejet
  const [selectedRowIndex, setSelectedRowIndex] = useState(null); // Index de la ligne sélectionnée
  const fetchFournitures = async () => {
    try {
      // Effectuer les deux requêtes en parallèle
      const [source1Response, source2Response] = await Promise.all([
        axios.get(
          `${apiUrl}/api/v1/fournitureRoutes?isClosed=false&status=créé&isDeleted=false`
        ),
        axios.get(`${apiUrl}/api/v1/subtickets?isClosed=false&status=créé`),
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
        dateCreation: new Date(item.dateCreation), // Convertir en objet Date pour le tri
        status: item.status,
        source: "source1", // Marqueur d'origine
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
        dateCreation: new Date(item.createdAt), // Convertir en objet Date pour le tri
        status: item.status,
        source: "source2", // Marqueur d'origine
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

  const handleClose = async (rowIndex) => {
    const rowData = rows[rowIndex]; // Récupérer les données de la ligne sélectionnée
    console.log("Clôturer :", rowData);

    try {
      const currentDate = new Date(); // Date et heure actuelles
      currentDate.setHours(currentDate.getHours()); // Ajustez si nécessaire

      // Vérifier l'origine de la donnée pour décider de l'API à appeler
      if (rowData.source === "source1") {
        // Clôturer le ticket parent pour "source1"
        const response = await axios.patch(
          `${apiUrl}/api/v1/fournitureRoutes/${rowData.id}`,
          {
            isClosed: true,
            dateCloture: currentDate.toISOString(),
          }
        );

        if (response.status === 200) {
          setRows((prevRows) =>
            prevRows.map((row) =>
              row.id === rowData.id
                ? {
                    ...row,
                    isClosed: true,
                    dateCloture: currentDate.toISOString(),
                  }
                : row
            )
          );
          alert("Fourniture clôturée avec succès");
        }
      } else if (rowData.source === "source2") {
        // Clôturer directement le ticket parent

        const firstPatchResponse = await axios.patch(
          `${apiUrl}/api/v1/ticketMaintenance/${rowData.parentId}`,
          {
            isClosed: true,
            dateCloture: currentDate.toISOString(),
            cloturerPar:
              JSON.parse(localStorage.getItem("userInfo"))?.nomComplet ||
              "Nom inconnu", // Récupère le nomComplet depuis localStorage, ou un nom par défaut
          }
        );

        if (firstPatchResponse.status === 200) {
          // Clôturer directement le sous-ticket sans vérifier
          const subTicketId = rowData.id; // Supposons que vous avez l'ID du sous-ticket directement dans rowData
          if (subTicketId) {
            try {
              const subTicketResponse = await axios.patch(
                `${apiUrl}/api/v1/sub-tickets/${subTicketId}`,
                {
                  isClosed: true,
                  dateCloture: currentDate.toISOString(),
                }
              );

              if (subTicketResponse.status === 200) {
                console.log(`Sous-ticket ${subTicketId} clôturé avec succès`);
              } else {
                console.error(
                  `Erreur lors de la mise à jour du sous-ticket ${subTicketId}`
                );
              }
            } catch (error) {
              console.error(
                `Erreur lors de la requête pour le sous-ticket ${subTicketId}: ${error.message}`
              );
            }
          }

          // Après avoir fermé le sous-ticket, mettre à jour le ticket parent
          setRows((prevRows) =>
            prevRows.map((row) =>
              row.id === rowData.id
                ? {
                    ...row,
                    isClosed: true,
                    dateCloture: currentDate.toISOString(),
                  }
                : row
            )
          );
          alert("Sous-ticket et ticket parent clôturés avec succès");
        } else {
          console.error("Erreur lors de la clôture du ticket parent");
          alert("Erreur lors de la clôture du ticket parent.");
        }
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
    console.log("Données de la ligne avant suppression :", rowData);

    // Vérifiez les données avant la suppression
    if (!rowData || !rowData.id || !rowData.source) {
      alert("Données invalides pour la suppression.");
      console.error(
        "Erreur: Données invalides pour la suppression. rowData:",
        rowData
      );
      return;
    }

    if (rowData.source === "source1") {
      // Ouvrir le dialogue pour la raison de rejet
      setSelectedRowIndex(rowIndex);
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

          console.log(
            `Suppression du sous-ticket avec Parent ID: ${parentId} et Sub-ticket ID: ${subTicketId}`
          );
          const response = await axios.delete(
            `${apiUrl}/api/v1/ticketMaintenance/tickets/${parentId}/subTickets/${subTicketId}`
          );
          console.log("Réponse après suppression de source2:", response);
          alert("Sous-ticket supprimé avec succès.");

          // Mise à jour de l'état local après suppression
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
      const deletedBy = JSON.parse(
        localStorage.getItem("userInfo")
      )?.nomComplet;
      if (!deletedBy) {
        alert("Erreur : utilisateur non identifié.");
        return;
      }

      console.log(
        `Suppression de fourniture avec ID: ${rowData.id} et Raison: ${rejectReason}`
      );
      const response = await axios.patch(
        `${apiUrl}/api/v1/fournitureRoutes/${rowData.id}`,
        {
          isDeleted: true,
          deletedBy: deletedBy,
          raisonRejet: rejectReason, // Inclure la raison de rejet
        }
      );

      console.log(
        "Réponse après suppression de source1 avec raison :",
        response
      );
      alert("Fourniture supprimée avec succès.");

      // Mise à jour de l'état local après suppression
      setRows((prevRows) =>
        prevRows.filter((_, index) => index !== selectedRowIndex)
      );

      // Réinitialiser et fermer le dialogue
      setRejectReason("");
      setOpenRejectDialog(false);
    } catch (error) {
      console.error("Erreur lors de la suppression avec raison :", error);
      alert("Erreur lors de la suppression. Veuillez réessayer.");
    }
  };

  const handleRejectCancel = () => {
    setRejectReason(""); // Réinitialiser la raison
    setOpenRejectDialog(false); // Fermer le dialogue
  };

  const styles = {
    largeIcon: {
      width: 60,
      height: 60,
    },
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
          const rowIndex = tableMeta.rowIndex; // Obtient l'index de la ligne
          return (
            <div style={{ display: "flex", gap: "1px" }}>
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
            title={"Validation des demandes"}
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
    </>
  );
};

export default Validation;
