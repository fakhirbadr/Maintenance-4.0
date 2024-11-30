import { useEffect, useState } from "react";
import Location from "../../components/Location";
import {
  Box,
  Button,
  createTheme,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import MUIDataTable from "mui-datatables";
import { rows } from "./Data";
import * as XLSX from "xlsx";
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import ModelUpdate from "./ModelUpdate";
import AddModal from "./AddModal";
import axios from "axios";
import AddModel from "./AddModel";

const Ticket = () => {
  const [addOpen, setAddOpen] = useState(false);
  const [closedRows, setClosedRows] = useState([]); // État pour stocker les lignes clôturées
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [modelAddIsOpen, setModelAddIsOpen] = useState(false);
  const [ModelUpdateOpen, setModelUpdateOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [rows, setRows] = useState([]); // Données du tableau

  const handleAddModelOpen = () => {
    setAddOpen(true);
  };

  const handleAddModelClose = () => {
    setAddOpen(false);
  };

  const handleAddModelSubmit = (data) => {
    console.log("Données soumises :", data);
    setAddOpen(false);
  };

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
              justifyItems: "center",
              padding: "10px 4px",
              whiteSpace: "wrap",
            },
            body: {
              justifyItems: "center",
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
  const priorityColors = {
    Critique: "black",
    élevée: "red", // High priority
    moyenne: "orange", // Medium priority
    Basse: "green", // Low priority
  };
  const handleCloturer = (dataIndex) => {
    console.log("Clôturer:", dataIndex);
    setClosedRows((prevClosedRows) => [...prevClosedRows, dataIndex]);
  };

  const options = {
    filterType: "checkbox",
    selectableRows: "none",
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 50, 70, 100],
    search: true,
    download: true,
    downloadOptions: {
      filename: "collaborateurs.csv",
      separator: ",",
      responsive: "true",
    },
    setRowProps: (row, dataIndex) => {
      // Applique la couleur verte aux lignes clôturées
      const isClosed = closedRows.includes(dataIndex);
      return {
        style: {
          backgroundColor: isClosed ? "green" : "inherit",
        },
      };
    },
  };
  const columns = [
    {
      name: "date",
      label: "Date",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "site",
      label: "Site",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "technicien",
      label: "Technicien",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "type_intervention",
      label: "Type d'Intervention",
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
      name: "province",
      label: "province",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "description",
      label: "Description",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "heure_debut",
      label: "Heure Début",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "heure_fin",
      label: "Heure Fin",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "priorité",
      label: "priorité",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => {
          const color = priorityColors[value] || "inherit"; // Default color if not found
          return (
            <div
              style={{
                backgroundColor: color,
                color: "white",
                padding: "5px",
                borderRadius: "4px",
              }}
            >
              {value}
            </div>
          );
        },
      },
    },
    {
      name: "Action",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const rowData = rows[tableMeta.rowIndex];
          const isClosed = closedRows.includes(tableMeta.rowIndex);

          return (
            <div className="flex items-center">
              <button
                onClick={() => {
                  setModelUpdateOpen(true);
                  setSelectedRowData(rowData);
                }}
                className={`flex items-center text-blue-500 hover:bg-blue-400 rounded-md ${
                  isClosed ? "pointer-events-none opacity-50" : ""
                }`}
              >
                <EditIcon style={{ marginRight: 4 }} />
              </button>
              <button
                onClick={() => handleCloturer(tableMeta.rowIndex)}
                className="flex items-center text-green-500 hover:bg-green-400 rounded-md mx-2"
                disabled={isClosed}
              >
                <CheckIcon style={{ marginRight: 4 }} />
              </button>
              <button
                onClick={() => handleDelete(rowData)}
                className="flex items-center text-red-500 hover:bg-red-400 rounded-md"
              >
                <DeleteIcon style={{ marginRight: 4 }} />
              </button>
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
    XLSX.writeFile(workbook, "Gestion de TICKETS.xlsx");
  };

  // chargement des donnees depuis L'API

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3009/api/v1/tickets"
        );
        if (Array.isArray(response.data.data.tickets)) {
          console.log("donnees recues de L'API:", response.data.data.tickets);
          setTickets(response.data.data.tickets);
          setRows(response.data.data.tickets); // ici c une mise a jour des ligne du tableau
        } else {
          setError("la réponse de l'API n'est pas un tableau");
        }
      } catch (err) {
        setError("Erreur lors de la récupération des donnees");
      }
    };
    fetchTickets();
  }, []);
  if (error) return <div>{error}</div>;

  const handleDelete = async (rowData) => {
    try {
      await axios.delete(`http://localhost:3009/api/v1/tickets/${rowData._id}`);
      setRows((prevRows) => prevRows.filter((row) => row._id !== rowData._id));
      alert("le ticket a été supprimée avec succés");
    } catch (error) {
      alert("une erreur est survenue lors de la suppression");
    }
  };

  return (
    <div>
      <div>
        <Location />
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outlined" onClick={handleDownloadExcel}>
          Télécharger Excel
        </Button>
        <Button variant="outlined" onClick={() => setModelAddIsOpen(true)}>
          Ajouter
        </Button>
        <Button variant="outlined" onClick={() => handleAddModelOpen()}>
          Add
        </Button>
      </div>
      {modelAddIsOpen && (
        <div className="fixed flex justify-center items-center inset-0 bg-black z-50 bg-opacity-75">
          <div className="bg-blue-500 p-4 rounded-md shadow-lg">
            <AddModal setModelAddIsOpen={setModelAddIsOpen} />
          </div>
        </div>
      )}
      <AddModel
        open={addOpen}
        onClose={handleAddModelClose}
        onSubmit={handleAddModelSubmit}
      />
      {ModelUpdateOpen && (
        <div className="fixed flex justify-center items-center inset-0 bg-black z-50 bg-opacity-75">
          <ModelUpdate
            setModelUpdateOpen={setModelUpdateOpen}
            rowData={selectedRowData}
          />
        </div>
      )}
      <Box display="flex" justifyContent="center" alignItems="center">
        <Paper
          elevation={3}
          sx={{
            px: 7,
            py: ["2px"],
            bgcolor: "#1E1E1E",
            borderRadius: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 5,
            gap: 6,
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body1" color="orange">
              En cours{" "}
              <Box
                component="span"
                sx={{
                  bgcolor: "white",
                  color: "blue",
                  fontWeight: "bold",
                  px: 1.5,
                  borderRadius: 1,
                }}
              >
                {rows.length}
              </Box>
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body1" color="green">
              Terminé{" "}
              <Box
                component="span"
                sx={{
                  bgcolor: "white",
                  color: "blue",
                  fontWeight: "bold",
                  px: 1.5,
                  borderRadius: 1,
                }}
              >
                22
              </Box>
            </Typography>
          </Box>
        </Paper>
      </Box>

      <div className="w-[100%] py-3">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Gestion de tickets"}
            data={rows}
            columns={columns}
            // @ts-ignore
            options={options}
          />
        </ThemeProvider>
      </div>
    </div>
  );
};

export default Ticket;
