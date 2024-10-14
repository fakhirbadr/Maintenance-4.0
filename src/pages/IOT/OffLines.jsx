import React from "react";
import Location from "../../components/Location";
import { Button, ThemeProvider } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { createTheme } from "@mui/material/styles";
import { rows, columns } from "./DataCapteur";

const OffLines = () => {
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
              whiteSpace: "wrap",
            },
            body: {
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
  return (
    <div>
      <h2 className="flex flex-row flex-nowrap items-center mt-4">
        <span className="flex-grow block border-t border-black"></span>
        <span className="flex-none block mx-4 px-4 text-sm rounded leading-none font-medium bg-black text-white">
          {rows.length} {rows.length === 1 ? "capteur" : "capteurs"}{" "}
          <label className="text-red-600 font-bold" htmlFor="">
            déconnecter ❌
          </label>
        </span>
        <span className="flex-grow block border-t border-black"></span>
      </h2>
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
    </div>
  );
};

export default OffLines;
