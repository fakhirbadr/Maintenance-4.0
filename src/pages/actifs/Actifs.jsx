import Location from "../../components/Location";
import Model from "./Modal";

import { Box, Button, colors, IconButton } from "@mui/material";

import { rows } from "./Data";

import MUIDataTable from "mui-datatables";
import MapModal from "./MapModal";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import * as XLSX from "xlsx"; // Importation de la bibliothèque xlsx
import MapIcon from "@mui/icons-material/Map";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateModal from "./UpdateModal";

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

const Actifs = () => {
  const [modelIsOpen, setModelIsOpen] = useState(false);
  const [mapModalIsOpen, setMapModalIsOpen] = useState(false);
  const [UpdateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const columns = [
    {
      name: "id",
      label: "id",
    },
    {
      name: "Etat",
      label: "Etat",
      options: {
        customBodyRender: (value, tableMeta) => {
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: value === "actif" ? "green" : "red",
                  marginRight: "8px",
                }}
              ></span>
              {value}
            </div>
          );
        },
      },
    },

    {
      name: "Nom",
      label: "Nom",
    },
    {
      name: "Région",
      label: "Région",
    },
    {
      name: "Province",
      label: "Province",
    },
    {
      name: "Coordinateur",
      label: "Coordinateur",
    },
    {
      name: "Chargé_de_suivie",
      label: "Chargé de suivie",
    },
    {
      name: "Technicien",
      label: "Technicien",
    },
    {
      name: "Docteur",
      label: "Docteur",
    },
    {
      name: "Mail",
      label: "Mail",
    },
    {
      name: "Num",
      label: "Num",
    },
    {
      name: "Position",
      label: "Position",
      options: {
        customBodyRender: (value, tableMeta) => (
          <IconButton
            onClick={() => {
              setSelectedPosition(value);
              setMapModalIsOpen(true);
            }}
            aria-label="x"
          >
            <MapIcon />
          </IconButton>
        ),
      },
    },
    {
      name: "ACTION",
      label: "ACTION",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const rowData = rows[tableMeta.rowIndex];
          return (
            <div>
              {/* Bouton Modifier */}
              <IconButton
                onClick={() => {
                  setUpdateModalIsOpen(true);
                  setSelectedRowData(rowData);
                }}
                color="primary"
                aria-label="edit"
              >
                <EditIcon />
              </IconButton>
              {/* Bouton Supprimer */}
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

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Collaborateurs");
    XLSX.writeFile(workbook, "Liste_des_unites_mobiles.xlsx");
  };

  return (
    <>
      <div>
        <Location />
      </div>
      <Box>
        <div className="flex justify-end gap-4">
          <Button variant="outlined" onClick={handleDownloadExcel}>
            Télécharger Excel
          </Button>
          <Button variant="outlined" onClick={() => setModelIsOpen(true)}>
            Ajouter
          </Button>
        </div>
      </Box>
      {modelIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-blue-500 p-4 rounded-md shadow-lg">
            <Model setModelIsOpen={setModelIsOpen} isOpen={modelIsOpen} />
          </div>
        </div>
      )}

      {mapModalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <MapModal
            position={selectedPosition}
            setMapModalIsOpen={setMapModalIsOpen}
          />
        </div>
      )}

      {UpdateModalIsOpen && selectedRowData && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-blue-500 p-4 rounded-md shadow-lg">
            <UpdateModal
              setUpdateModalIsOpen={setUpdateModalIsOpen}
              isOpen={UpdateModalIsOpen}
              rowData={selectedRowData} // Passer les données à la modale
            />
          </div>
        </div>
      )}

      <div className="w-[100%] py-3">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Liste des unites mobiles de santé"}
            data={rows}
            columns={columns}
            // @ts-ignore
            options={options}
          />
        </ThemeProvider>
      </div>
    </>
  );
};

export default Actifs;
