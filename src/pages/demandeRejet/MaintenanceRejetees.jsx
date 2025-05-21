import { useEffect, useState } from "react";
import {
  ContentCopy,
  ExpandMore,
  ExpandLess,
  Delete,
} from "@mui/icons-material";
import { Tooltip, IconButton, Collapse, Box, Chip } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";

const MaintenanceRejetees = () => {
  const [rows, setRows] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/ticketMaintenance?isClosed=true&isDeleted=false"
        );
        setRows(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const columns = [
    {
      name: "_id",
      label: "ID",
      options: {
        display: false,
        filter: false,
      },
    },
    {
      name: "name",
      label: "Nom du ticket",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "region",
      label: "Region",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "province",
      label: "Province",
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
      label: "demander par",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "categorie",
      label: "categorie",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "equipement_deficitaire",
      label: "equipement",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "description",
      label: "description",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "createdAt",
      label: "Date création",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) =>
          new Date(value).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
      },
    },
    {
      name: "updatedAt",
      label: "Date suppression",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) =>
          new Date(value).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
      },
    },
    {
      name: "deletedBy",
      label: "Supprimé par",
      //   options: {
      //     filter: true,
      //     sort: true,
      //     customBodyRender: (value) => (
      //       <Chip
      //         icon={<Delete fontSize="small" />}
      //         label={value || "Inconnu"}
      //         color="error"
      //         size="small"
      //       />
      //     ),
      //   },
    },

    {
      name: "subTickets",
      label: "Sous-tickets",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const hasSubTickets = value && value.length > 0;
          const rowId = tableMeta.rowData[0];

          return hasSubTickets ? (
            <Tooltip title="Afficher les sous-tickets">
              <IconButton
                size="small"
                onClick={() => toggleRowExpand(rowId)}
                aria-label="Afficher les sous-tickets"
              >
                {expandedRows[rowId] ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Tooltip>
          ) : null;
        },
      },
    },
  ];

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

  const options = {
    filterType: "checkbox",
    selectableRows: "none",
    rowsPerPage: 50,
    rowsPerPageOptions: [10, 50, 70, 100],
    search: true,
    download: true,
    setRowProps: (row, dataIndex, rowIndex) => {
      const id = row[0];
      return {
        style: {
          backgroundColor: expandedRows[id] ? "#2d3748" : "inherit",
        },
      };
    },
    expandableRows: true,
    renderExpandableRow: (rowData, rowMeta) => {
      const id = rowData[0];
      const row = rows.find((r) => r._id === id);
      const subTickets = row?.subTickets || [];

      if (!expandedRows[id] || subTickets.length === 0) return null;

      return (
        <tr>
          <td colSpan={rowData.length + 1}>
            <Collapse in={expandedRows[id]} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <h4>Sous-tickets:</h4>
                {subTickets.map((subTicket, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "1rem",
                      padding: "1rem",
                      border: "1px solid #444",
                    }}
                  >
                    <p>
                      <strong>Nom:</strong> {subTicket.name}
                    </p>
                    <p>
                      <strong>Statut:</strong> {subTicket.status}
                    </p>
                    <p>
                      <strong>Équipement:</strong>{" "}
                      {subTicket.equipement_deficitaire}
                    </p>
                    <p>
                      <strong>Description:</strong> {subTicket.description}
                    </p>
                    <p>
                      <strong>Quantité:</strong> {subTicket.quantite}
                    </p>
                    <p>
                      <strong>Commentaire:</strong> {subTicket.commentaire}
                    </p>
                    <p>
                      <strong>Date création:</strong>{" "}
                      {new Date(subTicket.createdAt).toLocaleString()}
                    </p>

                    <div>
                      <strong>Historique des statuts:</strong>
                      <ul>
                        {subTicket.statusHistory?.map((history, i) => (
                          <li key={i}>
                            {history.status} -{" "}
                            {new Date(history.timestamp).toLocaleString()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </Box>
            </Collapse>
          </td>
        </tr>
      );
    },
  };

  return (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        title={"Liste des commandes rejetées (supprimées)"}
        data={rows}
        columns={columns}
        options={options}
      />
    </ThemeProvider>
  );
};

export default MaintenanceRejetees;
