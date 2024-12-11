// Importation des composants et des bibliothèques nécessaires
import Location from "../../components/Location";
import Model from "./Modal";
import { Box, IconButton, useTheme } from "@mui/material"; // Utilisation de useTheme pour le mode sombre
import { createTheme } from "@mui/material/styles"; // Personnalisation du thème MUI
import { useEffect, useState } from "react";
import MapIcon from "@mui/icons-material/Map"; // Icône de carte
import EditIcon from "@mui/icons-material/Edit"; // Icône d'édition
import DeleteIcon from "@mui/icons-material/Delete"; // Icône de suppression
import Ajout from "../../components/Ajout"; // Bouton d'ajout personnalisé
import ReusableTable from "../../components/Table"; // Table personnalisée
import ReusableDialog from "../../components/ReusableDialog"; // Boîte de dialogue réutilisable
import ExcelExporter from "../../components/ExcelExporter"; // Exportateur Excel
import axios from "axios";
import MapModal from "./mapModal"; // Modale pour la carte
import UpdateDataModal from "./UpdateDataModal";
import { MapPin } from "lucide-react";

// Fonction pour personnaliser le thème MUI en fonction du mode (clair ou sombre)
const getMuiTheme = (mode) => {
  return createTheme({
    typography: {
      fontFamily: "serif",
    },
    palette: {
      background: {
        paper: mode === "dark" ? "#1E1E1E" : "#7cb7f2",
        default: mode === "dark" ? "#0f172a" : "#f0f0f0",
      },
      mode: mode,
      text: {
        primary: mode === "dark" ? "#ffffff" : "#000000",
        secondary: mode === "dark" ? "#e0e0e0" : "#333333",
      },
    },
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            justifyItems: "center",
            padding: "10px 4px",
            color: mode === "dark" ? "#ffffff" : "#000000",
            background: mode === "light" ? "#66a7e8" : "",
          },
          body: {
            justifyItems: "center",
            padding: "7px 15px ",
            color: mode === "dark" ? "#e2e8f0" : "#000000",
          },
        },
      },
    },
  });
};

