import React, { useEffect, useState } from "react";
import { createTheme, IconButton, Modal, Box } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import UpdateStock from "./updateStock"; // Assure-toi que ce composant existe et fonctionne correctement.

const getMuiTheme = () =>
  createTheme({
    typography: {
      fontFamily: "sans-serif",
    },
    palette: {
      background: {
        paper: "#1E1E1E",
        default: "#0f172a",
      },
      mode: "dark",
    },
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            padding: "10px 4px",
            whiteSpace: "wrap",
          },
          body: {
            padding: "7px 15px",
            color: "#e2e8f0",
            whiteSpace: "wrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        },
      },
    },
  });

const options = {
  filterType: "dropdown",
  selectableRows: "single",
  rowsPerPage: 30,
  rowsPerPageOptions: [30, 50, 70, 100],
  search: true,
  download: true,
  downloadOptions: {
    filename: "stocks.csv",
    separator: ",",
    responsive: "true",
  },
};

const ItemTable = () => {
  const [rows, setRows] = useState([]); // Données du tableau
  const [selectedRow, setSelectedRow] = useState(null); // Ligne sélectionnée pour le modal
  const [openUpdateModal, setOpenUpdateModal] = useState(false); // État du modal
  const [error, setError] = useState(null); // Gestion des erreurs

  // Récupération des données depuis l'API
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/stocks");
        if (Array.isArray(response.data.data.stocks)) {
          console.log("Données reçues de l'API :", response.data.data.stocks);
          setRows(response.data.data.stocks);
        } else {
          setError("La réponse de l'API n'est pas un tableau.");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données :", err);
        setError("Erreur lors de la récupération des données.");
      }
    };

    fetchStocks();
  }, []);

  // Gestion de l'ouverture/fermeture du modal
  const handleOpenUpdateModal = (rowData) => {
    setSelectedRow(rowData);
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    setSelectedRow(null);
  };

  const columns = [
    { name: "name", label: "Nom de la Pièce" },
    { name: "categorie", label: "Catégorie" },
    { name: "quantity", label: "Quantité" },
    { name: "date_entre", label: "Date d'Entrée" },
    { name: "emplacement", label: "Emplacement" },
    { name: "etat", label: "État de la Pièce" },
    { name: "referance", label: "Référence" },
    { name: "responsable", label: "Responsable" },
    { name: "compatibility", label: "Compatibilité" },
    { name: "observations", label: "Observations" },
    {
      name: "ACTION",
      label: "ACTION",
      options: {
        customBodyRender: (_, tableMeta) => (
          <IconButton
            onClick={() => handleOpenUpdateModal(rows[tableMeta.rowIndex])}
            aria-label="update"
          >
            <AddIcon />
          </IconButton>
        ),
      },
    },
  ];

  return (
    <div className="w-[100%] py-3">
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title={"Stocks"}
          data={rows}
          columns={columns}
          options={options}
        />
      </ThemeProvider>

      {/* Modal pour mettre à jour une ligne */}
      <Modal
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        className="inset-0 fixed flex justify-center items-center z-50"
      >
        <Box className="bg-white p-4 rounded shadow-lg">
          {selectedRow && (
            <UpdateStock
              rowData={selectedRow}
              setOpenUpdateModal={setOpenUpdateModal}
              onClose={handleCloseUpdateModal}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ItemTable;
