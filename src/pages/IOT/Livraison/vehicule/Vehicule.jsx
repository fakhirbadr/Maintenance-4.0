import React, { useState } from "react"; // Ajoutez useState
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MUIDataTable from "mui-datatables";
import { Box, Button } from "@mui/material";
import { rows } from "./Data.js";
import * as XLSX from "xlsx"; // Importation de la bibliothèque xlsx
const Vehicule = () => {
  const [enlargedImage, setEnlargedImage] = useState(null); // État pour gérer l'image agrandie

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
            <button onClick={() => handleEdit(tableMeta.rowData[0])}>
              Modifier
            </button>
          );
        },
      },
    },
  ];

  const handleEdit = (imie) => {
    console.log("Modifier le véhicule avec IMIE :", imie);
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

  return (
    <div>
      <Box>
        <div className="flex justify-end gap-4">
          <Button variant="outlined" onClick={handleDownloadExcel}>
            Télécharger Excel
          </Button>
          <Button variant="outlined" onClick={() => true}>
            Ajouter
          </Button>
        </div>
      </Box>
      <div className="w-[100%] py-3">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Liste des vehicules"}
            data={rows}
            columns={columns}
            // @ts-ignore
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
    </div>
  );
};

export default Vehicule;
