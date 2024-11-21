import React, { useState } from "react";
import { createTheme, IconButton, Modal, Box } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import { rows as initialRows } from "./Data";
import AddIcon from "@mui/icons-material/Add";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import Param from "./Param";

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
  filterType: "",
  selectableRows: false,
  rowsPerPage: 5,
  rowsPerPageOptions: [30, 50, 70, 100],
  search: true,
  download: true,
  downloadOptions: {
    filename: "collaborateurs.csv",
    separator: ",",
    responsive: "true",
  },
};

const ItemTable = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState(initialRows); // État pour les lignes du tableau

  const handleOpen = (rowData) => {
    setSelectedRow(rowData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleSave = (updatedRow) => {
    // Met à jour la ligne sélectionnée dans les données du tableau
    const updatedRows = rows.map((row) =>
      row.ID === updatedRow.ID ? updatedRow : row
    );
    setRows(updatedRows); // Met à jour l'état des lignes
    handleClose(); // Ferme le modal
  };

  const columns = [
    {
      name: "ID",
      label: "ID Pièce ",
    },
    {
      name: "Nom de la Pièce",
      label: "Nom de la Pièce",
    },
    {
      name: "Catégorie",
      label: "Catégorie",
    },
    {
      name: "Quantite",
      label: "Quantité ",
    },
    {
      name: "Date d'Entrée",
      label: "Date d'Entrée",
    },
    {
      name: "Emplacement",
      label: "Emplacement",
    },
    {
      name: "État de la Pièce",
      label: "État de la Pièce",
    },
    {
      name: "Reference",
      label: "Référence ",
    },
    {
      name: "Responsable",
      label: "Responsable",
    },
    {
      name: "Compatibilité",
      label: "Compatibilité ",
    },
    {
      name: "Observations",
      label: "Observations ",
    },
    {
      name: "ACTION",
      label: "ACTION ",
      options: {
        customBodyRender: (value, tableMeta) => (
          <IconButton
            onClick={() => handleOpen(rows[tableMeta.rowIndex])} // Ouvrir le modal avec les données de la ligne
            aria-label="x"
          >
            <AddIcon />
            <HorizontalRuleIcon />
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

      {/* Modal pour afficher les détails de la ligne sélectionnée */}
      <Modal
        open={open}
        onClose={handleClose}
        className="inset-0 fixed  flex justify-center items-center z-50"
      >
        <Box className="bg-white p-4">
          {selectedRow && <Param rowData={selectedRow} onSave={handleSave} />}
        </Box>
      </Modal>
    </div>
  );
};

export default ItemTable;
