import React, { useState } from "react";
import Location from "../../components/Location";
import { Button, createTheme, ThemeProvider } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { rows as initialRows } from "./Data"; // Importer les données initiales
import ModalUser from "./ModalUser";
import Model from "./Model";
import AddProfil from "./AddProfil";

import * as XLSX from "xlsx";

const Profils = () => {
  const [rows, setRows] = useState(initialRows); // État des données du tableau
  const [open, setOpen] = useState(false);
  const [modelIsOpen, setModelIsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = [
    {
      name: "id",
      label: "ID",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "photo",
      label: "Photo",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => (
          <img
            src={value}
            alt="photo"
            style={{ width: 50, height: 50, borderRadius: "50%" }} // Ajustez la taille si nécessaire
          />
        ),
      },
    },
    {
      name: "name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "poste",
      label: "Poste",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "hireDate",
      label: "Date d'embauche",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "cin",
      label: "CIN",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "region",
      label: "Région",
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
      name: "age",
      label: "Âge",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "sex",
      label: "Sexe",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "phone",
      label: "Téléphone",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "email",
      label: "E-mail",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "address",
      label: "Adresse",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];
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
              whiteSpace: "wrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
          },
        },
      },
    });

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Collaborateurs");
    XLSX.writeFile(workbook, "Liste_des_utilisateurs.xlsx");
  };

  const handleSave = (updatedData) => {
    // Mettre à jour les données dans l'état
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === updatedData.id ? updatedData : row))
    );
    console.log("Données mises à jour:", updatedData);
  };

  const options = {
    filterType: "",
    selectableRows: false,
    rowsPerPage: 10,
    rowsPerPageOptions: [30, 50, 70, 100],
    search: true,
    download: true,
    downloadOptions: {
      filename: "collaborateurs.csv",
      separator: ",",
    },
    onRowClick: (rowData) => handleRowClick(rowData),
  };

  const handleRowClick = (rowData) => {
    setSelectedRow(rowData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };
  const [addProfil, setAddProfil] = useState(false);

  return (
    <div>
      <div>
        <Location />
      </div>
      <div className="flex justify-end gap-4">
        <Button onClick={handleDownloadExcel} variant="outlined">
          Télécharger Excel
        </Button>
        <Button onClick={() => setAddProfil(true)} variant="outlined">
          Ajouter
        </Button>
      </div>
      {addProfil && (
        <div className=" fixed flex  justify-center items-center inset-0 bg-black z-50 bg-opacity-75">
          <div className="bg-blue-500 w-[50%]  p-4 rounded-md shadow-lg">
            <AddProfil setAddProfil={setAddProfil} />
          </div>
        </div>
      )}
      <div className="w-[100%] py-3">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Liste des utilisateurs"}
            data={rows} // Utilisez les données mises à jour
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      </div>
      <ModalUser
        open={open}
        handleClose={handleClose}
        selectedRow={selectedRow}
        onSave={handleSave}
      />
    </div>
  );
};

export default Profils;
