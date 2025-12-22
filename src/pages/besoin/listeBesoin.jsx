import React, { useEffect, useState } from "react";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MUIDataTable from "mui-datatables";
import moment from "moment";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { CheckCircle, Edit, Eye } from "lucide-react";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
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
  Box,
  Chip,
} from "@mui/material";
import * as XLSX from "xlsx";
import { ContentCopy } from "@mui/icons-material";

// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const ListeBesoin = () => {
  const handleDownloadExcel = () => {
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
      "Date de Création": new Date(row.dateCreation).toLocaleDateString("fr-FR"),
      "Heure de Création": new Date(row.dateCreation).toLocaleTimeString("fr-FR"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Collaborateurs");
    XLSX.writeFile(workbook, "demande_fourniture.xlsx");
  };

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFourniture, setSelectedFourniture] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedCategorie, setUpdatedCategorie] = useState("");
  const [updatedBesoin, setUpdatedBesoin] = useState("");
  const [updatedQuantite, setUpdatedQuantite] = useState("");
  const [updatedCommentaire, setUpdatedCommentaire] = useState("");

  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [timeElapsed, setTimeElapsed] = useState("");
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusHistory, setStatusHistory] = useState([]);

  const [openPdfDialog, setOpenPdfDialog] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [deliveryRows, setDeliveryRows] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedActif, setSelectedActif] = useState("");

  // Nouveaux états pour la sélection multiple et changement de statut en masse
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [bulkStatusDialogOpen, setBulkStatusDialogOpen] = useState(false);
  const [bulkNewStatus, setBulkNewStatus] = useState("");

  // Fonction pour ouvrir le dialogue de changement de statut en masse
  const handleOpenBulkStatusDialog = () => {
    if (selectedRowIds.length === 0) {
      alert("Veuillez sélectionner au moins une ligne");
      return;
    }
    setBulkStatusDialogOpen(true);
  };

  // Fonction pour fermer le dialogue de changement de statut en masse
  const handleCloseBulkStatusDialog = () => {
    setBulkStatusDialogOpen(false);
    setBulkNewStatus("");
  };

  // Fonction pour mettre à jour le statut des lignes sélectionnées
  const handleBulkStatusUpdate = async () => {
    if (!bulkNewStatus) {
      alert("Veuillez sélectionner un statut");
      return;
    }

    try {
      const updatePromises = selectedRowIds.map(async (rowInfo) => {
        const row = rows.find(r => r.id === rowInfo.id && r.source === rowInfo.source);
        if (!row) return;

        if (row.source === "source1") {
          return axios.patch(`${apiUrl}/api/v1/fournitureRoutes/${row.id}`, {
            status: bulkNewStatus,
          });
        } else if (row.source === "source2") {
          return axios.patch(`${apiUrl}/api/v1/sub-tickets/${row.id}`, {
            status: bulkNewStatus,
          });
        }
      });

      await Promise.all(updatePromises);
      
      // Mettre à jour l'état local
      setRows(prevRows => 
        prevRows.map(row => {
          const isSelected = selectedRowIds.some(selected => 
            selected.id === row.id && selected.source === row.source
          );
          if (isSelected) {
            return { ...row, status: bulkNewStatus };
          }
          return row;
        })
      );

      alert(`Statut mis à jour pour ${selectedRowIds.length} élément(s)`);
      handleCloseBulkStatusDialog();
      setSelectedRowIds([]);
    } catch (error) {
      console.error("Erreur lors de la mise à jour en masse :", error);
      alert("Erreur lors de la mise à jour des statuts");
    }
  };

  // CORRECTION : Fonction pour gérer la sélection des lignes dans la table
  const handleRowSelection = (currentRowsSelected, allRowsSelected, rowsSelected) => {
    try {
      if (!rows || rows.length === 0) {
        setSelectedRowIds([]);
        return;
      }

      const selectedIds = allRowsSelected
        .map(selection => {
          if (selection.dataIndex >= 0 && selection.dataIndex < rows.length) {
            const rowData = rows[selection.dataIndex];
            if (rowData && rowData.id && rowData.source) {
              return { id: rowData.id, source: rowData.source };
            }
          }
          return null;
        })
        .filter(item => item !== null);

      setSelectedRowIds(selectedIds);
    } catch (error) {
      console.error("Erreur dans handleRowSelection:", error);
      setSelectedRowIds([]);
    }
  };

  const handleOpenPdfDialog = () => {
    const filteredRows = rows.filter((row) => row.status === "Expédié");
    setDeliveryRows(filteredRows);
    setSelectedRows([]);
    setOpenPdfDialog(true);
  };

  const handleClosePdfDialog = () => {
    setOpenPdfDialog(false);
    setSelectedRows([]);
  };

  const handleToggleRow = (rowId) => {
    setSelectedRows((prev) => {
      if (prev.includes(rowId)) {
        return prev.filter((id) => id !== rowId);
      } else {
        return [...prev, rowId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.length === deliveryRows.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(deliveryRows.map((row) => row.id));
    }
  };

  const pdfActifs = Array.from(
    new Set(
      deliveryRows
        .filter((row) => !selectedRegion || row.region === selectedRegion)
        .map((row) => row.name)
    )
  ).filter(Boolean);

  const pdfRegions = Array.from(
    new Set(deliveryRows.map((r) => r.region))
  ).filter(Boolean);

  const filteredDeliveryRows = deliveryRows.filter((row) => {
    const regionMatch = selectedRegion ? row.region === selectedRegion : true;
    const actifMatch = selectedActif ? row.name === selectedActif : true;
    return regionMatch && actifMatch;
  });

  const generatePdf = () => {
    const doc = new jsPDF();

    try {
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

    const selectedItems = deliveryRows.filter((row) =>
      selectedRows.includes(row.id)
    );

    const groupedByActif = selectedItems.reduce((acc, item) => {
      const actifName = item.name || "Actif non défini";
      if (!acc[actifName]) {
        acc[actifName] = [];
      }
      acc[actifName].push(item);
      return acc;
    }, {});

    const actifNames = Object.keys(groupedByActif);

    const createHeader = (pageNumber, actifName) => {
      let currentY = 20;

      if (logoData) {
        const logoWidth = 40;
        const logoHeight = 20;
        const logoX = (pageWidth - logoWidth) / 2;
        doc.addImage(logoData, "PNG", logoX, currentY, logoWidth, logoHeight);
        currentY += 35;
      }

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

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setFillColor(240, 248, 255);
      doc.rect(14, currentY, pageWidth - 28, 15, "F");

      doc.setTextColor(41, 115, 178);
      const actifTitle = `SITE/ACTIF: ${actifName.toUpperCase()}`;
      const actifTitleWidth = doc.getTextWidth(actifTitle);
      const actifTitleX = (pageWidth - actifTitleWidth) / 2;
      doc.text(actifTitle, actifTitleX, currentY + 10);

      currentY += 25;

      doc.setDrawColor(41, 115, 178);
      doc.setLineWidth(0.5);
      doc.line(14, currentY, pageWidth - 14, currentY);

      return currentY + 10;
    };

    actifNames.forEach((actifName, index) => {
      if (index > 0) {
        doc.addPage();
      }

      let currentY = createHeader(index + 1, actifName);
      const actifItems = groupedByActif[actifName];

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
        item.unite || "Pce",
        item.technicien || "N/A",
        new Date(item.dateCreation).toLocaleDateString("fr-FR"),
      ]);

      doc.autoTable({
        head: headers,
        body: data,
        startY: currentY,
        theme: "grid",
        styles: {
          fontSize: 7,
          cellPadding: 3,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [41, 115, 178],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
          fontSize: 8,
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250],
        },
        columnStyles: {
          0: { halign: "center", cellWidth: 12 },
          1: { cellWidth: 25 },
          2: { cellWidth: 45 },
          3: { halign: "center", cellWidth: 18 },
          4: { halign: "center", cellWidth: 15 },
          5: { cellWidth: 35 },
          6: { halign: "center", cellWidth: 25 },
        },
        margin: { left: 14, right: 14 },
      });

      const tableEndY = doc.lastAutoTable.finalY + 10;
      const signatureStartY = Math.max(tableEndY + 10, pageHeight - 70);

      if (signatureStartY > pageHeight - 65) {
        doc.addPage();
        currentY = 30;
      } else {
        currentY = signatureStartY;
      }

      doc.setDrawColor(41, 115, 178);
      doc.setLineWidth(0.5);
      doc.rect(14, currentY, pageWidth - 28, 45);

      doc.setFillColor(41, 115, 178);
      doc.rect(14, currentY, pageWidth - 28, 10, "F");
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("SIGNATURES ET VALIDATION", pageWidth / 2 - 22, currentY + 6);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");

      doc.text("EXPÉDITEUR", 20, currentY + 16);
      doc.text("Nom:", 20, currentY + 22);
      doc.line(30, currentY + 22, 85, currentY + 22);
      doc.text("Signature:", 20, currentY + 32);
      doc.rect(20, currentY + 35, 65, 8);

      doc.line(pageWidth / 2, currentY + 12, pageWidth / 2, currentY + 45);

      const rightX = pageWidth / 2 + 10;
      doc.text("RÉCEPTIONNAIRE", rightX, currentY + 16);
      doc.text("Nom:", rightX, currentY + 22);
      doc.text("Date réception:", rightX, currentY + 27);
      doc.line(rightX + 25, currentY + 27, rightX + 65, currentY + 27);
      doc.text("Signature:", rightX, currentY + 32);
      doc.rect(rightX, currentY + 35, 65, 8);

      const footerY = pageHeight - 10;
      doc.setFontSize(6);
      doc.setTextColor(150, 150, 150);
      doc.text(`Document généré automatiquement`, pageWidth / 2, footerY, {
        align: "center",
      });

      doc.setDrawColor(41, 115, 178);
      doc.setLineWidth(0.5);
      doc.line(14, footerY - 3, pageWidth - 14, footerY - 3);
    });

    const today = new Date();
    const dateStr = `${today.getFullYear()}${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}`;
    const fileName = `bons_livraison_par_actif_SCX_${dateStr}.pdf`;
    doc.save(fileName);

    handleClosePdfDialog();
  };

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

  const handleClickStatus = async (id, source) => {
    try {
      let url;
      if (source === "source1") {
        url = `${apiUrl}/api/v1/fournitureRoutes/${id}`;
      } else if (source === "source2") {
        url = `${apiUrl}/api/v1/subtickets/${id}`;
      }

      const response = await axios.get(url);

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

  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
  };

  const fetchFournitures = async () => {
    try {
      const [source1Response, source2Response] = await Promise.all([
        axios.get(
          `${apiUrl}/api/v1/fournitureRoutes?isClosed=false&status=!créé`
        ),
        axios.get(`${apiUrl}/api/v1/subtickets?isClosed=false&status=!créé`),
      ]);

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
        dateCreation: new Date(item.dateCreation),
        status: item.status,
        prix: item.prix,
        tarifLivraison: item.tarifLivraison,
        fournisseur: item.fournisseur,
        source: "source1",
      }));

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
        dateCreation: new Date(item.createdAt),
        status: item.status,
        prix: item.prix,
        tarifLivraison: item.tarifLivraison,
        fournisseur: item.fournisseur,
        source: "source2",
        parentId: item.parentId,
      }));

      const combinedData = [...source1Data, ...source2Data];
      combinedData.sort((a, b) => b.dateCreation - a.dateCreation);

      setRows(combinedData);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      setLoading(false);
    }
  };

  const handleView = (rowIndex) => {
    if (rowIndex >= 0 && rowIndex < rows.length) {
      const rowData = rows[rowIndex];
      setSelectedFourniture(rowData);
      setOpenViewDialog(true);
      startTimer(rowData.dateCreation);
    }
  };

  const startTimer = (creationDate) => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const timeDiff = currentTime - new Date(creationDate);
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setTimeElapsed(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
  };

  const handleEdit = (rowIndex) => {
    if (rowIndex >= 0 && rowIndex < rows.length) {
      const rowData = rows[rowIndex];
      setSelectedFourniture(rowData);
      setUpdatedName(rowData.name);
      setUpdatedCategorie(rowData.categorie);
      setUpdatedBesoin(rowData.besoin);
      setUpdatedQuantite(rowData.quantite);
      setUpdatedStatus(rowData.status);
      setUpdatedCommentaire(rowData.commentaire);
      setOpenDialog(true);
    }
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
        const { id: subTicketId } = selectedFourniture;

        const token = localStorage.getItem("authToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        await axios.patch(
          `${apiUrl}/api/v1/sub-tickets/${subTicketId}`,
          {
            name: updatedName,
            categorie: updatedCategorie,
            besoin: updatedBesoin,
            quantite: updatedQuantite,
            status: updatedStatus,
            commentaire: updatedCommentaire,
          },
          { headers }
        );

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
        const token2 = localStorage.getItem("authToken");
        const headers2 = token2 ? { Authorization: `Bearer ${token2}` } : {};
        await axios.patch(
          `${apiUrl}/api/v1/fournitureRoutes/${selectedFourniture.id}`,
          {
            name: updatedName,
            categorie: updatedCategorie,
            besoin: updatedBesoin,
            quantite: updatedQuantite,
            status: updatedStatus,
            commentaire: updatedCommentaire,
          },
          { headers: headers2 }
        );

        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedFourniture.id
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

      setOpenDialog(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la fourniture :", error);
      alert("Erreur lors de la mise à jour de la fourniture");
    }
  };

  const handleClose = async (rowIndex) => {
    if (rowIndex >= 0 && rowIndex < rows.length) {
      const rowData = rows[rowIndex];

      try {
        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours());

        if (rowData.source === "source1") {
          const token3 = localStorage.getItem("authToken");
          const headers3 = token3 ? { Authorization: `Bearer ${token3}` } : {};
          const response = await axios.patch(
            `${apiUrl}/api/v1/fournitureRoutes/${rowData.id}`,
            {
              isClosed: true,
              dateCloture: currentDate.toISOString(),
            },
            { headers: headers3 }
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
          const token4 = localStorage.getItem("authToken");
          const headers4 = token4 ? { Authorization: `Bearer ${token4}` } : {};
          const firstPatchResponse = await axios.patch(
            `${apiUrl}/api/v1/ticketMaintenance/${rowData.parentId}`,
            {
              isClosed: true,
              dateCloture: currentDate.toISOString(),
              cloturerPar:
                JSON.parse(localStorage.getItem("userInfo"))?.nomComplet ||
                "Nom inconnu",
            },
            { headers: headers4 }
          );

          if (firstPatchResponse.status === 200) {
            const url = `${apiUrl}/api/actifs/${firstPatchResponse.data.selectedActifId}/categories/${firstPatchResponse.data.selectedCategoryId}/equipments/${firstPatchResponse.data.selectedEquipmentId}`;
            const body = {
              isFunctionel: true,
            };

            try {
              await axios.put(url, body, {
                headers: {
                  "Content-Type": "application/json",
                },
              });
            } catch (error) {
              console.error("Erreur lors de la requête de mise à jour:", error.message);
            }

            const subTicketId = rowData.id;
            if (subTicketId) {
              try {
                await axios.patch(
                  `${apiUrl}/api/v1/sub-tickets/${subTicketId}`,
                  {
                    isClosed: true,
                    dateCloture: currentDate.toISOString(),
                  }
                );
              } catch (error) {
                console.error(`Erreur lors de la requête pour le sous-ticket ${subTicketId}: ${error.message}`);
              }
            }

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
            alert("Erreur lors de la clôture du ticket parent.");
          }
        }
      } catch (error) {
        console.error("Erreur lors de la clôture de l'élément :", error.message);
        alert("Erreur lors de la clôture de l'élément. Veuillez vérifier votre connexion ou réessayer.");
      }
    }
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
        display: false,
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
                  navigator.clipboard.writeText(value);
                }}
              />
            </Tooltip>
          </div>
        ),
      },
    },
    {
      name: "source",
      label: "Source",
      options: {
        filter: true,
        sort: false,
        display: "excluded",
        customBodyRender: (value) => {
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
          const rowIndex = tableMeta.rowIndex;
          const rowData = rows[rowIndex];
          return (
            <Button
              onClick={() => handleClickStatus(rowData.id, rowData.source)}
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
      name: "fournnotisseur",
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
          const rowIndex = tableMeta.rowIndex;
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
              <IconButton
                title="cloturer"
                onClick={async () => await handleClose(rowIndex)}
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
    selectableRows: 'multiple',
    onRowSelectionChange: handleRowSelection,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 50, 70, 100],
    search: true,
    download: false,
    setRowProps: (_, dataIndex) => {
      const rowData = rows[dataIndex];
      return {
        style: {
          backgroundColor: rowData && rowData.isClosed ? "#4CAF50" : "inherit",
        },
      };
    },
  };

  return (
    <>
      <div className="flex justify-end gap-4 mb-4">
        {selectedRowIds.length > 0 && (
          <Button
            onClick={handleOpenBulkStatusDialog}
            variant="contained"
            color="secondary"
            startIcon={<Edit />}
          >
            Changer statut ({selectedRowIds.length} sélectionné(s))
          </Button>
        )}
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

      {selectedRowIds.length > 0 && (
        <Box className="mb-4 p-2 bg-gray-800 dark:bg-blue-900 rounded">
          <Typography variant="body1" className="flex items-center gap-2">
            <Chip 
              label={selectedRowIds.length} 
              color="primary" 
              size="small" 
            />
            élément(s) sélectionné(s)
          </Typography>
        </Box>
      )}

      <div className="w-[100%] py-3">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Gestion des commandes"}
            data={rows}
            columns={columns}
            options={options}
          />
        </ThemeProvider>

        <Dialog 
          open={bulkStatusDialogOpen} 
          onClose={handleCloseBulkStatusDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Changer le statut pour {selectedRowIds.length} élément(s)
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Nouveau statut</InputLabel>
              <Select
                value={bulkNewStatus}
                onChange={(e) => setBulkNewStatus(e.target.value)}
                label="Nouveau statut"
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
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body2" color="textSecondary" className="mt-2">
              Cette action mettra à jour le statut des {selectedRowIds.length} élément(s) sélectionné(s).
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseBulkStatusDialog} color="primary">
              Annuler
            </Button>
            <Button onClick={handleBulkStatusUpdate} color="primary" variant="contained">
              Mettre à jour
            </Button>
          </DialogActions>
        </Dialog>

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
                  ? new Date(selectedFourniture.dateCreation).toLocaleString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
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
                    {status.charAt(0).toUpperCase() + status.slice(1)}
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
                />
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
                  setSelectedActif("");
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
                Aucune commande avec le statut "Expédié" n'est disponible pour les filtres choisis.
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