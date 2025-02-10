import React, { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MUIDataTable from "mui-datatables";
import Layout from "./Layout";
import { Typography } from "@mui/material";
import axios from "axios";
import VueCoordinateur from "./VueCoordinateur";
import VueRh from "./VueRh"; // Importez VueRh

// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const getMuiTheme = () =>
  createTheme({
    typography: { fontFamily: "sans-serif" },
    palette: {
      background: { paper: "#ccccff", default: "#0f172a" },
      mode: "light",
    },
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: { padding: "10px 4px" },
          body: {
            padding: "7px 15px",
            color: "#000000",
            textOverflow: "ellipsis",
          },
        },
      },
    },
  });

const ListeDemandes = () => {
  const [role, setRole] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nomComplet, setNomComplet] = useState("");

  const handleAction = async (action, historiqueIndex, id) => {
    const isValidated = action === "validé";
    const payload = {
      isValidated: isValidated,
      historiqueIndex: 0,
    };

    try {
      const response = await fetch(`${apiUrl}/api/v1/absences/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Succès :", data);
        alert(`Action "${action}" traitée avec succès.`);
      } else {
        const errorText = await response.text();
        console.error("Erreur :", errorText);
        alert(`Échec de l'action "${action}". Erreur : ${errorText}`);
      }
    } catch (error) {
      console.error("Erreur de requête :", error.message);
      alert(
        `Une erreur s'est produite lors du traitement de l'action "${action}".`
      );
    }
  };
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        setRole(parsedUserInfo.role || "");
        setNomComplet(parsedUserInfo.nomComplet || "");
        console.log("Rôle récupéré :", parsedUserInfo.role);
      } catch (error) {
        console.error("Erreur lors de l'analyse de userInfo :", error);
      }
    }
  }, []);
  useEffect(() => {
    console.log("Valeur de nomComplet avant requête :", nomComplet);
  }, [nomComplet]);

  useEffect(() => {
    if (!nomComplet) return; // Si nomComplet est vide, ne pas exécuter la requête

    const fetchAbsences = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/absences?nomComplet=${nomComplet}`
        );

        const filteredData =
          role === "user"
            ? response.data.filter((item) => item.nomComplet === nomComplet)
            : response.data;

        console.log("Données filtrées :", filteredData);

        const transformedData = filteredData.flatMap((item) =>
          item.historique.map((historique, index) => ({
            id: `${item._id}`,
            nomComplet: item.nomComplet,
            dateDebut: new Date(historique.dateDebut).toLocaleDateString(),
            dateFin: new Date(historique.dateFin).toLocaleDateString(),
            typeAbsence: historique.typeAbsence,
            justification: historique.justification,
            nombreJours: historique.nombreJours,
            isValidated: historique.isValidated,
            role: item.role,
            province: item.province,
          }))
        );

        setData(transformedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAbsences();
  }, [nomComplet, role]); // Attend que `nomComplet` soit défini

  const columns = [
    {
      name: "id",
      options: {
        display: false,
      },
    },
    { name: "nomComplet", label: "Nom Complet" },
    {
      name: "role",
      label: "Poste",
      options: {
        customBodyRender: (value) => {
          return value === "user" ? "Technicien" : value;
        },
      },
    },
    { name: "province", label: "province" },
    { name: "dateDebut", label: "Date Début" },
    { name: "dateFin", label: "Date Fin" },
    { name: "typeAbsence", label: "Type d'Absence" },
    { name: "justification", label: "Justification" },
    {
      name: "nombreJours",
      label: "Nb des Jours",
      options: {
        customBodyRender: (value, tableMeta) => {
          const dateDebutString = tableMeta.rowData[4];
          const dateFinString = tableMeta.rowData[5];

          const [dayDebut, monthDebut, yearDebut] = dateDebutString
            .split("/")
            .map(Number);
          const [dayFin, monthFin, yearFin] = dateFinString
            .split("/")
            .map(Number);

          const dateDebut = new Date(yearDebut, monthDebut - 1, dayDebut);
          const dateFin = new Date(yearFin, monthFin - 1, dayFin);

          const diffTime = Math.abs(dateFin - dateDebut);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          return <span>{diffDays + 1} jours</span>;
        },
      },
    },
    {
      name: "isValidated",
      label: "Validation responsable",
      options: {
        customBodyRender: (value) => (
          <span style={{ color: value ? "green" : "red" }}>
            {value ? "Validé" : "Non Validé"}
          </span>
        ),
      },
    },
    {
      name: "Action",
      options: {
        customBodyRender: (_, tableMeta) => {
          const rowData = tableMeta.rowData;
          const historiqueIndex = tableMeta.rowIndex;
          const id = rowData[0];

          return (
            <div>
              <button
                onClick={() => handleAction("validé", historiqueIndex, id)}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                  marginRight: "5px",
                  borderRadius: "5px",
                }}
              >
                Validé
              </button>
              <button
                onClick={() => handleAction("rejeté", historiqueIndex, id)}
                style={{
                  backgroundColor: "#F44336",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
              >
                Rejeté
              </button>
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
  };

  return (
    <>
      <Layout />
      <div
        className={`bg-[#d1dffa] w-full h-full ${
          role === "user" || role === "superviseur" || role === "admin"
            ? "px-14 pt-44"
            : "px-6 w-full "
        }`}
      >
        {role === "user" || role === "admin" || role === "superviseur" ? (
          <ThemeProvider theme={getMuiTheme()}>
            {loading ? (
              <Typography variant="h6" color="text.secondary">
                Chargement des données...
              </Typography>
            ) : error ? (
              <Typography variant="h6" color="error">
                Une erreur est survenue : {error}
              </Typography>
            ) : (
              <MUIDataTable
                title={"Gestion des Demandes"}
                data={data}
                columns={columns}
                options={options}
              />
            )}
          </ThemeProvider>
        ) : role === "coordinateur" ? (
          <div className="flex justify-center items-center h-full">
            <Typography variant="h5" color="text.secondary">
              <VueCoordinateur />
            </Typography>
          </div>
        ) : role === "rh" ? (
          <div className="flex justify-center items-center h-full">
            <Typography variant="h5" color="text.secondary">
              <VueRh />
            </Typography>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <Typography variant="h5" color="text.secondary">
              Rôle inconnu ou non autorisé.
            </Typography>
          </div>
        )}
      </div>
    </>
  );
};

export default ListeDemandes;
