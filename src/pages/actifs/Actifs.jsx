// Importation des composants et des bibliothèques nécessaires
import Location from "../../components/Location";
import Model from "./Modal";
import { Box, IconButton, useTheme } from "@mui/material"; // Importez useTheme
import { createTheme } from "@mui/material/styles"; // Pour personnaliser le thème MUI
import { useEffect, useState } from "react";
import MapIcon from "@mui/icons-material/Map"; // Icône pour afficher une carte
import EditIcon from "@mui/icons-material/Edit"; // Icône pour modifier une ligne
import DeleteIcon from "@mui/icons-material/Delete"; // Icône pour supprimer une ligne
import Ajout from "../../components/Ajout"; // Composant personnalisé pour les boutons
import ReusableTable from "../../components/Table"; // Table personnalisée
import ReusableDialog from "../../components/ReusableDialog"; // Boîte de dialogue réutilisable
import UpdateData from "./UpdateData"; // Composant pour mettre à jour les données
import ExcelExporter from "../../components/ExcelExporter";
import axios from "axios";
import MapModal from "./mapModal";

// Configuration des options du tableau (MUIDataTable)
const options = {
  filterType: "", // Pas de filtres supplémentaires
  selectableRows: false, // Désactiver la sélection des lignes
  rowsPerPage: 10, // Nombre de lignes par page
  rowsPerPageOptions: [30, 50, 70, 100], // Options de pagination
  search: true, // Activer la recherche
  download: true, // Activer le téléchargement CSV
  downloadOptions: {
    filename: "UMM & ULC", // Nom du fichier exporté
    separator: ",", // Séparateur CSV
    responsive: "true",
  },
};

// Fonction pour personnaliser le thème MUI
const getMuiTheme = (mode) => {
  return createTheme({
    typography: {
      fontFamily: "serif", // Police utilisée
    },
    palette: {
      background: {
        paper: mode === "dark" ? "#1e293b" : "#7cb7f2", // Couleur de fond pour les éléments
        default: mode === "dark" ? "#0f172a" : "#f0f0f0", // Couleur de fond globale
      },
      mode: mode, // Inclure le mode
      text: {
        primary: mode === "dark" ? "#ffffff" : "#000000", // Couleur du texte principale
        secondary: mode === "dark" ? "#e0e0e0" : "#333333", // Couleur du texte secondaire
      },
    },
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            padding: "10px 4px", // Marges pour les cellules d'en-tête
            color: mode === "dark" ? "#ffffff" : "#000000",
            background: mode === "light" ? "#66a7e8" : "", // Couleur du texte d'en-tête
          },
          body: {
            padding: "7px 15px", // Marges pour les cellules de contenu
            color: mode === "dark" ? "#e2e8f0" : "#000000", // Couleur du texte
          },
        },
      },
    },
  });
};

// Composant principal Actifs
const Actifs = () => {
  // Utilisation du thème
  const theme = useTheme();

  // État pour ouvrir et fermer les modales
  const [mapModalIsOpen, setMapModalIsOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null); // Position sélectionnée pour la carte
  const [selectedRowData, setSelectedRowData] = useState(null); // Données de la ligne sélectionnée
  const [rows, setRows] = useState([]);
  const [unites, setUnites] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnites = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/unite");
        if (Array.isArray(response.data.data.unites)) {
          setUnites(response.data.data.unites);
          setRows(response.data.data.unites); // Mettez à jour les rows ici
        } else {
          setError("La réponse de l'API n'est pas un tableau.");
        }
      } catch (err) {
        setError("Erreur lors de la récupération des données.");
      }
    };

    fetchUnites();
  }, []);
  if (error) {
    return <div>{error}</div>;
  }

  // Définition des colonnes pour le tableau
  const columns = [
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
                backgroundColor: value ? "green" : "red", // Utilisez la valeur booléenne directement
                marginRight: "8px",
              }}
            ></span>
            {value ? "actif" : "inactif"} {/* Affiche "actif" ou "inactif" */}
          </div>
        ),
      },
    },
    { name: "name", label: "Nom" },
    { name: "region", label: "Région" }, // Ensure this matches the data structure
    { name: "province", label: "Province" }, // Ensure this matches the data structure
    { name: "coordinateur", label: "Coordinateur" }, // Ensure this matches the data structure
    { name: "chargeSuivi", label: "Chargé de suivi" }, // Ensure this matches the data structure
    { name: "technicien", label: "Technicien" }, // Ensure this matches the data structure
    { name: "docteur", label: "Docteur" }, // Ensure this matches the data structure
    { name: "mail", label: "Email" }, // Use "Email" for clarity
    { name: "num", label: "Numéro" }, // Use "Numéro" for clarity
    {
      name: "position",
      label: "Position",
      options: {
        customBodyRender: (value) => (
          <IconButton
            onClick={() => {
              setSelectedPosition(value);
              setMapModalIsOpen(true);
            }}
            aria-label="map"
          >
            <MapIcon />
          </IconButton>
        ),
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
          function handleDelete(rowData) {
            throw new Error("Function not implemented.");
          }

          return (
            <div>
              <IconButton
                onClick={() => {
                  setOpenU(true);
                  setSelectedRowData(rowData);
                }}
                color="primary"
                aria-label="edit"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => handleDelete(rowData)}
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

  // États pour ouvrir et fermer les dialogues
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    // Logique de confirmation lors de l'ajout
    setOpen(false);
  };

  const [openU, setOpenU] = useState(false);
  const handleOpenU = () => setOpenU(true);
  const handleCloseU = () => setOpenU(false);
  const handleConfirmU = () => {
    // Logique de confirmation lors de la modification
    setOpenU(false);
  };

  // Retourne l'interface utilisateur du composant
  return (
    <>
      {/* Affichage de la localisation */}
      <div>
        <Location />
      </div>

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

      {/* Tableau affichant la liste des unités mobiles */}
      <div className="w-[100%] py-3">
        <ReusableTable
          title="Liste des unités mobiles & logistiques"
          data={rows}
          columns={columns}
          options={options}
          theme={getMuiTheme(theme.palette.mode)} // Passez le mode actuel du thème
        />
      </div>

      {/* Dialogue pour modifier une installation existante */}
      <ReusableDialog
        open={openU}
        onClose={handleCloseU}
        title="Modifier les informations"
        content={<UpdateData rowData={selectedRowData} />}
        onConfirm={handleConfirmU}
      />
    </>
  );
};

export default Actifs;
