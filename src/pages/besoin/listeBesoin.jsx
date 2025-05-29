import React, { useEffect, useState } from "react";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MUIDataTable from "mui-datatables";
import UpdateDialog from "../besoin/updateBesoin"; // Import du composant UpdateDialog
import moment from "moment";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { CheckCircle, Edit, Eye, Delete } from "lucide-react"; // Icônes Lucide React
import SelectAllIcon from "@mui/icons-material/SelectAll";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InventoryIcon from "@mui/icons-material/Inventory";
import Logo from "../../../public/scx.png";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
  Checkbox,
  Divider,
  ListItemIcon,
} from "@mui/material";
import * as XLSX from "xlsx"; // Import XLSX to handle the Excel export
import { ContentCopy } from "@mui/icons-material";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const ListeBesoin = () => {
  const handleDownloadExcel = () => {
    // Filtrer les colonnes nécessaires
    const filteredRows = rows.map((row) => ({
      Nom: row.name,
      Région: row.region,
      Province: row.province,
      Catégorie: row.categorie,
      Besoin: row.besoin,
      Quantité: row.quantite,
      "Créé par": row.technicien,
      Status: row.status,
      "Commentaire Responsable": row.commentaire,
      "Date de Création": new Date(row.dateCreation).toLocaleDateString(
        "fr-FR"
      ),
      "Heure de Création": new Date(row.dateCreation).toLocaleTimeString(
        "fr-FR"
      ),
    }));

    // Générer le fichier Excel
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Collaborateurs");
    XLSX.writeFile(workbook, "demande_fourniture.xlsx");
  };

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closedRows, setClosedRows] = useState(new Set()); // New state to track closed rows
  const [openDialog, setOpenDialog] = useState(false); // Gestion de l'ouverture du dialogue
  const [selectedFourniture, setSelectedFourniture] = useState(null); // Fourniture sélectionnée pour modification
  const [updatedName, setUpdatedName] = useState(""); // Valeur modifiable du nom
  const [updatedCategorie, setUpdatedCategorie] = useState(""); // Valeur modifiable de la catégorie
  const [updatedBesoin, setUpdatedBesoin] = useState(""); // Valeur modifiable du besoin
  const [updatedQuantite, setUpdatedQuantite] = useState(""); // Valeur modifiable de la quantité
  const [updatedCommentaire, setUpdatedCommentaire] = useState(""); // Valeur modifiable de la commentaire

  const [openViewDialog, setOpenViewDialog] = useState(false); // State to control View Dialog visibility
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [timeElapsed, setTimeElapsed] = useState(""); // Timer state to show elapsed time
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusHistory, setStatusHistory] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  const [openPdfDialog, setOpenPdfDialog] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [deliveryRows, setDeliveryRows] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(""); // Utilisé uniquement pour la dialog PDF
  const [selectedActif, setSelectedActif] = useState(""); // Nouveau : filtre actif

  // Fonction pour ouvrir le dialogue de sélection PDF
  const handleOpenPdfDialog = () => {
    // Filtrer seulement les commandes "En cours de livraison"
    const filteredRows = rows.filter(
      (row) => row.status === "En cours de livraison"
    );
    setDeliveryRows(filteredRows);
    setSelectedRows([]);
    setOpenPdfDialog(true);
  };

  // Fonction pour fermer le dialogue
  const handleClosePdfDialog = () => {
    setOpenPdfDialog(false);
    setSelectedRows([]);
  };

  // Gérer la sélection/désélection des lignes
  const handleToggleRow = (rowId) => {
    setSelectedRows((prev) => {
      if (prev.includes(rowId)) {
        return prev.filter((id) => id !== rowId);
      } else {
        return [...prev, rowId];
      }
    });
  };

  // Sélectionner toutes les lignes
  const handleSelectAll = () => {
    if (selectedRows.length === deliveryRows.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(deliveryRows.map((row) => row.id));
    }
  };
  // Liste des régions et des actifs disponibles pour les dropdown dans la dialog

  const pdfActifs = Array.from(
    new Set(
      deliveryRows
        .filter((row) => !selectedRegion || row.region === selectedRegion)
        .map((row) => row.name)
    )
  ).filter(Boolean);
  // Liste des régions disponibles pour le dropdown dans la dialog
  const pdfRegions = Array.from(
    new Set(deliveryRows.map((r) => r.region))
  ).filter(Boolean);
  // Applique le filtre uniquement sur la liste de la dialog PDF
  // Applique le(s) filtre(s) uniquement sur la liste de la dialog PDF
  // Applique les filtres (région + nom d'actif) uniquement dans la dialog PDF
  const filteredDeliveryRows = deliveryRows.filter((row) => {
    const regionMatch = selectedRegion ? row.region === selectedRegion : true;
    const actifMatch = selectedActif ? row.name === selectedActif : true;
    return regionMatch && actifMatch;
  });
  // Générer le PDF
  // Générer le PDF avec une page par actif et header répété
  const generatePdf = () => {
    const doc = new jsPDF();

    try {
      // Convertir l'image en base64 si nécessaire
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL("image/png");

        generatePdfWithActifPages(doc, imgData);
      };
      img.src = Logo;
    } catch (error) {
      console.log("Logo non disponible, génération sans logo");
      generatePdfWithActifPages(doc, null);
    }
  };

  const generatePdfWithActifPages = (doc, logoData) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Récupérer les éléments sélectionnés
    const selectedItems = deliveryRows.filter((row) =>
      selectedRows.includes(row.id)
    );

    // Grouper les articles par actif/site
    const groupedByActif = selectedItems.reduce((acc, item) => {
      const actifName = item.name || "Actif non défini";
      if (!acc[actifName]) {
        acc[actifName] = [];
      }
      acc[actifName].push(item);
      return acc;
    }, {});

    const actifNames = Object.keys(groupedByActif);
    const totalPages = actifNames.length;

    // Fonction pour créer l'en-tête sur chaque page
    const createHeader = (pageNumber, actifName) => {
      let currentY = 20;

      // === Logo centré ===
      if (logoData) {
        const logoWidth = 40;
        const logoHeight = 20;
        const logoX = (pageWidth - logoWidth) / 2;
        doc.addImage(logoData, "PNG", logoX, currentY, logoWidth, logoHeight);
        currentY += 35;
      }

      // === Titre du document ===
      doc.setTextColor(0, 0, 0);
      doc.setFillColor(245, 245, 245);
      doc.rect(14, currentY, pageWidth - 28, 12, "F");

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(41, 115, 178);
      const title = "BON DE LIVRAISON";
      const titleWidth = doc.getTextWidth(title);
      const titleX = (pageWidth - titleWidth) / 2;
      doc.text(title, titleX, currentY + 8);

      currentY += 20;

      // === Informations de la page ===
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setFillColor(240, 248, 255);
      doc.rect(14, currentY, pageWidth - 28, 15, "F");

      // Nom de l'actif centré
      doc.setTextColor(41, 115, 178);
      const actifTitle = `SITE/ACTIF: ${actifName.toUpperCase()}`;
      const actifTitleWidth = doc.getTextWidth(actifTitle);
      const actifTitleX = (pageWidth - actifTitleWidth) / 2;
      doc.text(actifTitle, actifTitleX, currentY + 10);

      currentY += 25;

      // === Ligne de séparation ===
      doc.setDrawColor(41, 115, 178);
      doc.setLineWidth(0.5);
      doc.line(14, currentY, pageWidth - 14, currentY);

      return currentY + 10;
    };

    // === Génération d'une page par actif ===
    actifNames.forEach((actifName, index) => {
      // Ajouter une nouvelle page (sauf pour la première)
      if (index > 0) {
        doc.addPage();
      }

      // Créer l'en-tête
      let currentY = createHeader(index + 1, actifName);

      // Récupérer les articles pour cet actif
      const actifItems = groupedByActif[actifName];

      // === Informations de l'actif ===
      if (actifItems.length > 0) {
        const firstItem = actifItems[0];

        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text("INFORMATIONS DU SITE:", 14, currentY);

        currentY += 6;
        doc.setFont("helvetica", "normal");
        doc.text(`Région: ${firstItem.region || "N/A"}`, 14, currentY);
        doc.text(`Province: ${firstItem.province || "N/A"}`, 120, currentY);
        doc.text(`Nombre d'articles: ${actifItems.length}`, 14, currentY + 5);

        currentY += 15;
      }

      // === Tableau des articles ===
      const headers = [
        [
          "N°",
          "Catégorie",
          "Besoin/Article",
          "Quantité",
          "Unité",
          "Technicien",
          "Date création",
        ],
      ];

      const data = actifItems.map((item, itemIndex) => [
        (itemIndex + 1).toString(),
        item.categorie || "N/A",
        item.besoin || "N/A",
        item.quantite?.toString() || "0",
        item.unite || "Pce", // Nouvelle colonne unité avec valeur par défaut
        item.technicien || "N/A",
        new Date(item.dateCreation).toLocaleDateString("fr-FR"),
      ]);

      doc.autoTable({
        head: headers,
        body: data,
        startY: currentY,
        theme: "grid",
        styles: {
          fontSize: 7, // Réduction de la taille de police
          cellPadding: 3,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [41, 115, 178],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
          fontSize: 8, // Taille de police pour les en-têtes
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250],
        },
        columnStyles: {
          0: { halign: "center", cellWidth: 12 }, // N°
          1: { cellWidth: 25 }, // Catégorie
          2: { cellWidth: 45 }, // Besoin
          3: { halign: "center", cellWidth: 18 }, // Quantité
          4: { halign: "center", cellWidth: 15 }, // Unité
          5: { cellWidth: 35 }, // Technicien
          6: { halign: "center", cellWidth: 25 }, // Date
        },
        margin: { left: 14, right: 14 },
      });

      const tableEndY = doc.lastAutoTable.finalY + 10;

      // === Section des signatures ===
      const signatureStartY = Math.max(tableEndY + 10, pageHeight - 70);

      // Vérifier s'il faut une nouvelle page pour les signatures
      if (signatureStartY > pageHeight - 65) {
        doc.addPage();
        currentY = 30;
      } else {
        currentY = signatureStartY;
      }

      // Cadre pour les signatures
      doc.setDrawColor(41, 115, 178);
      doc.setLineWidth(0.5);
      doc.rect(14, currentY, pageWidth - 28, 45);

      // Titre signatures
      doc.setFillColor(41, 115, 178);
      doc.rect(14, currentY, pageWidth - 28, 10, "F");
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("SIGNATURES ET VALIDATION", pageWidth / 2 - 22, currentY + 6);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");

      // Expéditeur (gauche)
      doc.text("EXPÉDITEUR", 20, currentY + 16);
      doc.text("Nom:", 20, currentY + 22);
      doc.line(30, currentY + 22, 85, currentY + 22);
      doc.text("Signature:", 20, currentY + 32);
      doc.rect(20, currentY + 35, 65, 8);

      // Ligne verticale
      doc.line(pageWidth / 2, currentY + 12, pageWidth / 2, currentY + 45);

      // Réceptionnaire (droite)
      const rightX = pageWidth / 2 + 10;
      doc.text("RÉCEPTIONNAIRE", rightX, currentY + 16);
      doc.text("Nom:", rightX, currentY + 22);
      // doc.line(rightX + 15, rightX + 22, rightX + 65, currentY + 22);
      doc.text("Date réception:", rightX, currentY + 27);
      doc.line(rightX + 25, currentY + 27, rightX + 65, currentY + 27);
      doc.text("Signature:", rightX, currentY + 32);
      doc.rect(rightX, currentY + 35, 65, 8);

      // === Pied de page ===
      const footerY = pageHeight - 10;
      doc.setFontSize(6);
      doc.setTextColor(150, 150, 150);
      doc.text(`Document généré automatiquement`, pageWidth / 2, footerY, {
        align: "center",
      });

      // Ligne décorative
      doc.setDrawColor(41, 115, 178);
      doc.setLineWidth(0.5);
      doc.line(14, footerY - 3, pageWidth - 14, footerY - 3);
    });

    // === Sauvegarder le PDF ===
    const today = new Date();
    const dateStr = `${today.getFullYear()}${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}`;
    const fileName = `bons_livraison_par_actif_SCX_${dateStr}.pdf`;
    doc.save(fileName);

    // Fermer le dialogue
    handleClosePdfDialog();
  };
  // const generatePdfWithActifPages = (doc, logoData) => {
  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   const pageHeight = doc.internal.pageSize.getHeight();

  //   // Récupérer les éléments sélectionnés
  //   const selectedItems = deliveryRows.filter((row) =>
  //     selectedRows.includes(row.id)
  //   );

  //   // Grouper les articles par actif/site
  //   const groupedByActif = selectedItems.reduce((acc, item) => {
  //     const actifName = item.name || "Actif non défini";
  //     if (!acc[actifName]) {
  //       acc[actifName] = [];
  //     }
  //     acc[actifName].push(item);
  //     return acc;
  //   }, {});

  //   const actifNames = Object.keys(groupedByActif);
  //   const totalPages = actifNames.length;

  //   // Fonction pour créer l'en-tête sur chaque page
  //   const createHeader = (pageNumber, actifName) => {
  //     let currentY = 20;

  //     // === Logo ===
  //     if (logoData) {
  //       doc.addImage(logoData, "PNG", 14, currentY, 30, 15);
  //       currentY += 20;
  //     }

  //     // === Bandeau entreprise ===
  //     doc.setFillColor(41, 115, 178);
  //     doc.rect(0, currentY, pageWidth, 25, "F");

  //     doc.setTextColor(255, 255, 255);
  //     doc.setFontSize(18);
  //     doc.setFont("helvetica", "bold");

  //     const companyName = "SCX TECHNOLOGY";
  //     const companyTextWidth = doc.getTextWidth(companyName);
  //     const companyX = (pageWidth - companyTextWidth) / 2;
  //     doc.text(companyName, companyX, currentY + 10);

  //     doc.setFontSize(10);
  //     doc.setFont("helvetica", "normal");
  //     doc.text("Support : +212 767-370586", 14, currentY + 17);
  //     doc.text("Email : support@scx-tech.com", 14, currentY + 22);

  //     currentY += 35;

  //     // === Titre du document ===
  //     doc.setTextColor(0, 0, 0);
  //     doc.setFillColor(245, 245, 245);
  //     doc.rect(14, currentY, pageWidth - 28, 15, "F");

  //     doc.setFontSize(14);
  //     doc.setFont("helvetica", "bold");
  //     doc.setTextColor(41, 115, 178);
  //     const title = "BON DE LIVRAISON";
  //     const titleWidth = doc.getTextWidth(title);
  //     const titleX = (pageWidth - titleWidth) / 2;
  //     doc.text(title, titleX, currentY + 10);

  //     currentY += 25;

  //     // === Informations de la page ===
  //     doc.setTextColor(0, 0, 0);
  //     doc.setFontSize(12);
  //     doc.setFont("helvetica", "bold");
  //     doc.setFillColor(240, 248, 255);
  //     doc.rect(14, currentY, pageWidth - 28, 20, "F");

  //     // Nom de l'actif centré
  //     doc.setTextColor(41, 115, 178);
  //     const actifTitle = `SITE/ACTIF: ${actifName.toUpperCase()}`;
  //     const actifTitleWidth = doc.getTextWidth(actifTitle);
  //     const actifTitleX = (pageWidth - actifTitleWidth) / 2;
  //     doc.text(actifTitle, actifTitleX, currentY + 8);

  //     // Informations sur les côtés
  //     doc.setFontSize(10);
  //     doc.setFont("helvetica", "normal");
  //     doc.setTextColor(0, 0, 0);

  //     const today = new Date();
  //     const formattedDate = today.toLocaleDateString("fr-FR", {
  //       day: "2-digit",
  //       month: "long",
  //       year: "numeric",
  //     });
  //     const formattedTime = today.toLocaleTimeString("fr-FR", {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     });

  //     doc.text(`Date: ${formattedDate}`, 14, currentY + 15);
  //     doc.text(`Heure: ${formattedTime}`, 14, currentY + 19);
  //     doc.text(
  //       `Page ${pageNumber}/${totalPages}`,
  //       pageWidth - 40,
  //       currentY + 15
  //     );

  //     currentY += 30;

  //     // === Ligne de séparation ===
  //     doc.setDrawColor(41, 115, 178);
  //     doc.setLineWidth(0.8);
  //     doc.line(14, currentY, pageWidth - 14, currentY);

  //     return currentY + 10;
  //   };

  //   // === Génération d'une page par actif ===
  //   actifNames.forEach((actifName, index) => {
  //     // Ajouter une nouvelle page (sauf pour la première)
  //     if (index > 0) {
  //       doc.addPage();
  //     }

  //     // Créer l'en-tête
  //     let currentY = createHeader(index + 1, actifName);

  //     // Récupérer les articles pour cet actif
  //     const actifItems = groupedByActif[actifName];

  //     // === Informations de l'actif ===
  //     if (actifItems.length > 0) {
  //       const firstItem = actifItems[0];

  //       doc.setFontSize(10);
  //       doc.setFont("helvetica", "bold");
  //       doc.text("INFORMATIONS DU SITE:", 14, currentY);

  //       currentY += 8;
  //       doc.setFont("helvetica", "normal");
  //       doc.text(`Région: ${firstItem.region || "N/A"}`, 14, currentY);
  //       doc.text(`Province: ${firstItem.province || "N/A"}`, 120, currentY);
  //       doc.text(`Nombre d'articles: ${actifItems.length}`, 14, currentY + 6);

  //       currentY += 20;
  //     }

  //     // === Tableau des articles ===
  //     const headers = [
  //       [
  //         "N°",
  //         "Catégorie",
  //         "Besoin/Article",
  //         "Quantité",
  //         "Technicien",
  //         "Date création",
  //         "Statut",
  //       ],
  //     ];

  //     const data = actifItems.map((item, itemIndex) => [
  //       (itemIndex + 1).toString(),
  //       item.categorie || "N/A",
  //       item.besoin || "N/A",
  //       item.quantite?.toString() || "0",
  //       item.technicien || "N/A",
  //       new Date(item.dateCreation).toLocaleDateString("fr-FR"),
  //       item.status || "N/A",
  //     ]);

  //     doc.autoTable({
  //       head: headers,
  //       body: data,
  //       startY: currentY,
  //       theme: "grid",
  //       styles: {
  //         fontSize: 9,
  //         cellPadding: 4,
  //         lineColor: [200, 200, 200],
  //         lineWidth: 0.1,
  //       },
  //       headStyles: {
  //         fillColor: [41, 115, 178],
  //         textColor: 255,
  //         fontStyle: "bold",
  //         halign: "center",
  //       },
  //       alternateRowStyles: {
  //         fillColor: [248, 249, 250],
  //       },
  //       columnStyles: {
  //         0: { halign: "center", cellWidth: 15 }, // N°
  //         1: { cellWidth: 25 }, // Catégorie
  //         2: { cellWidth: 40 }, // Besoin
  //         3: { halign: "center", cellWidth: 20 }, // Quantité
  //         4: { cellWidth: 30 }, // Technicien
  //         5: { halign: "center", cellWidth: 25 }, // Date
  //         6: { halign: "center", cellWidth: 25 }, // Statut
  //       },
  //       margin: { left: 14, right: 14 },
  //     });

  //     const tableEndY = doc.lastAutoTable.finalY + 15;

  //     // === Section commentaires (si applicable) ===
  //     const itemsWithComments = actifItems.filter(
  //       (item) => item.commentaire && item.commentaire.trim()
  //     );
  //     if (itemsWithComments.length > 0) {
  //       currentY = tableEndY;

  //       doc.setFontSize(11);
  //       doc.setFont("helvetica", "bold");
  //       doc.text("COMMENTAIRES:", 14, currentY);

  //       currentY += 8;
  //       doc.setFontSize(9);
  //       doc.setFont("helvetica", "normal");

  //       itemsWithComments.forEach((item, commentIndex) => {
  //         const commentText = `• ${item.besoin}: ${item.commentaire}`;
  //         const splitComment = doc.splitTextToSize(commentText, pageWidth - 40);
  //         doc.text(splitComment, 20, currentY);
  //         currentY += splitComment.length * 4 + 3;
  //       });

  //       currentY += 10;
  //     } else {
  //       currentY = tableEndY;
  //     }

  //     // === Section des signatures ===
  //     const signatureStartY = Math.max(currentY, pageHeight - 85);

  //     // Vérifier s'il faut une nouvelle page pour les signatures
  //     if (signatureStartY > pageHeight - 80) {
  //       doc.addPage();
  //       currentY = 30;
  //     } else {
  //       currentY = signatureStartY;
  //     }

  //     // Cadre pour les signatures
  //     doc.setDrawColor(41, 115, 178);
  //     doc.setLineWidth(0.5);
  //     doc.rect(14, currentY, pageWidth - 28, 55);

  //     // Titre signatures
  //     doc.setFillColor(41, 115, 178);
  //     doc.rect(14, currentY, pageWidth - 28, 12, "F");
  //     doc.setFontSize(11);
  //     doc.setFont("helvetica", "bold");
  //     doc.setTextColor(255, 255, 255);
  //     doc.text("SIGNATURES ET VALIDATION", pageWidth / 2 - 25, currentY + 8);

  //     doc.setTextColor(0, 0, 0);
  //     doc.setFontSize(9);
  //     doc.setFont("helvetica", "normal");

  //     // Expéditeur (gauche)
  //     doc.text("EXPÉDITEUR", 20, currentY + 20);
  //     doc.text("Nom:", 20, currentY + 27);
  //     doc.line(30, currentY + 27, 85, currentY + 27);
  //     doc.text("Signature:", 20, currentY + 40);
  //     doc.rect(20, currentY + 43, 65, 10);

  //     // Ligne verticale
  //     doc.line(pageWidth / 2, currentY + 15, pageWidth / 2, currentY + 55);

  //     // Réceptionnaire (droite)
  //     const rightX = pageWidth / 2 + 10;
  //     doc.text("RÉCEPTIONNAIRE", rightX, currentY + 20);
  //     doc.text("Nom:", rightX, currentY + 27);
  //     doc.line(rightX + 15, currentY + 27, rightX + 65, currentY + 27);
  //     doc.text("Date réception:", rightX, currentY + 33);
  //     doc.line(rightX + 25, currentY + 33, rightX + 65, currentY + 33);
  //     doc.text("Signature:", rightX, currentY + 40);
  //     doc.rect(rightX, currentY + 43, 65, 10);

  //     // === Pied de page ===
  //     const footerY = pageHeight - 15;
  //     doc.setFontSize(7);
  //     doc.setTextColor(150, 150, 150);
  //     doc.text(
  //       `Document généré automatiquement - SCX Technology - ${actifName}`,
  //       pageWidth / 2,
  //       footerY,
  //       { align: "center" }
  //     );

  //     // Ligne décorative
  //     doc.setDrawColor(41, 115, 178);
  //     doc.setLineWidth(1);
  //     doc.line(14, footerY - 3, pageWidth - 14, footerY - 3);
  //   });

  //   // === Sauvegarder le PDF ===
  //   const today = new Date();
  //   const dateStr = `${today.getFullYear()}${(today.getMonth() + 1)
  //     .toString()
  //     .padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}`;
  //   const fileName = `bons_livraison_par_actif_SCX_${dateStr}.pdf`;
  //   doc.save(fileName);

  //   // Fermer le dialogue
  //   handleClosePdfDialog();
  // };

  const calculateTimeDifference = (startTimestamp, endTimestamp) => {
    const startDate = new Date(startTimestamp);
    const endDate = new Date(endTimestamp);
    const diffInMs = endDate - startDate;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(
      (diffInMs % (1000 * 60 * 60)) / (1000 * 60)
    );
    return `${diffInHours} h ${diffInMinutes} min`;
  };
  // Fonction pour ouvrir le dialog
  const handleClickStatus = async (id, source) => {
    console.log("ID cliqué:", id);
    console.log("Source:", source);

    try {
      let url;
      if (source === "source1") {
        url = `${apiUrl}/api/v1/fournitureRoutes/${id}`;
      } else if (source === "source2") {
        url = `${apiUrl}/api/v1/subtickets/${id}`;
      }

      console.log("URL utilisée :", url);

      const response = await axios.get(url);
      console.log("Données de la réponse:", response.data);

      if (response.data.statusHistory) {
        setStatusHistory(response.data.statusHistory);
      } else {
        setStatusHistory([]);
      }

      setSelectedStatus(response.data.statusHistory);
      setStatusDialogOpen(true);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'historique des statuts :",
        error
      );
    }
  };

  // Fonction pour fermer le dialog
  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
  };

  const fetchFournitures = async () => {
    try {
      // Effectuer les deux requêtes en parallèle
      const [source1Response, source2Response] = await Promise.all([
        axios.get(
          `${apiUrl}/api/v1/fournitureRoutes?isClosed=false&status=!créé`
        ),
        axios.get(`${apiUrl}/api/v1/subtickets?isClosed=false&status=!créé`),
      ]);

      // Mapper les données de la première source
      const source1Data = source1Response.data.fournitures.map((item) => ({
        id: item.id,
        name: item.name,
        region: item.region,
        province: item.province,
        categorie: item.categorie,
        technicien: item.technicien,
        besoin: item.besoin,
        quantite: item.quantite,
        commentaire: item.commentaire,
        dateCreation: new Date(item.dateCreation), // Convertir en objet Date
        status: item.status,
        prix: item.prix,
        tarifLivraison: item.tarifLivraison,
        fournisseur: item.fournisseur,

        source: "source1",
      }));

      console.log("Données source 1 après mapping :", source1Data);

      // Mapper les données de la deuxième source
      const source2Data = source2Response.data.subTickets.map((item) => ({
        id: item._id,
        name: item.site,
        region: item.region,
        province: item.province,
        technicien: item.technicien,
        categorie: item.categorie,
        quantite: item.quantite,
        besoin: item.equipement_deficitaire,
        commentaire: item.description,
        dateCreation: new Date(item.createdAt), // Convertir en objet Date
        status: item.status,
        prix: item.prix,
        tarifLivraison: item.tarifLivraison,
        fournisseur: item.fournisseur,

        source: "source2",
        parentId: item.parentId,
      }));

      console.log("Données source 2 après mapping :", source2Data);

      // Fusionner les deux sources de données
      const combinedData = [...source1Data, ...source2Data];

      // Trier par date de création (ordre décroissant)
      combinedData.sort((a, b) => b.dateCreation - a.dateCreation);

      // Mettre à jour les lignes
      setRows(combinedData);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      setLoading(false);
    }
  };

  // Handle view dialog opening and start timer
  const handleView = (rowIndex) => {
    const rowData = rows[rowIndex];
    setSelectedFourniture(rowData); // Set selected row
    setOpenViewDialog(true); // Open the View dialog
    startTimer(rowData.dateCreation); // Start the countdown timer
  };
  // Start the timer to show elapsed time
  const startTimer = (creationDate) => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const timeDiff = currentTime - new Date(creationDate);
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setTimeElapsed(`${hours}h ${minutes}m ${seconds}s`); // Update elapsed time

      // Optionally stop the timer after a certain period
    }, 1000);

    return () => clearInterval(interval); // Cleanup timer on component unmount
  };
  const handleCloseViewDialog = () => {
    setOpenViewDialog(false); // Close the View dialog
  };

  const handleEdit = (rowIndex) => {
    const rowData = rows[rowIndex];
    setSelectedFourniture(rowData); // Mettre à jour la ligne sélectionnée
    setUpdatedName(rowData.name); // Mettre à jour le formulaire avec les données existantes
    setUpdatedCategorie(rowData.categorie);
    setUpdatedBesoin(rowData.besoin);
    setUpdatedQuantite(rowData.quantite);
    setUpdatedStatus(rowData.status);
    setUpdatedCommentaire(rowData.commentaire);

    setOpenDialog(true); // Ouvrir le dialogue pour modification
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleChange = (event) => {
    setUpdatedStatus(event.target.value);
  };
  const handleUpdateFourniture = async () => {
    try {
      if (selectedFourniture.source === "source2") {
        // Mise à jour pour source2 (utilisation de l'endpoint des sous-tickets)
        const { id: subTicketId } = selectedFourniture; // Récupérer l'ID du sous-ticket

        await axios.patch(
          `${apiUrl}/api/v1/sub-tickets/${subTicketId}`, // URL de mise à jour du sous-ticket
          {
            name: updatedName,
            categorie: updatedCategorie,
            besoin: updatedBesoin,
            quantite: updatedQuantite,
            status: updatedStatus,
            commentaire: updatedCommentaire,
          }
        );

        // Mettre à jour la ligne localement dans l'état après la modification
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === subTicketId
              ? {
                  ...row,
                  name: updatedName,
                  categorie: updatedCategorie,
                  besoin: updatedBesoin,
                  quantite: updatedQuantite,
                  status: updatedStatus,
                  commentaire: updatedCommentaire,
                }
              : row
          )
        );

        alert("Sous-ticket mis à jour avec succès");
      } else if (selectedFourniture.source === "source1") {
        // Mise à jour pour source1 (URL de fournitureRoutes)
        await axios.patch(
          `${apiUrl}/api/v1/fournitureRoutes/${selectedFourniture.id}`,
          {
            name: updatedName,
            categorie: updatedCategorie,
            besoin: updatedBesoin,
            quantite: updatedQuantite,
            status: updatedStatus,
            commentaire: updatedCommentaire,
          }
        );

        // Mettre à jour la ligne localement dans l'état après la modification
        setRows((prevRows) =>
          prevRows.map((row) =>
            row._id === selectedFourniture.id
              ? {
                  ...row,
                  name: updatedName,
                  categorie: updatedCategorie,
                  besoin: updatedBesoin,
                  quantite: updatedQuantite,
                  status: updatedStatus,
                  commentaire: updatedCommentaire,
                }
              : row
          )
        );

        alert("Fourniture mise à jour avec succès");
      }

      setOpenDialog(false); // Fermer le dialogue après la mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la fourniture :", error);
      alert("Erreur lors de la mise à jour de la fourniture");
    }
  };

  const handleClose = async (rowIndex) => {
    const rowData = rows[rowIndex]; // Récupérer les données de la ligne sélectionnée
    console.log("Clôturer :", rowData);

    try {
      const currentDate = new Date(); // Date et heure actuelles
      currentDate.setHours(currentDate.getHours()); // Ajustez si nécessaire

      // Vérifier l'origine de la donnée pour décider de l'API à appeler
      if (rowData.source === "source1") {
        // Clôturer le ticket parent pour "source1"
        const response = await axios.patch(
          `${apiUrl}/api/v1/fournitureRoutes/${rowData.id}`,
          {
            isClosed: true,
            dateCloture: currentDate.toISOString(),
          }
        );

        if (response.status === 200) {
          setRows((prevRows) =>
            prevRows.map((row) =>
              row.id === rowData.id
                ? {
                    ...row,
                    isClosed: true,
                    dateCloture: currentDate.toISOString(),
                  }
                : row
            )
          );
          alert("Fourniture clôturée avec succès");
        }
      } else if (rowData.source === "source2") {
        // Clôturer directement le ticket parent
        const firstPatchResponse = await axios.patch(
          `${apiUrl}/api/v1/ticketMaintenance/${rowData.parentId}`,
          {
            isClosed: true,
            dateCloture: currentDate.toISOString(),
            cloturerPar:
              JSON.parse(localStorage.getItem("userInfo"))?.nomComplet ||
              "Nom inconnu", // Récupère le nomComplet depuis localStorage, ou un nom par défaut
          }
        );

        if (firstPatchResponse.status === 200) {
          // Imprimer le ticket parent dans le console.log
          console.log("Ticket parent clôturé:", firstPatchResponse.data);

          const url = `${apiUrl}/api/actifs/${firstPatchResponse.data.selectedActifId}/categories/${firstPatchResponse.data.selectedCategoryId}/equipments/${firstPatchResponse.data.selectedEquipmentId}`;
          const body = {
            isFunctionel: true, // Exemple de mise à jour du statut
          };

          try {
            // Envoyer la requête PATCH pour mettre à jour l'équipement
            const patchResponse = await axios.put(url, body, {
              headers: {
                "Content-Type": "application/json", // Définir le type de contenu comme JSON
              },
            });

            if (patchResponse.status === 200) {
              console.log("Mise à jour réussie de l'équipement");
            } else {
              console.error("Erreur lors de la mise à jour de l'équipement");
            }
          } catch (error) {
            console.error(
              "Erreur lors de la requête de mise à jour:",
              error.message
            );
          }

          // Clôturer directement le sous-ticket sans vérifier
          const subTicketId = rowData.id; // Supposons que vous avez l'ID du sous-ticket directement dans rowData
          if (subTicketId) {
            try {
              const subTicketResponse = await axios.patch(
                `${apiUrl}/api/v1/sub-tickets/${subTicketId}`,
                {
                  isClosed: true,
                  dateCloture: currentDate.toISOString(),
                }
              );

              if (subTicketResponse.status === 200) {
                console.log(`Sous-ticket ${subTicketId} clôturé avec succès`);
              } else {
                console.error(
                  `Erreur lors de la mise à jour du sous-ticket ${subTicketId}`
                );
              }
            } catch (error) {
              console.error(
                `Erreur lors de la requête pour le sous-ticket ${subTicketId}: ${error.message}`
              );
            }
          }

          // Après avoir fermé le sous-ticket, mettre à jour le ticket parent
          setRows((prevRows) =>
            prevRows.map((row) =>
              row.id === rowData.id
                ? {
                    ...row,
                    isClosed: true,
                    dateCloture: currentDate.toISOString(),
                  }
                : row
            )
          );
          alert("Sous-ticket et ticket parent clôturés avec succès");
        } else {
          console.error("Erreur lors de la clôture du ticket parent");
          alert("Erreur lors de la clôture du ticket parent.");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la clôture de l'élément :", error.message);
      alert(
        "Erreur lors de la clôture de l'élément. Veuillez vérifier votre connexion ou réessayer."
      );
    }
  };

  const handleDelete = async (rowIndex) => {
    const rowData = rows[rowIndex];
    console.log("Données de la ligne avant suppression :", rowData);

    // Vérifiez les données avant la suppression
    if (!rowData || !rowData.id || !rowData.source) {
      // Utilisez 'id' au lieu de '_id'
      alert("Données invalides pour la suppression.");
      console.error(
        "Erreur: Données invalides pour la suppression. rowData:",
        rowData
      );
      return;
    }

    if (window.confirm("Voulez-vous vraiment supprimer cet élément ?")) {
      try {
        if (rowData.source === "source1") {
          // Suppression pour source1
          console.log(`Suppression de fourniture avec ID: ${rowData.id}`);
          const response = await axios.delete(
            `${apiUrl}/api/v1/fournitureRoutes/${rowData.id}` // Utilisez 'id' au lieu de '_id'
          );
          console.log("Réponse après suppression de source1:", response);
          alert("Fourniture supprimée avec succès.");
        } else if (rowData.source === "source2") {
          // Suppression pour source2
          const { parentId, id: subTicketId } = rowData; // Extraction des IDs nécessaires
          if (!parentId || !subTicketId) {
            alert("Parent ID ou Sub-ticket ID manquant.");
            console.error(
              "Erreur: Parent ID ou Sub-ticket ID manquant. rowData:",
              rowData
            );
            return;
          }

          console.log(
            `Suppression du sous-ticket avec Parent ID: ${parentId} et Sub-ticket ID: ${subTicketId}`
          );
          const response = await axios.delete(
            `${apiUrl}/api/v1/ticketMaintenance/tickets/${parentId}/subTickets/${subTicketId}`
          );
          console.log("Réponse après suppression de source2:", response);
          alert("Sous-ticket supprimé avec succès.");
        }

        // Mise à jour de l'état local après suppression
        setRows((prevRows) =>
          prevRows.filter((_, index) => index !== rowIndex)
        );
      } catch (error) {
        console.error("Erreur lors de la suppression de l'élément :", error);
        alert(
          "Erreur lors de la suppression de l'élément. Veuillez réessayer."
        );
      }
    }
  };

  const styles = {
    largeIcon: {
      width: 60,
      height: 60,
    },
  };

  useEffect(() => {
    fetchFournitures();
  }, []);

  const columns = [
    {
      name: "id",
      label: "",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => (
          <div className="flex items-center">
            <Tooltip title="Copier ID">
              <ContentCopy
                sx={{
                  cursor: "pointer",
                  marginLeft: "8px",
                  color: "#2973B2",
                }}
                onClick={() => {
                  navigator.clipboard.writeText(value); // Copier l'ID dans le presse-papiers
                }}
              />
            </Tooltip>
          </div>
        ),
      },
    },
    {
      name: "source", // Nom de la colonne pour la source des données
      label: "Source", // Titre de la colonne
      options: {
        filter: true,
        sort: false, // Si tu ne veux pas trier par la source
        display: "excluded",
        customBodyRender: (value) => {
          // Afficher la source de la donnée
          return value === "source1" ? "Source 1" : "Source 2";
        },
      },
    },
    {
      name: "name",
      label: "Nom",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "region",
      label: "Region",
      options: { filter: true, sort: false, filterType: "checkbox" },
    },
    {
      name: "province",
      label: "Province",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "categorie",
      label: "Catégorie",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "besoin",
      label: "Besoin",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "quantite",
      label: "Quantité",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "technicien",
      label: "créé par",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        sort: false,
        filterType: "dropdown",
        customBodyRender: (value, tableMeta) => {
          const source = tableMeta.rowData.source; // Assurez-vous que 'source' est défini dans vos données
          return (
            <Button
              onClick={() =>
                handleClickStatus(tableMeta.rowData[0], tableMeta.rowData[1])
              }
            >
              {value}
            </Button>
          );
        },
      },
    },
    {
      name: "prix",
      label: "Prix",
      options: {
        filter: true,
        sort: false,
        filterType: "dropdown",
        customBodyRender: (value) => {
          return value !== undefined ? `${value} MAD` : "-";
        },
      },
    },
    {
      name: "tarifLivraison",
      label: "Tarif Livraison",
      options: {
        filter: true,
        sort: false,
        filterType: "dropdown",
        customBodyRender: (value) => {
          return value !== undefined ? `${value} MAD` : "-";
        },
      },
    },
    {
      name: "fournisseur",
      label: "Fournisseur",
      options: {
        filter: true,
        sort: false,
        filterType: "dropdown",
        customBodyRender: (value) => {
          return value !== undefined ? `${value}` : "-";
        },
      },
    },
    {
      name: "commentaire",
      label: "commentaire responsable",
      options: { filter: true, sort: false, filterType: "dropdown" },
    },
    {
      name: "dateCreation",
      label: "Date de création",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => {
          const date = new Date(value);
          return date.toLocaleString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        },
        filterType: "dropdown",
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex; // Obtient l'index de la ligne
          return (
            <div style={{ display: "flex", gap: "1px" }}>
              <IconButton
                title="visualiser "
                onClick={() => handleView(rowIndex)}
                color="primary"
              >
                <Eye style={{ width: "18px", height: "18px" }} />
              </IconButton>
              <IconButton
                title="modifier"
                onClick={() => handleEdit(rowIndex)}
                color="default"
              >
                <Edit style={{ width: "18px", height: "18px" }} />
              </IconButton>
              {/* <IconButton
                title="supprimer "
                onClick={() => handleDelete(rowIndex)}
                color="secondary"
              >
                <Delete style={{ width: "18px", height: "18px" }} />
              </IconButton> */}
              <IconButton
                title="cloturer"
                onClick={async () => await handleClose(rowIndex)} // Wrap handleClose with async/await
                color="success"
              >
                <CheckCircle style={{ width: "18px", height: "18px" }} />
              </IconButton>
            </div>
          );
        },
      },
    },
  ];

  const getMuiTheme = () =>
    createTheme({
      typography: { fontFamily: "sans-serif" },
      palette: {
        background: { paper: "#1E1E1E", default: "#0f172a" },
        mode: "dark",
      },
      components: {
        MuiTableCell: {
          styleOverrides: {
            head: { padding: "10px 4px" },
            body: {
              padding: "7px 15px",
              color: "#e2e8f0",
              textOverflow: "ellipsis",
            },
          },
        },
      },
    });

  const options = {
    filterType: "checkbox",
    selectableRows: "none",

    rowsPerPage: 10,
    rowsPerPageOptions: [10, 50, 70, 100],
    search: true,
    download: true,
    setRowProps: (_, dataIndex) => {
      // Check if the ticket is closed
      const rowData = rows[dataIndex];
      return {
        style: {
          backgroundColor: rowData.isClosed ? "#4CAF50" : "inherit", // Green if closed
        },
      };
    },
  };

  return (
    <>
      <div className="flex justify-end gap-4">
        <Button
          onClick={handleOpenPdfDialog}
          variant="contained"
          color="primary"
        >
          Générer PDF bon de Livraisons
        </Button>
        <Button onClick={handleDownloadExcel} variant="outlined">
          Télécharger Excel
        </Button>
      </div>
      <div className="w-[100%] py-3">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Gestion des commandes"}
            data={rows}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Modifier la fourniture</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nom"
              type="text"
              fullWidth
              variant="standard"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
              disabled
            />
            <TextField
              margin="dense"
              label="Catégorie"
              type="text"
              fullWidth
              variant="standard"
              value={updatedCategorie}
              onChange={(e) => setUpdatedCategorie(e.target.value)}
              disabled
            />
            <TextField
              margin="dense"
              label="Besoin"
              type="text"
              fullWidth
              variant="standard"
              value={updatedBesoin}
              onChange={(e) => setUpdatedBesoin(e.target.value)}
              disabled
            />
            <TextField
              margin="dense"
              label="Quantité"
              type="number"
              fullWidth
              variant="standard"
              value={updatedQuantite}
              onChange={(e) => setUpdatedQuantite(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Commentaire responsable"
              type="text"
              fullWidth
              variant="standard"
              value={updatedCommentaire}
              onChange={(e) => setUpdatedCommentaire(e.target.value)}
              disabled
            />

            <TextField
              margin="dense"
              label="Date de création"
              type="text"
              fullWidth
              variant="standard"
              value={
                selectedFourniture
                  ? new Date(selectedFourniture.dateCreation).toLocaleString(
                      "fr-FR",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }
                    )
                  : ""
              }
              disabled
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={updatedStatus}
                onChange={handleChange}
                label="Status"
                name="status"
              >
                {[
                  "créé",
                  "Ouvert",
                  "En cours",
                  "Achat par le support",
                   "En attendant le déblocage de la caisse",
                  "Reçu par le support",
                  "Expédié",
                  "Demandé aux achats",
                  "Demandé à Biopetra",
                  "Demandé à la pharmacie",
                  "En cours de livraison",
                  "Achat sur place",
                  "Livré",
                ].map((status, index) => (
                  <MenuItem key={index} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}{" "}
                    {/* Capitalize first letter */}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Annuler
            </Button>
            <Button onClick={handleUpdateFourniture} color="primary">
              Mettre à jour
            </Button>
          </DialogActions>
        </Dialog>
        {/* View Dialog */}
        <Dialog open={openViewDialog} onClose={handleCloseViewDialog}>
          <DialogTitle>Voir la fourniture</DialogTitle>
          <DialogContent>
            {selectedFourniture && (
              <>
                <TextField
                  margin="dense"
                  label="Nom"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={selectedFourniture.name}
                  disabled
                />
                <TextField
                  margin="dense"
                  label="Besoin"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={selectedFourniture.besoin}
                  disabled
                />
                <TextField
                  margin="dense"
                  label="Quantité"
                  type="number"
                  fullWidth
                  variant="standard"
                  value={selectedFourniture?.quantite || ""}
                  disabled
                />
                <TextField
                  margin="dense"
                  label="Technicien"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={selectedFourniture?.technicien || ""}
                  disabled
                />{" "}
                <TextField
                  margin="dense"
                  label="Status"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={selectedFourniture?.status || ""}
                  disabled
                />
                <TextField
                  margin="dense"
                  label="Commentaire responsable"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={selectedFourniture?.commentaire || ""}
                  disabled
                />
                <TextField
                  margin="dense"
                  label="Date de création"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={new Date(
                    selectedFourniture.dateCreation
                  ).toLocaleString("fr-FR")}
                  disabled
                />
                <Typography variant="h6" style={{ marginTop: "10px" }}>
                  Temps écoulé : {timeElapsed}
                </Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseViewDialog} color="primary">
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
        {/* Dialog MUI */}
        <Dialog
          open={statusDialogOpen}
          fullWidth
          onClose={handleCloseStatusDialog}
        >
          <DialogTitle>Historique des Statuts</DialogTitle>
          <DialogContent>
            {Array.isArray(statusHistory) && statusHistory.length > 0 ? (
              <>
                <Stepper activeStep={statusHistory.length - 1} alternativeLabel>
                  {statusHistory.map((entry, index) => (
                    <Step key={index}>
                      <StepLabel>
                        {`${entry.status}`}
                        {index > 0 && statusHistory[index - 1].timestamp && (
                          <Typography variant="body2" color="textSecondary">
                            Temps écoulé :{" "}
                            {calculateTimeDifference(
                              statusHistory[index - 1].timestamp,
                              entry.timestamp
                            )}
                          </Typography>
                        )}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {statusHistory.map((entry, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={` ${entry.status}`}
                      secondary={`Date : ${
                        entry.timestamp
                          ? new Date(entry.timestamp).toLocaleString("fr-FR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Date non disponible"
                      }`}
                    />
                  </ListItem>
                ))}
              </>
            ) : (
              <ListItem>
                <ListItemText primary="Aucun historique disponible." />
              </ListItem>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseStatusDialog}>Fermer</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog de génération PDF avec filtre région et filtre nom */}
        <Dialog
          open={openPdfDialog}
          onClose={handleClosePdfDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PictureAsPdfIcon color="primary" />
              <Typography variant="h6">
                Sélectionner les commandes à inclure dans le bon de livraison
              </Typography>
            </div>
            <IconButton onClick={handleClosePdfDialog}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <FormControl fullWidth margin="normal">
              <InputLabel>Filtrer par région</InputLabel>
              <Select
                value={selectedRegion}
                label="Filtrer par région"
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setSelectedActif(""); // reset actif si la région change
                }}
              >
                <MenuItem value="">Toutes les régions</MenuItem>
                {pdfRegions.map((region) => (
                  <MenuItem value={region} key={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Filtrer par actif</InputLabel>
              <Select
                value={selectedActif}
                label="Filtrer par actif"
                onChange={(e) => setSelectedActif(e.target.value)}
              >
                <MenuItem value="">Tous les actifs</MenuItem>
                {pdfActifs.map((name) => (
                  <MenuItem value={name} key={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* ... reste inchangé : sélection, liste, PDF ... */}
            <Divider className="mb-2" />
            {filteredDeliveryRows.length > 0 ? (
              <>
                <div className="flex items-center mb-4">
                  <Checkbox
                    checked={
                      selectedRows.length === filteredDeliveryRows.length &&
                      filteredDeliveryRows.length > 0
                    }
                    onChange={handleSelectAll}
                    color="primary"
                  />
                  <SelectAllIcon className="mr-1 text-gray-600" />
                  <Typography>Sélectionner tout</Typography>
                </div>
                <List>
                  {filteredDeliveryRows.map((row) => (
                    <ListItem
                      key={row.id}
                      dense
                      button
                      onClick={() => handleToggleRow(row.id)}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={selectedRows.includes(row.id)}
                          tabIndex={-1}
                          disableRipple
                          color="primary"
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <span>{`${row.name}: ${row.besoin} || (Quantite: ${row.quantite})`}</span>
                        }
                        secondary={`Région: ${row.region}  Province: ${
                          row.province
                        } | Demandeur: ${row.technicien || "Non spécifié"}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            ) : (
              <Typography>
                Aucune commande avec le statut "En cours de livraison" n'est
                disponible pour les filtres choisis.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClosePdfDialog}
              color="primary"
              startIcon={<CloseIcon />}
            >
              Annuler
            </Button>
            <Button
              onClick={generatePdf}
              color="primary"
              variant="contained"
              startIcon={<PictureAsPdfIcon />}
              disabled={selectedRows.length === 0}
            >
              Générer PDF
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default ListeBesoin;
