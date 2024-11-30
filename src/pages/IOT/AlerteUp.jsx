import { Button, createTheme, ThemeProvider } from "@mui/material";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";

const AlerteUp = () => {
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const options = {
    filterType: "checkbox",
    selectableRows: "none",
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 50, 70, 100],
    search: true,
    download: true,
    downloadOptions: {
      filename: "alerts.csv",
      separator: ",",
    },
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

  const columns = [
    {
      name: "date",
      label: "Date / Heure",
      options: { filter: true, sort: true },
    },
    { name: "serial", label: "Serial", options: { filter: true, sort: true } },
    {
      name: "reference",
      label: "Reference",
      options: { filter: true, sort: true },
    },
    { name: "name", label: "Nom", options: { filter: true, sort: true } },
    { name: "region", label: "Région", options: { filter: true, sort: true } },
    {
      name: "province",
      label: "Province",
      options: { filter: true, sort: true },
    },
    { name: "state", label: "Etat", options: { filter: false, sort: false } },
    {
      name: "stockType",
      label: "Type de stock",
      options: { filter: true, sort: true },
    },
    { name: "type", label: "Type", options: { filter: true, sort: true } },
    {
      name: "alertLevel",
      label: "Niveau d'alert",
      options: { filter: true, sort: true },
    },
    { name: "value", label: "Valeur", options: { filter: true, sort: true } },
    {
      name: "action",
      label: "Action",
      options: { filter: false, sort: false },
    },
  ];

  const fetchAlerte = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://api.portail.nextrack.io/v1/logs?populate=region,province,user,action,operation,cause,state&page=1&limit=10&sortBy=createdAt:desc",
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2M2M2OGRjMzYzZjgwYTAwMmUzNTY1ZWIiLCJpYXQiOjE3MzI2OTQ1MTQsImV4cCI6MTczMjY5NjMxNCwidHlwZSI6ImFjY2VzcyJ9.k4zyHUSJz0hmVFMwbK9KkBFFrZKBc0WL8XJsz2tMdxc",
            "Content-Type": "application/json",
          },
        }
      );
      if (Array.isArray(response.data.data.alerts)) {
        setRows(response.data.data.alerts);
      } else {
        throw new Error("Les données reçues ne sont pas au format attendu.");
      }
    } catch (err) {
      if (err.response) {
        // Afficher une erreur en fonction du statut HTTP
        switch (err.response.status) {
          case 404:
            setError("Endpoint introuvable : vérifiez l'URL.");
            break;
          case 401:
            setError("Accès refusé : Token invalide ou expiré.");
            break;
          default:
            setError(
              `Erreur serveur (${err.response.status}): ${
                err.response.data.message || "Erreur inconnue."
              }`
            );
        }
      } else if (err.request) {
        setError("Aucune réponse du serveur. Vérifiez votre connexion réseau.");
      } else {
        setError(`Erreur: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerte();
  }, []);

  return (
    <div>
      <div className="flex justify-between gap-4">
        <Button variant="outlined" onClick={fetchAlerte} disabled={loading}>
          Rafraîchir
        </Button>
        <Button variant="outlined">Télécharger Excel</Button>
      </div>
      <div className="w-[100%] py-3">
        <ThemeProvider theme={getMuiTheme()}>
          {loading ? (
            <div className="text-center text-white">
              Chargement des données...
            </div>
          ) : (
            <MUIDataTable
              title={"Gestion de tickets"}
              data={rows}
              columns={columns}
              options={options}
            />
          )}
        </ThemeProvider>
      </div>
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default AlerteUp;