// Composant principal Actifs
const Actifs = () => {
  const theme = useTheme(); // Récupération du thème
  const [mapModalIsOpen, setMapModalIsOpen] = useState(false); // État pour la carte
  const [selectedPosition, setSelectedPosition] = useState(null); // Position sélectionnée
  const [rows, setRows] = useState([]); // Données du tableau
  const [unites, setUnites] = useState([]);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Image sélectionnée de la ligne du tableau
  const [imageModalOpen, setImageModalOpen] = useState(false); // Modale d'image ouverte uniquement lors du clic sur une ligne
  const [openUpdateDataModal, setOpenUpdateDataModal] = useState(false); // etat pour contorller l'ouverture du modal
  const [selectedRowData, setSelectedRowData] = useState(null); // Données de la ligne sélectionnée
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (rowData) => {
    try {
      // Make a delete request to the backend API
      await axios.delete(
        `https://maintenance-4-0-backend-9.onrender.com/api/v1/unite/${rowData._id}`
      );

      // After successful deletion, update the rows state to remove the deleted row
      setRows((prevRows) => prevRows.filter((row) => row._id !== rowData._id));

      // Optionally, show a success message (like a toast)
      alert("L'unité a été supprimée avec succès.");
    } catch (error) {
      // Handle error if the deletion fails
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

  const handleCloseUpdate = () => {
    setOpenUpdateDataModal(false); // ouvrire le modal
  };

  // Chargement des données depuis l'API
  useEffect(() => {
    const fetchUnites = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:3000/api/v1/unite");
        if (Array.isArray(response.data.data.unites)) {
          console.log("Données reçues de l'API:", response.data.data.unites); // Affiche les données dans la console
          setIsLoading(false);
          setUnites(response.data.data.unites);
          setRows(response.data.data.unites); // Mise à jour des lignes du tableau
        } else {
          setError("La réponse de l'API n'est pas un tableau.");
        }
      } catch (err) {
        setError("Erreur lors de la récupération des données.");
      }
    };

    fetchUnites();
  }, []);

  if (error) return <div>{error}</div>;

  // Gérer le clic sur une ligne du tableau
  const handleRowClick = (rowData) => {
    setSelectedRowData(rowData);
    setSelectedImage("https://via.placeholder.com/300"); // Remplacez par l'URL de l'image si disponible
    setImageModalOpen(true); // Ouvre la modale de l'image
  };

  // Soumission des données mises à jour
  const handleUpdate = (updatedData) => {
    // Ajoutez ici la logique pour envoyer les données mises à jour à l'API
    axios.patch(
      `http://localhost:3000/api/v1/unite/${updatedData._id}`,
      updatedData
    );
    // .then(response => { ... })

    // Met à jour les données dans le tableau après la mise à jour
    setRows((prevRows) =>
      prevRows.map((row) => (row._id === updatedData._id ? updatedData : row))
    );
  };

  // Options de configuration du tableau (MUIDataTable)
  const options = {
    filterType: "dropdown",
    selectableRows: "none",
    rowsPerPage: 30,
    rowsPerPageOptions: [30, 50, 70, 100],
    search: true,
    download: true,
    downloadOptions: {
      filename: "UMM & ULC",
      separator: ",",
      responsive: "true",
    },
    onRowClick: (rowData) => handleRowClick(rowData), // Définit la fonction de clic de ligne
  };
  const handleOpenUpdateModal = (rowData) => {
    setModelUpdateOpen(true);
    setSelectedRowData(rowData); // Définit les données de la ligne sélectionnée
  };

  // Définition des colonnes pour le tableau
  const columns = [
    {
      name: "_id", // L'ID restera dans les données mais ne sera pas affiché
      options: { display: "excluded" },
    },
    {
      name: "etat",
      label: "État",
      options: {
        customBodyRender: (value) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: value ? "green" : "red",
                marginRight: "8px",
              }}
            ></span>
            {value ? "Actif" : "Inactif"}
          </div>
        ),
      },
    },

    { name: "name", label: "Nom" },
    { name: "region", label: "Région" },
    { name: "province", label: "Province" },
    { name: "coordinateur", label: "Coordinateur" },
    { name: "chargeSuivi", label: "Chargé de suivi" },
    { name: "technicien", label: "Technicien" },
    { name: "docteur", label: "Docteur" },
    { name: "mail", label: "Email" },
    { name: "num", label: "Numéro" },
    {
      name: "position",
      label: "Position",
      options: {
        customBodyRender: (_, tableMeta) => {
          const rowData = rows[tableMeta.rowIndex];
          return (
            <IconButton
              onClick={() => {
                setSelectedPosition({ lat: rowData.lat, long: rowData.long });
                setMapModalIsOpen(true);
              }}
              aria-label="map"
            >
              <MapPin />
            </IconButton>
          );
        },
      },
    },

    {
      name: "action",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const rowData = rows[tableMeta.rowIndex];
          return (
            <div>
              <IconButton onClick={() => handleOpenUpdateModal(rowData)}>
                <EditIcon />
              </IconButton>

              <IconButton
                onClick={() => handleDelete(rowData)} // Pass rowData to the delete function
                color="secondary"
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </div>
          );
        },
      },
    },
  ];

  // États pour les boîtes de dialogue (ajout, édition)
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirm = () => setOpen(false); // Confirmation de l'ajout

  const [openU, setOpenU] = useState(false);
  const handleOpenU = () => setOpenU(true);
  const handleCloseU = () => setOpenU(false);
  const handleConfirmU = () => setOpenU(false); // Confirmation de la modification
  const [ModelUpdateOpen, setModelUpdateOpen] = useState(false);
  return (
    <>
      {/* Boutons pour ajouter ou télécharger */}
      <Box>
        <div className="flex justify-end gap-4">
          <ExcelExporter data={rows} filename="Liste_des_unites_mobiles" />
          <Ajout
            text="Ajouter"
            variant="outlined"
            onClick={() => setOpen(true)}
          />
        </div>
      </Box>
      {/* Modale pour afficher la carte */}
      {mapModalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <MapModal
            position={selectedPosition}
            setMapModalIsOpen={setMapModalIsOpen}
          />
        </div>
      )}
      {/* Dialogue pour ajouter une nouvelle installation */}
      <ReusableDialog
        open={open}
        onClose={handleClose}
        title="Ajouter une nouvelle installation"
        content={<Model />}
        onConfirm={handleConfirm}
      />
      {/* Tableau principal avec les données */}
      <div className="w-[100%] py-3">
        <ReusableTable
          title="Liste des unités mobiles & logistiques"
          data={rows}
          columns={columns}
          options={options}
          theme={getMuiTheme(theme.palette.mode)}
        />
      </div>
      {/* Dialogue de modification */}
      {ModelUpdateOpen && (
        <div className="fixed flex justify-center items-center inset-0 bg-black z-50 bg-opacity-75">
          <UpdateDataModal
            setModelUpdateOpen={setModelUpdateOpen}
            rowData={selectedRowData}
          />
        </div>
      )}

      {/* Modale pour afficher l'image si une ligne est cliquée
      {imageModalOpen && selectedImage && (
        <ImageModal
          open={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          image={selectedImage}
        />
      )} */}
    </>
  );
};

export default Actifs;
