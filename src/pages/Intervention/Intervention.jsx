import React, { useEffect, useState } from "react";
import Location from "../../components/Location";
import { Button, ThemeProvider } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { createTheme } from "@mui/material/styles";
import { LineChart } from "@mui/x-charts/LineChart";
import Model from "./Model";
import axios from "axios";

import * as XLSX from "xlsx"; // Importation de la bibliothèque xlsx
const Intervention = () => {
  const [modelIsOpen, setModelIsOpen] = useState();
  const [rows, setRows] = useState([]);
  const [ticket, setTickets] = useState([]);
  const [error, setError] = useState(null);
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
              whiteSpace: "wrap", // Évite le saut de ligne
              overflow: "hidden", // Cache le texte qui dépasse
              textOverflow: "ellipsis", // Ajoute "..." si le texte dépasse
            },
          },
        },
      },
    });
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
      label: "Lieu",
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
      name: "commentaires",
      label: "Commentaires",
      options: {
        filter: false,
        sort: false,
      },
    },
  ];

  const options = {
    filterType: "",
    selectableRows: false,
    rowsPerPage: 10,
    rowsPerPageOptions: [30, 50, 70, 100],
    search: true,
    download: true, // Active le téléchargement CSV
    downloadOptions: {
      filename: "collaborateurs.csv", // Nom du fichier téléchargé
      separator: ",", // Séparateur utilisé dans le fichier CSV
      responsive: "true",
    },
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Collaborateurs");
    XLSX.writeFile(workbook, "collaborateurs.xlsx");
  };
  const hundleCloture = () => {};

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
  return (
    <>
      <div>
        <Location />
      </div>
      <div className="flex justify-end gap-4">
        <Button onClick={handleDownloadExcel} variant="outlined">
          Télécharger Excel
        </Button>
        {/* <Button onClick={() => setModelIsOpen(true)} variant="outlined">
          Ajouter
        </Button> */}
      </div>

      <h2 className="flex flex-row flex-nowrap items-center mt-4">
        <span className="flex-grow block border-t border-black"></span>
        <span className="flex-none block mx-4 px-4 text-sm rounded leading-none font-medium bg-black text-white">
          {rows.length} {rows.length === 1 ? "intervention" : "interventions"}{" "}
          avec{" "}
          <label className="text-green-600 font-bold" htmlFor="">
            succes 👍
          </label>
        </span>
        <span className="flex-grow block border-t border-black"></span>
      </h2>

      {modelIsOpen && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 ">
          <div className="bg-blue-500 p-4 rounded-md shadow-lg">
            <Model setModelIsOpen={setModelIsOpen} isOpen={modelIsOpen} />
          </div>
        </div>
      )}
      <div className="w-[100%] py-3">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Suivi et gestion des interventions"}
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

export default Intervention;
