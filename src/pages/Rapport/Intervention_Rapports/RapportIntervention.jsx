import { createTheme, ThemeProvider, IconButton } from "@mui/material";
import MUIDataTable from "mui-datatables";
import React from "react";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { jsPDF } from "jspdf"; // Import jsPDF
import LogoNextronic from "../../../../public/images/Rapport/aba-galaxy.png";

const RapportIntervention = () => {
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

  // Dummy data for demonstration
  const rows = [
    {
      id: 1,
      Site: "UMMCr OUMEJRANE TINGHIR",
      date: "2024-08-22",
      technicien: "Oumaima LALLALEN",
      typeIntervention: "Réparation",
      statut: "Terminé",
      lieu: "Casablanca",
      description: "Réparation du système de climatisation dans le bâtiment A.",
      heureDebut: "08:00",
      heureFin: "10:00",
      commentaires: "Intervention réussie, le système fonctionne normalement.",
    },
    {
      id: 2,
      Site: "UMMC  TINGHIR",
      date: "2024-08-23",
      technicien: "Mohamed RAZIN",
      typeIntervention: "Maintenance Préventive",
      statut: "Terminé",
      lieu: "Rabat",
      description: "Maintenance préventive du générateur électrique.",
      heureDebut: "09:30",
      heureFin: "23:32",
      commentaires: "Vérification des niveaux de carburant et des filtres.",
    },
    {
      id: 3,
      Site: "UMMC OUMEJRANE ",
      date: "2024-08-24",
      technicien: "Ismail BELGHITI",
      typeIntervention: "Dépannage",
      statut: "Annulé",
      lieu: "Marrakech",
      description: "Dépannage du système de plomberie dans le bureau 12.",
      heureDebut: "18:00",
      heureFin: "13:00",
      commentaires: "L'intervention a été annulée par le client.",
    },
    {
      id: 4,
      Site: "UMMC RABAT",
      date: "2024-08-25",
      technicien: "Abderahmen AKRAN",
      typeIntervention: "Installation",
      statut: "Terminé",
      lieu: "Fès",
      description: "Installation d'un nouveau système de sécurité.",
      heureDebut: "14:00",
      heureFin: "17:00",
      commentaires:
        "Installation terminée avec succès, tous les équipements sont fonctionnels.",
    },
    {
      id: 5,
      Site: "UMMC TANGER",
      date: "2024-08-26",
      technicien: "Oumaima LALLALEN",
      typeIntervention: "Inspection",
      statut: "Terminé",
      lieu: "Agadir",
      description: "Inspection des équipements de ventilation.",
      heureDebut: "11:00",
      heureFin: "13:34",
      commentaires:
        "L'inspection est en cours, aucune anomalie détectée jusqu'à présent.",
    },
    {
      id: 6,
      Site: "UMMC CASABLANCA",
      date: "2024-08-27",
      technicien: "Mohamed RAZIN",
      typeIntervention: "Réparation",
      statut: "Terminé",
      lieu: "Tanger",
      description: "Réparation du système de chauffage central.",
      heureDebut: "15:00",
      heureFin: "17:30",
      commentaires: "Réparation effectuée, test complet réalisé avec succès.",
    },
    {
      id: 7,
      Site: "UMMC MARRAKECH",
      date: "2024-08-27",
      technicien: "Mohamed RAZIN",
      typeIntervention: "Réparation",
      statut: "Terminé",
      lieu: "Tanger",
      description: "Réparation du système de chauffage central.",
      heureDebut: "15:00",
      heureFin: "17:30",
      commentaires: "Réparation effectuée, test complet réalisé avec succès.",
    },
    {
      id: 8,
      Site: "UMMC SIDI IFNI",
      date: "2024-08-27",
      technicien: "Mohamed RAZIN",
      typeIntervention: "Réparation",
      statut: "Terminé",
      lieu: "Tanger",
      description: "Réparation du système de chauffage central.",
      heureDebut: "15:00",
      heureFin: "17:30",
      commentaires: "Réparation effectuée, test complet réalisé avec succès.",
    },
  ];

  // Columns definition
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
            const text =
              "Voici un exemple de longue phrase qui doit être automatiquement découpée en plusieurs lignes si elle dépasse une certaine largeur.";
            const maxWidth = 180;

            // Position du texte (par exemple en bas à droite)
            const x = 20; // ajuster la valeur pour l'alignement souhaité
            const y = 280; // ajuster pour placer le texte en bas de la page

            const pageHeight = doc.internal.pageSize.height;
            const pageWidth = doc.internal.pageSize.width;

            // Add logo image (Ensure it's base64 or accessible)
            doc.addImage(LogoNextronic, "JPEG", 13, 15, 25, 10);

            // Title
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text(
              "Rapport de Maintenance et d'Assistance Technique",
              pageWidth / 2,
              16,
              { align: "center" }
            );

            // Report details
            doc.setFontSize(11);
            doc.text(` ${rowData.date}`, pageWidth / 2, 24, {
              align: "center",
            });

            // Intervention Type
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text(`** ${rowData.typeIntervention} **`, pageWidth / 2, 32, {
              align: "center",
            });

            // Draw a border
            doc.setLineWidth(0.5);
            doc.line(10, 5, pageWidth - 10, 5); // Top line
            doc.line(10, 35, pageWidth - 10, 35); // Line under header
            doc.line(10, 290, pageWidth - 10, 290); // Bottom line
            doc.line(10, 5, 10, 290); // Left side line
            doc.line(pageWidth - 10, 5, pageWidth - 10, 290); // Right side line

            // Report content
            doc.setFontSize(12);
            doc.text("Objet:", 18, 45, { align: "left" });
            doc.setFontSize(11);
            doc.text(
              `Rapport des opérations de maintenance sur ${rowData.Site}`,
              12,
              55
            );
            doc.text(
              `Lieu: ${rowData.lieu}, le ${rowData.date} à ${rowData.heureDebut}.`,
              12,
              60
            );

            doc.text("Détails de l'intervention:", 18, 75);
            doc.text(
              `Type d'intervention: ${rowData.typeIntervention}`,
              14,
              85
            );
            doc.text("Équipements concernés: Réfrigérateur", 14, 90);
            doc.text(`Travaux effectués: ${rowData.description}`, 14, 95);

            // Duration and Technician
            doc.text(`Durée de l'intervention: 4 heures 33 MIN.`, 14, 100);
            doc.text(`Équipe d'intervention: ${rowData.technicien}`, 14, 105);

            doc.text(text, x, y, { maxWidth: maxWidth });

            // Comments
            doc.setFont("helvetica", "bold");
            doc.text("Commentaire:", 18, 115);
            doc.setFontSize(11);
            doc.text(`${rowData.commentaires}`, 14, 125);
            doc.text("Technicien responsable : [Signature]", 100, 240); // Coordonnées X, Y
            doc.text(
              "Superviseur / Responsable de site : [Signature]",
              100,
              250
            );
            doc.text(`Date : ${Date()}`, 100, 260);

            // Save PDF
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
