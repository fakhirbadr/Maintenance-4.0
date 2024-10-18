import { Button, createTheme, IconButton, ThemeProvider } from "@mui/material";
import MUIDataTable from "mui-datatables";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { rows } from "./Data";

const Historique = () => {
  const [enlargedImage, setEnlargedImage] = useState(null);

  const options = {
    filterType: "",
    selectableRows: false,
    rowsPerPage: 10,
    rowsPerPageOptions: [30, 50, 70, 100],
    search: true,
    download: true,
    downloadOptions: {
      filename: "Liste des unites mobiles de santé",
      separator: ",",
      responsive: "true",
    },
  };

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
            },
            body: {
              padding: "7px 15px",
              color: "#e2e8f0",
            },
          },
        },
      },
    });

  const handleImageClick = (image) => {
    setEnlargedImage(image);
  };

  const handleClose = () => {
    setEnlargedImage(null);
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Collaborateurs");
    XLSX.writeFile(workbook, "Liste_des_livraison.xlsx");
  };

  // Function to render stars based on satisfaction rating
  const renderStars = (satisfaction) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= satisfaction) {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-yellow-300 ms-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        );
      } else {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 ms-1 text-gray-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        );
      }
    }
    return <div className="flex items-center">{stars}</div>;
  };

  const columns = [
    { name: "id", label: "id" },
    { name: "imie", label: "imie" },
    { name: "immatriculation", label: "immatriculation" },
    { name: "marque", label: "marque" },
    { name: "modele", label: "modele" },
    { name: "statut", label: "statut" },
    { name: "localisation", label: "localisation" },
    { name: "conducteur", label: "conducteur" },
    {
      name: "imageLivraison",
      label: "image",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => (
          <img
            src={value}
            alt="Véhicule"
            style={{
              width: 50,
              height: 50,
              cursor: "pointer",
              borderRadius: "50%",
            }}
            onClick={() => handleImageClick(value)}
          />
        ),
      },
    },
    { name: "statue", label: "statue" },
    { name: "de", label: "de" },
    { name: "a", label: "a" },
    { name: "vaccin", label: "vaccin" },
    { name: "délai", label: "délai" },
    { name: "réclamation", label: "réclamation" },
    {
      name: "satisfaction",
      label: "satisfaction Client",
      options: {
        customBodyRender: (value) => renderStars(value), // Use the star rendering function
      },
    },
  ];

  return (
    <div>
      <div>
        <Button variant="outlined" onClick={handleDownloadExcel}>
          Télécharger Excel
        </Button>
      </div>
      <h2 className="flex flex-row flex-nowrap items-center mt-4">
        <span className="flex-grow block border-t border-black"></span>
        <span className="flex-none block mx-4 px-4 text-sm rounded leading-none font-medium bg-black text-white">
          {rows.length} {rows.length === 1 ? "Livraison" : "Livraisons"} avec{" "}
          <label className="text-green-600 font-bold" htmlFor="">
            succes 👍
          </label>
        </span>
        <span className="flex-grow block border-t border-black"></span>
      </h2>

      <div className="w-[100%] py-3">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Liste des unites mobiles de santé"}
            data={rows}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      </div>
      {enlargedImage && (
        <div
          onClick={handleClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={enlargedImage}
            alt="Véhicule Agrandi"
            style={{ maxWidth: "90%", maxHeight: "90%" }}
          />
        </div>
      )}
      <div>photo de livraison</div>
    </div>
  );
};

export default Historique;
