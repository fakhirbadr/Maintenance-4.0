import * as React from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import WhatshotOutlinedIcon from "@mui/icons-material/WhatshotOutlined";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import CloudOffOutlinedIcon from "@mui/icons-material/CloudOffOutlined";
import { Button, createTheme, ThemeProvider, useTheme } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { rows, columns } from "./DataCapteur";

import * as XLSX from "xlsx"; // Importation de la bibliothèque xlsx

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

const handleDownloadExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Collaborateurs");
  XLSX.writeFile(
    workbook,
    "Lister des capteurs des unité medical et logistique.xlsx"
  );
};

const HomePageCapteur = () => {
  const [value, setValue] = React.useState();
  const navigate = useNavigate(); // Hook to navigate between routes
  const theme = useTheme();
  const textColor =
    theme.palette.mode === "dark" ? "text-orange-500" : "text-blue-500";
  return (
    <div>
      <div>
        {" "}
        <h2
          className={`mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl uppercase ${textColor}`}
        >
          Capteur de température
        </h2>
      </div>
      <div className="flex justify-end gap-4">
        <Button variant="outlined" onClick={handleDownloadExcel}>
          Télécharger Excel
        </Button>
      </div>
      <div className="w-[100%] py-9">
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
      <Box
        sx={{
          backgroundColor: "gold",
          width: "100%",
          position: "fixed",
          bottom: 0,
        }}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            if (newValue === 0) navigate("/Capteur");
            if (newValue === 1) navigate("/DOWN");
            if (newValue === 2) navigate("/OFFLINE");
          }}
        >
          <BottomNavigationAction label="UP" icon={<WhatshotOutlinedIcon />} />
          <BottomNavigationAction label="DOWN" icon={<AcUnitOutlinedIcon />} />
          <BottomNavigationAction
            label="OFFLINE"
            icon={<CloudOffOutlinedIcon />}
          />
        </BottomNavigation>
      </Box>
    </div>
  );
};

export default HomePageCapteur;
