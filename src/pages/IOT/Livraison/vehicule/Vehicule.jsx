import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MUIDataTable from "mui-datatables";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { rows } from "./Data.js";
import * as XLSX from "xlsx";

const Vehicule = () => {
  const [enlargedImage, setEnlargedImage] = useState(null); // État pour gérer l'image agrandie
  const [modalopen, setModalOpen] = useState(false); // État pour gérer l'ouverture du modal
  const [isEditing, setIsEditing] = useState(false); // État pour savoir si on est en mode édition
  const [formData, setFormData] = useState({
    imie: "",
    immatriculation: "",
    marque: "",
    modele: "",
    annee: "",
    statut: "",
    localisation: "",
    conducteur: "",
    image: "",
  });

  const handleModalOpen = () => {
    setIsEditing(false); // Indique qu'on ajoute un nouveau véhicule
    setFormData({
      imie: "",
      immatriculation: "",
      marque: "",
      modele: "",
      annee: "",
      statut: "",
      localisation: "",
      conducteur: "",
      image: "",
    });
    setModalOpen(true); // Ouvrir le modal pour ajouter
  };

  const handleModalClose = () => {
    setModalOpen(false); // Fermer le modal
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (isEditing) {
      console.log("Données modifiées : ", formData);
    } else {
      console.log("Données soumises : ", formData);
    }
    setModalOpen(false); // Fermer le modal après soumission
  };

  const handleEdit = (rowData) => {
    setIsEditing(true); // Mode édition
    setFormData({
      imie: rowData[0], // Remplir avec les données sélectionnées
      immatriculation: rowData[1],
      marque: rowData[2],
      modele: rowData[3],
      annee: rowData[4],
      statut: rowData[5],
      localisation: rowData[6],
      conducteur: rowData[7],
      image: rowData[8],
    });
    setModalOpen(true); // Ouvrir le modal pour éditer
  };

  const handleImageClick = (image) => {
    setEnlargedImage(image); // Met à jour l'état pour l'image agrandie
  };

  const handleClose = () => {
    setEnlargedImage(null); // Réinitialise l'état pour fermer l'image agrandie
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Collaborateurs");
    XLSX.writeFile(workbook, "Liste des vehicules.xlsx");
  };

  const options = {
    filterType: "",
    selectableRows: false,
    rowsPerPage: 10,
    rowsPerPageOptions: [30, 50, 70, 100],
    search: true,
    download: true,
    downloadOptions: {
      filename: "Liste des unités mobiles de santé",
      separator: ",",
      responsive: "true",
    },
  };

  const getMuiTheme = () =>
    createTheme({
      typography: {
        fontFamily: "sans-serif",
      },
      palette: {
        background: {
          paper: "#1e293b",
          default: "#0f172a",
        },
        mode: "dark",
      },
      components: {
        MuiTableCell: {
          styleOverrides: {
            head: {
              padding: "10px 4px",
            },
            body: {
              padding: "7px 15px",
              color: "#e2e8f0",
            },
          },
        },
      },
    });

  const columns = [
    {
      name: "imie",
      label: "IMIE",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "immatriculation",
      label: "Immatriculation",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "marque",
      label: "Marque",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "modele",
      label: "Modèle",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "annee",
      label: "Année",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "statut",
      label: "Statut",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "localisation",
      label: "Localisation",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "conducteur",
      label: "Conducteur",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "image",
      label: "Image",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => {
          return (
            <img
              src={value}
              alt="Véhicule"
              style={{ width: 50, height: 50, cursor: "pointer" }}
              onClick={() => handleImageClick(value)} // Gérer le clic pour agrandir
            />
          );
        },
      },
    },
    {
      name: "action",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          return (
            <button
              className="hover:bg-orange-300 hover:text-black hover:p-2 hover:rounded-lg"
              onClick={() => handleEdit(tableMeta.rowData)}
            >
              Modifier
            </button>
          );
        },
      },
    },
  ];

  return (
    <div>
      <Box>
        <div className="flex justify-end gap-4">
          <Button variant="outlined" onClick={handleDownloadExcel}>
            Télécharger Excel
          </Button>
          <Button variant="outlined" onClick={handleModalOpen}>
            Ajouter
          </Button>
        </div>
      </Box>
      <div className="w-[100%] py-3">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Liste des véhicules"}
            data={rows}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      </div>

      {/* Afficher l'image agrandie */}
      {enlargedImage && (
        <div
          onClick={handleClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={enlargedImage}
            alt="Véhicule Agrandi"
            style={{ maxWidth: "90%", maxHeight: "90%" }}
          />
        </div>
      )}

      {/* Modal pour ajouter ou modifier un véhicule */}
      <Dialog open={modalopen} onClose={handleModalClose}>
        <DialogTitle>
          {isEditing ? "Modifier le véhicule" : "Ajouter un nouveau véhicule"}
        </DialogTitle>
        <DialogContent className="felx flex-row">
          <TextField
            autoFocus
            margin="dense"
            label="IMIE"
            name="imie"
            type="text"
            fullWidth
            value={formData.imie}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Immatriculation"
            name="immatriculation"
            type="text"
            fullWidth
            value={formData.immatriculation}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Marque"
            name="marque"
            type="text"
            fullWidth
            value={formData.marque}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Modèle"
            name="modele"
            type="text"
            fullWidth
            value={formData.modele}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Année"
            name="annee"
            type="number"
            fullWidth
            value={formData.annee}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="statut-label">Statut</InputLabel>
            <Select
              labelId="statut-label"
              id="statut"
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="actif">Actif</MenuItem>
              <MenuItem value="inactif">Inactif</MenuItem>
              <MenuItem value="livraison">Livraison</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Localisation"
            name="localisation"
            type="text"
            fullWidth
            value={formData.localisation}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Conducteur"
            name="conducteur"
            type="text"
            fullWidth
            value={formData.conducteur}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Image URL"
            name="image"
            type="text"
            fullWidth
            value={formData.image}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Annuler</Button>
          <Button onClick={handleSubmit}>
            {isEditing ? "Enregistrer les modifications" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Vehicule;
