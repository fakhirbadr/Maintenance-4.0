import { createTheme, ThemeProvider, IconButton } from "@mui/material";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { jsPDF } from "jspdf"; // Import jsPDF
import LogoNextronic from "../../../../public/images/Rapport/aba-galaxy.png";
import axios from "axios";

const RapportIntervention = () => {
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

  // Dummy data for demonstration

  // Columns definition
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
    {
      name: "action",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex;
          const rowData = rows[rowIndex];

          // Function to generate PDF
          const handleDownloadPdf = () => {
            const doc = new jsPDF({ format: "a4" });

            // Ajouter un logo
            doc.addImage(LogoNextronic, "JPEG", 13, 15, 25, 10);

            // Définir les cellules avec textes dynamiques et personnalisés
            const cellules = [
              {
                x: 90,
                y: 14,
                width: 40,
                height: 10,
                text: `Site : ${rowData.site || "Non spécifié"}`,
                style: { font: "times", size: 8, color: [0, 0, 0] }, // Texte bleu
              },
              {
                x: 130,
                y: 14,
                width: 45,
                height: 10,
                text: `Date : ${rowData.date || "Indisponible"}`,
                style: { font: "times", size: 8, color: [0, 0, 0] }, // Texte rouge
              },
              {
                x: 175,
                y: 14,
                width: 30,
                height: 10,
                text: `ID : ${
                  rowData._id ? rowData._id.slice(-15) : "Inconnu"
                }`,
                style: { font: "times", size: 8, color: [0, 0, 0] }, // Texte vert
              },
            ];

            // Dessiner les cellules avec styles personnalisés
            cellules.forEach((cellule) => {
              const { x, y, width, height, text, style } = cellule;

              // Dessiner le contour
              doc.rect(x, y, width, height);

              // Appliquer le style
              doc.setFont(style.font || "helvetica", "normal");
              doc.setFontSize(style.size || 10);
              doc.setTextColor(...(style.color || [0, 0, 0]));

              // Ajouter le texte
              const wrappedText = doc.splitTextToSize(text, width - 2); // Gérer les retours à la ligne
              const textX = x + 2;
              const textY = y + 6; // Ajustement pour le haut de la cellule
              doc.text(wrappedText, textX, textY);
            });

            

            // Sauvegarder le PDF
            doc.save(`Rapport_${rowData.Site}_${rowData.date}.pdf`);
          };

          return (
            <IconButton onClick={handleDownloadPdf} color="primary">
              <PictureAsPdfIcon />
            </IconButton>
          );
        },
      },
    },
  ];

  const options = {
    filterType: "",
    selectableRows: false,
    rowsPerPage: 5,
    rowsPerPageOptions: [30, 50, 70, 100],
    search: true,
    download: true,
    downloadOptions: {
      filename: "collaborateurs.csv",
      separator: ",",
      responsive: "true",
    },
  };
  // chargement des donnees depuis L'API
  const [rows, setRows] = useState([]);
  const [ticket, setTickets] = useState([]);
  const [error, setError] = useState(null);
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
    <div>
      <div className="w-[100%] py-3">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Gestion de tickets"}
            data={rows}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      </div>
    </div>
  );
};

export default RapportIntervention;
