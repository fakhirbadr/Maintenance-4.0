import { useState } from "react";
import Location from "../../components/Location";
import { Button, createTheme, ThemeProvider } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { rows } from "./Data";
import * as XLSX from "xlsx";
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import ModelAdd from "./ModelAdd";
import ModelUpdate from "./ModelUpdate";

const Ticket = () => {
  const [closedRows, setClosedRows] = useState([]); // État pour stocker les lignes clôturées
  console.log(closedRows);

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
  const priorityColors = {
    critique: "black",
    élevée: "red", // High priority
    moyen: "orange", // Medium priority
    basse: "green", // Low priority
  };
  const handleCloturer = (dataIndex) => {
    console.log("Clôturer:", dataIndex);
    setClosedRows((prevClosedRows) => [...prevClosedRows, dataIndex]);
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
      responsive: "true",
    },
    setRowProps: (row, dataIndex) => {
      // Applique la couleur verte aux lignes clôturées
      const isClosed = closedRows.includes(dataIndex);
      return {
        style: {
          backgroundColor: isClosed ? "green" : "inherit",
        },
      };
    },
  };
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
      name: "date",
      label: "Date",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "Site",
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
      name: "typeIntervention",
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
      name: "lieu",
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
      name: "heureDebut",
      label: "Heure Début",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "heureFin",
      label: "Heure Fin",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "priorité",
      label: "Priorité",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => {
          const color = priorityColors[value] || "inherit"; // Default color if not found
          return (
            <div
              style={{
                backgroundColor: color,
                color: "white",
                padding: "5px",
                borderRadius: "4px",
              }}
            >
              {value}
            </div>
          );
        },
      },
    },
    {
      name: "Action",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const rowData = rows[tableMeta.rowIndex];
          const isClosed = closedRows.includes(tableMeta.rowIndex);

          return (
            <div className="flex items-center">
              <button
                onClick={() => {
                  setModelUpdateOpen(true);
                  setSelectedRowData(rowData);
                }}
                className={`flex items-center text-blue-500 hover:bg-blue-400 rounded-md ${
                  isClosed ? "pointer-events-none opacity-50" : ""
                }`}
              >
                <EditIcon style={{ marginRight: 4 }} />
              </button>
              <button
                onClick={() => handleCloturer(tableMeta.rowIndex)}
                className="flex items-center text-green-500 hover:bg-green-400 rounded-md mx-2"
                disabled={isClosed}
              >
                <CheckIcon style={{ marginRight: 4 }} />
              </button>
              <button
                onClick={() => handleSupprimer(tableMeta.rowIndex)}
                className="flex items-center text-red-500 hover:bg-red-400 rounded-md"
              >
                <DeleteIcon style={{ marginRight: 4 }} />
              </button>
            </div>
          );
        },
      },
    },
  ];

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Collaborateurs");
    XLSX.writeFile(workbook, "Gestion de TICKETS.xlsx");
  };

  const [modelAddIsOpen, setModelAddIsOpen] = useState(false);
  const [ModelUpdateOpen, setModelUpdateOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  return (
    <div>
      <div>
        <Location />
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outlined" onClick={handleDownloadExcel}>
          Télécharger Excel
        </Button>
        <Button variant="outlined" onClick={() => setModelAddIsOpen(true)}>
          Ajouter
        </Button>
      </div>
      {modelAddIsOpen && (
        <div className="fixed flex justify-center items-center inset-0 bg-black z-50 bg-opacity-75">
          <div className="bg-blue-500 p-4 rounded-md shadow-lg">
            <ModelAdd setModelAddIsOpen={setModelAddIsOpen} />
          </div>
        </div>
      )}
      {ModelUpdateOpen && (
        <div className="fixed flex inset-0 items-center justify-center bg-black z-50 bg-opacity-75">
          <div className="bg-blue-500 w-[50%] p-4 rounded-lg shadow-lg">
            <ModelUpdate
              setModelUpdateOpen={setModelUpdateOpen}
              rowData={selectedRowData}
            />
          </div>
        </div>
      )}
      <div className="flex justify-center  items-center">
        <div className=" px-7 bg-[#323C4D]   rounded-lg flex  justify-center items-center mt-5  gap-48">
          <div className="text-orange-400 ">
            En cours{" "}
            <span className="bg-white rounded-md text-blue-800 font-bold px-3 ">
              13
            </span>
          </div>
          <div className="text-red-600">
            Expiré{" "}
            <span className="bg-white rounded-md text-blue-800 font-bold px-3 ">
              4
            </span>
          </div>
          <div className="text-green-500">
            Terminé{" "}
            <span className="bg-white rounded-md text-blue-800 font-bold px-3 ">
              22
            </span>
          </div>
        </div>
      </div>

      <div className="w-[100%] py-3">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Gestion de tickets"}
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

export default Ticket;
