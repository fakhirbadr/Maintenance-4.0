import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MUIDataTable from "mui-datatables";
import * as XLSX from "xlsx";
import axios from "axios";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const TicketDemandes = () => {
  const [name, setName] = useState("");
  const [rows, setRows] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!name) return;
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/fournitureRoutes?technicien=${name}&isDeleted=false`
        );
        setRows(response.data.fournitures);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    fetchData();
  }, [name]);

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Collaborateurs");
    XLSX.writeFile(workbook, "demande_fourniture.xlsx");
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

  const handleReceptionClick = (rowData) => {
    setSelectedRow(rowData);
    setConfirmDialogOpen(true);
  };

  const handleConfirmReception = async () => {
    const id = selectedRow._id || selectedRow.id;
    setLoadingId(id);
    setConfirmDialogOpen(false);
    try {
      // PATCH sur l'API
      await axios.patch(`${apiUrl}/api/v1/fournitureRoutes/${id}`, {
        status: "recu",
        technicienReception: name,
      });
      // Mise à jour locale
      setRows((prevRows) =>
        prevRows.map((row) =>
          (row._id || row.id) === id
            ? {
                ...row,
                status: "recu",
                technicienReception: name,
              }
            : row
        )
      );
    } catch (error) {
      console.error("Erreur lors de l'accusé de réception :", error);
      alert("Erreur lors de l'accusé de réception !");
    }
    setLoadingId(null);
    setSelectedRow(null);
  };

  const handleCancelReception = () => {
    setConfirmDialogOpen(false);
    setSelectedRow(null);
  };

  const options = {
    filterType: "checkbox",
    selectableRows: "none",
    rowsPerPage: 100,
    rowsPerPageOptions: [10, 50, 70, 100],
    search: true,
    download: true,
    setRowProps: (_, dataIndex) => {
      const rowData = rows[dataIndex];
      return {
        style: {
          backgroundColor: rowData.isClosed ? "" : "inherit",
        },
      };
    },
  };

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      if (userInfo.nomComplet) {
        setName(userInfo.nomComplet);
      }
    }
  }, []);

  const columns = [
    {
      name: "name",
      label: "Nom",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "categorie",
      label: "Catégorie",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "besoin",
      label: "Besoin",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "quantite",
      label: "Quantité",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "technicien",
      label: "Créé par",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "status",
      label: "Status",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "isClosed",
      label: "État",
      options: {
        filter: true,
        filterType: "dropdown",
        customBodyRender: (value) => (value ? "traité" : "en cours"),
        filterOptions: {
          names: ["traité", "en cours"],
          logic: (value, filterValue) => {
            if (filterValue.length === 0) return false;
            return (
              (filterValue.includes("traité") && !value) ||
              (filterValue.includes("en cours") && value)
            );
          },
        },
      },
    },
    {
      name: "commentaire",
      label: "Commentaire responsable",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "dateCreation",
      label: "Date de création",
      options: {
        filter: true,
        sort: false,
        filterType: "dropdown",
        customBodyRender: (value) => {
          const date = new Date(value);
          return date.toLocaleString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        },
      },
    },
    {
      name: "technicienReception",
      label: "Technicien réception",
      options: {
        filter: true,
        sort: false,
        filterType: "dropdown",
        customBodyRenderLite: (dataIndex) => {
          const row = rows[dataIndex];
          if (row.status === "recu") {
            return row.technicienReception || "—";
          }
          if (row.status === "En cours de livraison") {
            return (
              <Button
                variant="contained"
                color="success"
                size="small"
                disabled={loadingId === (row._id || row.id)}
                onClick={() => handleReceptionClick(row)}
              >
                {loadingId === (row._id || row.id) ? "..." : "Accuser réception"}
              </Button>
            );
          }
          return "—";
        },
      },
    },
  ];

  return (
    <div>
      <div className="flex justify-end gap-4">
        <Button onClick={handleDownloadExcel} variant="outlined">
          Télécharger Excel
        </Button>
      </div>
      <div className="w-[100%] py-3">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Gestion des fournitures"}
            data={rows}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      </div>

      {/* Dialog de confirmation */}
      <Dialog open={confirmDialogOpen} onClose={handleCancelReception}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Voulez-vous vraiment accuser la réception de cette demande ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelReception} color="secondary">
            Annuler
          </Button>
          <Button
            onClick={handleConfirmReception}
            color="primary"
            variant="contained"
            disabled={loadingId === (selectedRow?._id || selectedRow?.id)}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TicketDemandes;