import React, { useState, useEffect } from "react";
import {
  IconButton,
  ThemeProvider,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Alert,
} from "@mui/material";
import MUIDataTable from "mui-datatables";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Eye as EyeIcon,
  CheckCircle as CheckCircleIcon,
} from "lucide-react";
import axios from "axios";
import moment from "moment";
import DataDetails from "./dataDetails";
import UpdateModel from "./updateModel";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import * as XLSX from "xlsx"; // Import XLSX to handle the Excel export
import SubTickets from "./SubTickets";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const TicketMaintenance = () => {
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Collaborateurs");
    XLSX.writeFile(workbook, "Ticket_Maintenance.xlsx");
  };
  const [rows, setRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openSubTicket, setOpenSubTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updatedTicket, setUpdatedTicket] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [name, setName] = useState("");
  const [alertMessage, setAlertMessage] = useState(null); // État pour afficher l'alerte

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo); // Parse the stored JSON object

      if (userInfo.nomComplet) {
        setName(userInfo.nomComplet); // Mise à jour du technicien
      }
    }
  }, []);

  // Récupérer les données des tickets
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/ticketMaintenance?isClosed=false&currentMonth=true&isDeleted=true&isVisible=true`
        );
        setRows(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    fetchData();
  }, []);
  // Ouvrir le dialog
  const handleOpen = (rowData) => {
    setSelectedRow(rowData);
    setOpen(true);
  };

  // Fermer le dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
    setIsDeleting(false); // Réinitialiser l'état de suppression
  };
  // Fonction pour visualiser un ticket
  const handleView = (rowData) => {
    setSelectedTicket(rowData);
    setOpenModal(true);
  };

  // Fonction pour ouvrir le modal de mise à jour
  const handleUpdate = (rowData) => {
    setSelectedTicket(rowData);
    setUpdatedTicket({ ...rowData });
    setOpenUpdateModal(true);
  };

  const hundleSubTicket = (rowData) => {
    setSelectedTicket(rowData);
    setUpdatedTicket({ ...rowData });
    setOpenSubTicket(true);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    setUpdatedTicket({});
  };

  const handleFieldChange = (field, value) => {
    setUpdatedTicket((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitUpdate = async () => {
    try {
      const response = await axios.patch(
        `${apiUrl}/api/v1/ticketMaintenance/${updatedTicket._id}`,
        updatedTicket
      );
      if (response.status === 200) {
        setRows((prevRows) =>
          prevRows.map((row) =>
            row._id === updatedTicket._id ? { ...updatedTicket } : row
          )
        );
        handleCloseUpdateModal();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du ticket :", error.message);
    }
  };

  const handleCloseTicket = async (rowData) => {
    try {
      const currentDate = new Date(); // Get the current time
      currentDate.setHours(currentDate.getHours()); // Adjust for the time zone if necessary

      // Close the ticket first
      const response = await axios.patch(
        `${apiUrl}/api/v1/ticketMaintenance/${rowData._id}`,
        {
          isClosed: true,
          dateCloture: currentDate.toISOString(),
          cloturerPar: name,
        } // Update the ticket with the closure date
      );

      if (response.status === 200) {
        // Update the ticket state
        setRows((prevRows) =>
          prevRows.map((row) =>
            row._id === rowData._id
              ? {
                  ...row,
                  isClosed: true,
                  dateCloture: currentDate.toISOString(), // Update the closure date in the state
                  cloturerPar: name,
                }
              : row
          )
        );

        // Log the URL and the request body for the PUT request
        const url = `${apiUrl}/api/actifs/${rowData.selectedActifId}/categories/${rowData.selectedCategoryId}/equipments/${rowData.selectedEquipmentId}`;
        const body = {
          isFunctionel: true, // Example of status update
        };

        console.log("Sending PUT request to:", url);
        console.log("Request body:", JSON.stringify(body, null, 2));

        // Perform the PUT request to update the equipment details
        const equipmentResponse = await axios.put(url, body, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (equipmentResponse.status === 200) {
          console.log("Equipment updated successfully");
        } else {
          console.error("Failed to update the equipment");
        }
      }
    } catch (error) {
      console.error("Error when closing the ticket:", error.message);
    }
  };

  const handleDelete = async (rowData) => {
    setIsDeleting(true); // Activer l'état de suppression

    try {
      const url = `${apiUrl}/api/actifs/${rowData.selectedActifId}/categories/${rowData.selectedCategoryId}/equipments/${rowData.selectedEquipmentId}`;
      const body = {
        isFunctionel: true,
      };

      console.log("Sending PUT request to:", url);
      console.log("Request body:", JSON.stringify(body, null, 2));

      const equipmentResponse = await axios.put(url, body, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (equipmentResponse.status === 200) {
        console.log("Equipment updated successfully");

        // Get the name of the person who deleted from localStorage
        const deletedBy = name; // Using state variable `name`

        // Proceed with PATCH to mark ticket as deleted
        const response = await axios.patch(
          `${apiUrl}/api/v1/ticketMaintenance/${rowData._id}`,
          {
            isDeleted: true,
            deletedBy: deletedBy,
            isClosed: true,
          }
        );

        console.log("PATCH response:", response); // Check response
        if (response.status === 200) {
          setRows((prevRows) =>
            prevRows.map((row) =>
              row._id === rowData._id ? { ...row, isDeleted: true } : row
            )
          );

          // Show the alert for 1 second
          setAlertMessage(true);
          setTimeout(() => {
            setAlertMessage(false); // Hide the alert after 1 second
          }, 1000);
        } else {
          console.error("Failed to update the ticket");
        }
      }
    } catch (error) {
      console.error("Error during deletion:", error.response || error.message);
    } finally {
      setIsDeleting(false); // Disable deletion state after operation
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTicket(null);
  };

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

  const handleOpenDialog = (ticket) => {
    setSelectedTicket(ticket);
    setOpenSubTicket(true);
  };

  const handleCloseDialog = () => {
    setOpenSubTicket(false);
  };

  const handleSave = () => {
    console.log("Updated ticket:", selectedTicket);
    setOpenSubTicket(false);
  };

  const columns = [
    {
      name: "_id",
      options: {
        display: "excluded",
        filter: false, // No filter option for this column
        sort: false, // No sorting option for this column
      },
    },
    {
      name: "site",
      label: "Site",
      options: {
        filter: true,
        filterType: "dropdown",
      },
    },
    {
      name: "region",
      label: "Region",
      options: {
        filter: true,
        filterType: "dropdown",
      },
    },
    {
      name: "province",
      label: "Province",
      options: {
        filter: true,
        filterType: "dropdown",
      },
    },
    {
      name: "name",
      label: "Nom",
      options: {
        filter: true,
        filterType: "dropdown",
      },
    },
    {
      name: "technicien",
      label: "Créé par",
      options: {
        filter: true,
        filterType: "dropdown",
      },
    },
    {
      name: "categorie",
      label: "Catégorie",
      options: {
        filter: true,
        filterType: "dropdown",
      },
    },
    {
      name: "description",
      label: "Description",
      options: {
        filter: true,
        filterType: "dropdown",
      },
    },
    {
      name: "equipement_deficitaire",
      label: "Équipement défectueux",
      options: {
        filter: true,
        filterType: "dropdown",
      },
    },
    {
      name: "commentaire",
      label: "Commentaire responsable",
      options: {
        filter: true,
        filterType: "dropdown",
      },
    },
    {
      name: "urgence",
      label: "Urgence",
      options: {
        filter: true,
        filterType: "dropdown",
      },
    },
    {
      name: "createdAt",
      label: "Date de création",
      options: {
        customBodyRender: (value) =>
          value ? moment(value).format("DD/MM/YYYY HH:mm") : "",
        filter: true,
        filterType: "date",
      },
    },
    {
      name: "action",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const rowData = rows.find((row) => row._id === tableMeta.rowData[0]); // Recherche de la bonne ligne par ID
          return (
            <div style={{ display: "flex", gap: "8px" }}>
              <IconButton onClick={() => handleView(rowData)} color="primary">
                <EyeIcon style={{ width: "18px", height: "18px" }} />
              </IconButton>
              <IconButton onClick={() => handleUpdate(rowData)} color="default">
                <EditIcon style={{ width: "18px", height: "18px" }} />
              </IconButton>
              <IconButton
                onClick={() => {
                  console.log(rowData);
                  handleDelete(rowData);
                }}
                color="secondary"
              >
                <DeleteIcon style={{ width: "18px", height: "18px" }} />
              </IconButton>
              <IconButton
                onClick={() => {
                  console.log(rowData); // This will print rowData in the console
                  handleCloseTicket(rowData);
                }}
                color="success"
              >
                <CheckCircleIcon style={{ width: "18px", height: "18px" }} />
              </IconButton>
              <IconButton
                onClick={() => {
                  console.log(rowData);
                  hundleSubTicket(rowData); // This will print rowData in the console
                }}
                color="info"
              >
                <Inventory2OutlinedIcon
                  style={{ width: "18px", height: "18px" }}
                />
              </IconButton>
            </div>
          );
        },
      },
    },
  ];

  const options = {
    filterType: "checkbox",
    selectableRows: "none",
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 50, 70, 100],
    search: true,
    download: true,
    setRowProps: (_, dataIndex) => ({
      style: {
        backgroundColor: rows[dataIndex]?.isClosed ? "#4CAF50" : "inherit",
      },
    }),
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
            title={"Gestion de tickets"}
            data={rows}
            columns={columns}
            options={options}
          />
        </ThemeProvider>

        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Détails du Ticket</DialogTitle>
          <DialogContent>
            <DataDetails ticket={selectedTicket} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Fermer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Composant UpdateModel */}
        <UpdateModel
          open={openUpdateModal}
          onClose={handleCloseUpdateModal}
          ticket={updatedTicket}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmitUpdate}
        />
      </div>
      <div>
        {/* Custom Alert */}
        {alertMessage && (
          <Alert
            severity="warning" // Display a warning alert
            sx={{
              position: "fixed",
              top: "90%",
              left: "15%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
              width: "auto", // Adjust width
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            Le ticket a été marqué comme rejeté avec succès !
          </Alert>
        )}
        {/* Your existing code */}
        {/* Dialogue */}
      </div>

      {/* Utilisation du composant séparé */}
      <SubTickets
        open={openSubTicket}
        ticket={selectedTicket}
        onClose={handleCloseDialog}
        onSave={handleSave}
      />
    </>
  );
};

export default TicketMaintenance;
