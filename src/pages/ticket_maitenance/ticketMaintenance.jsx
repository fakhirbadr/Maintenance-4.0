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
import * as XLSX from "xlsx"; // Import XLSX to handle the Excel export

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
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updatedTicket, setUpdatedTicket] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [name, setName] = useState("");

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
          "https://backend-v1-e3bx.onrender.com/api/v1/ticketMaintenance?isClosed=false"
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
        `https://backend-v1-e3bx.onrender.com/api/v1/ticketMaintenance/${updatedTicket._id}`,
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
        `https://backend-v1-e3bx.onrender.com/api/v1/ticketMaintenance/${rowData._id}`,
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
        const url = `https://backend-v1-e3bx.onrender.com/api/actifs/${rowData.selectedActifId}/categories/${rowData.selectedCategoryId}/equipments/${rowData.selectedEquipmentId}`;
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
      // Update the equipment status to true (isFunctionel: true)
      const url = `https://backend-v1-e3bx.onrender.com/api/actifs/${rowData.selectedActifId}/categories/${rowData.selectedCategoryId}/equipments/${rowData.selectedEquipmentId}`;
      const body = {
        isFunctionel: true, // Update status
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

        // Proceed to delete the ticket if the equipment status update was successful
        await axios.delete(
          `https://backend-v1-e3bx.onrender.com/api/v1/ticketMaintenance/${rowData._id}`
        );
        setRows((prevRows) =>
          prevRows.filter((row) => row._id !== rowData._id)
        );
        alert("Le ticket a été supprimé avec succès !");
      } else {
        console.error("Failed to update the equipment");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du ticket :", error.message);
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

  const columns = [
    { name: "_id", options: { display: "excluded" } },
    { name: "site", label: "Site" },
    { name: "province", label: "Province" },
    { name: "name", label: "Nom" },
    { name: "technicien", label: "créé par" },
    { name: "categorie", label: "Catégorie" },
    { name: "description", label: "Description" },
    { name: "equipement_deficitaire", label: "Équipement défectueux" },
    { name: "commentaire", label: "Commentaire responsable" },
    { name: "urgence", label: "Urgence" },
    {
      name: "createdAt",
      label: "Date de création",
      options: {
        customBodyRender: (value) =>
          value ? moment(value).format("DD/MM/YYYY HH:mm") : "",
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
            <div style={{ display: "flex", gap: "8px" }}>
              <IconButton onClick={() => handleView(rowData)} color="primary">
                <EyeIcon />
              </IconButton>
              <IconButton onClick={() => handleUpdate(rowData)} color="default">
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => handleDelete(rowData)}
                color="secondary"
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  console.log(rowData); // This will print rowData in the console
                  handleCloseTicket(rowData);
                }}
                color="success"
              >
                <CheckCircleIcon />
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
          maxWidth="md"
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
    </>
  );
};

export default TicketMaintenance;
