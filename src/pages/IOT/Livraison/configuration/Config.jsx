import { useState } from "react"; // Ajoutez useState

import MUIDataTable from "mui-datatables";
import { rows } from "../vehicule/Data"; // Importing rows from Data file
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MenuItem, Select } from "@mui/material";
export const filteredRows = rows.filter((row) => row.statut === "livraison");

const Config = () => {
  // Filter rows to only include those with statut 'livraison'

  const options = {
    filterType: "",
    selectableRows: false,
    rowsPerPage: 10,
    rowsPerPageOptions: [30, 50, 70, 100],
    search: true,
    download: true, // Active le téléchargement CSV
    downloadOptions: {
      filename: "Liste des unites mobiles de santé", // Nom du fichier téléchargé
      separator: ",", // Séparateur utilisé dans le fichier CSV
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
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [status, setStatus] = useState({}); // State to hold status for each vehicle

  const handleImageClick = (image) => {
    setEnlargedImage(image);
  };

  const handleClose = () => {
    setEnlargedImage(null);
  };

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
            <div>
              <Select
                value={status[tableMeta.rowData[0]] || ""}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  setStatus((prev) => ({
                    ...prev,
                    [tableMeta.rowData[0]]: newStatus,
                  }));
                  console.log(
                    "Statut mis à jour pour IMIE :",
                    tableMeta.rowData[0],
                    "à",
                    newStatus
                  );
                }}
                displayEmpty
                style={{ marginLeft: "8px", width: "120px" }}
              >
                <MenuItem value="" disabled>
                  Choisir Statut
                </MenuItem>
                <MenuItem value="en cours">En Cours</MenuItem>
                <MenuItem value="livré">Livré</MenuItem>
                <MenuItem value="annuler">Annuler</MenuItem>
              </Select>
            </div>
          );
        },
      },
    },
  ];

  return (
    <div>
      <div className="w-[100%] py-3">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Liste des unites mobiles de santé"}
            data={filteredRows} // Use filtered rows
            columns={columns}
            // @ts-ignore
            options={options}
          />
        </ThemeProvider>
      </div>
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

export default Config;
