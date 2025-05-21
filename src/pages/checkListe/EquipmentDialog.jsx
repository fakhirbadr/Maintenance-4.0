import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Paper,
  Typography,
  Divider,
  Box,
  useTheme,
} from "@mui/material";
import { CheckCircle, Cancel, PictureAsPdf } from "@mui/icons-material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const categories = {
  electrical: [
    "Ecran tactile 32 pouces ( BOX 1 )",
    "Ecran tactile 32 pouces ( BOX 2 )",
    "Mini-ordinateur ( BOX 1 )",
    "Mini-ordinateur ( BOX 2 )",
    "Ordinateur portable ( BOX 1 )",
    "Ordinateur portable ( BOX 2 )",
    "Tablette",
    "Haut-parleur multimédia ( BOX 1 )",
    "Haut-parleur multimédia ( BOX 2 )",
    "Caméra web ( BOX 1 )",
    "Caméra web ( BOX 2 )",
    "Interrupteur ( BOX 1 )",
    "Interrupteur ( BOX 2 )",
    "Climatiseur ( BOX 1 )",
    "Climatiseur ( BOX 2 )",
    "Chauffe-eau électrique",
    "Réfrigérateur",
    "Switch",
    "Caméra de vidéosurveillance ( BOX 1 )",
    "Caméra de vidéosurveillance ( BOX 2 )",
    "Routeur 4G",
    "NVR",
    "Clavier Logitech ( BOX 1 )",
    "Clavier Logitech ( BOX 2 )",
    "Prise réseau RJ45 ( BOX 1 )",
    "Prise réseau RJ45 ( BOX 2 )",
    "Rallonge",
  ],
  medical: [
    "Boitier Mediot ( BOX 1 )",
    "Boitier Mediot ( BOX 2 )",
    "Doclick",
    "Hub USB alimenté ( BOX 1 )",
    "Hub USB alimenté ( BOX 2 )",
    "Tensiomètre ( BOX 1 )",
    "Tensiomètre ( BOX 2 )",
    "Oxymètre ( BOX 1 )",
    "Oxymètre ( BOX 2 )",
    "ECG ( BOX 1 )",
    "ECG ( BOX 2 )",
    "Irisscope ( BOX 1 )",
    "Irisscope ( BOX 2 )",
    "Dermoscope ( BOX 1 )",
    "Dermoscope ( BOX 2 )",
    "Echographe",
    "Otoscope ( BOX 1 )",
    "Otoscope ( BOX 2 )",
    "Caméra mobile ( BOX 1 )",
    "Caméra mobile ( BOX 2 )",
    "Stéthoscope ( BOX 1 )",
    "Stéthoscope ( BOX 2 )",
    "Glucomètre ( BOX 1 )",
    "Glucomètre ( BOX 2 )",
    "Thermomètre ( BOX 1 )",
    "Thermomètre ( BOX 2 )",
    "Balance ( BOX 1 )",
    "Balance ( BOX 2 )",
    "Toise ( BOX 1 )",
    "Toise ( BOX 2 )",
    "Fauteuil médical ( BOX 1 )",
    "Fauteuil médical ( BOX 2 )",
  ],
  cabling: [
    "Câble HDMI ( BOX 1 )",
    "Câble HDMI ( BOX 2 )",
    "Câble UTP (Ethernet ) ( BOX 1 )",
    "Câble UTP (Ethernet) ( BOX 2 )",
    "Câble tactile ( BOX 1 )",
    "Câble tactile ( BOX 2 )",
    "Câble USB ( BOX 1 )",
    "Câble USB ( BOX 2 )",
    "Câble jack Mâle-Mâle ( BOX 1 )",
    "Câble jack Mâle-Mâle ( BOX 2 )",
  ],
  stock_management: [
    "Chariot métallique ( BOX 1 )",
    "Chariot métallique ( BOX 2 )",
    "Armoire",
    "Ciseau ( BOX 1 )",
    "Ciseau ( BOX 2 )",
    "Haricot ( BOX 1 )",
    "Haricot ( BOX 2 )",
    "Escabeau ( BOX 1 )",
    "Escabeau ( BOX 2 )",
    "Table ( BOX 1 )",
    "Table ( BOX 2 )",
    "Tabouret ( BOX 1 )",
    "Tabouret ( BOX 2 )",
    "Poubelle jaune ( BOX 1 )",
    "Poubelle jaune ( BOX 2 )",
    "Poubelle grise ( BOX 1 )",
    "Poubelle grise ( BOX 2 )",
    "Poubelle 120 L ",
    "Portrait",
    "Canapé",
  ],
  installation_material: [
    "Pergola montée en 2 parties ( BOX 1 )",
    "Pergola montée en 2 parties ( BOX 2 )",
    "Bâche avec structure",
    "Bâche beige",
    "banc",
    "Pot",
    "Gazon artificielle",
    "Extincteur CO2",
    "Extincteur liquide",
    "Plot",
    "Plaque d'Etain",
    "Morceau d'Alucobond",
    "Groupe électrogène",
    "Piquet terre",
    "Projecteur",
  ],
};

const getCategory = (name) => {
  for (const [category, items] of Object.entries(categories)) {
    if (items.includes(name)) {
      return category;
    }
  }
  return "Autre";
};

const generatePDF = (equipmentData) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();
  const title = "Rapport d'état des équipements";
  const groupedEquipment = (equipmentData || []).reduce((acc, equipment) => {
    const category = getCategory(equipment.name);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(equipment);
    return acc;
  }, {});

  // Add title and date
  doc.setFontSize(18);
  doc.text(title, 105, 15, { align: "center" });
  doc.setFontSize(12);
  doc.text(`Date: ${date}`, 105, 22, { align: "center" });

  let yPosition = 40;

  Object.entries(groupedEquipment).forEach(([category, items]) => {
    // Add category title
    doc.setFontSize(14);
    doc.text(
      category.charAt(0).toUpperCase() + category.slice(1).replace("_", " "),
      14,
      yPosition
    );
    yPosition += 10;

    // Prepare table data
    const tableData = items.map((item) => [
      item.name,
      item.quantite,
      item.fonctionnel === "Oui" ? "Fonctionnel" : "Défectueux",
    ]);

    // Add table
    doc.autoTable({
      startY: yPosition,
      head: [["Équipement", "Quantité", "Statut"]],
      body: tableData,
      margin: { left: 10 },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [33, 150, 243] },
    });

    yPosition = doc.lastAutoTable.finalY + 10;

    // Add new page if needed
    if (yPosition > 280) {
      doc.addPage();
      yPosition = 20;
    }
  });

  // Add summary
  const functionalCount = equipmentData.filter(
    (item) => item.fonctionnel === "Oui"
  ).length;
  const defectiveCount = equipmentData.length - functionalCount;

  doc.setFontSize(14);
  doc.text("Résumé", 105, yPosition, { align: "center" });
  yPosition += 10;

  doc.setFontSize(12);
  doc.text(`Total d'équipements: ${equipmentData.length}`, 105, yPosition, {
    align: "center",
  });
  yPosition += 7;
  doc.text(`Fonctionnels: ${functionalCount}`, 105, yPosition, {
    align: "center",
  });
  yPosition += 7;
  doc.text(`Défectueux: ${defectiveCount}`, 105, yPosition, {
    align: "center",
  });

  doc.save(`rapport-equipements_${date.replace(/\//g, "-")}.pdf`);
};

const EquipmentDialog = ({ open, onClose, equipmentData }) => {
  const theme = useTheme();

  const isFunctional = (value) => value === "Oui";

  const groupedEquipment = (equipmentData || []).reduce((acc, equipment) => {
    const category = getCategory(equipment.name);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(equipment);
    return acc;
  }, {});

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: "white" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Détails des équipements</Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PictureAsPdf />}
            onClick={() => generatePDF(equipmentData)}
            sx={{ color: "white" }}
          >
            Exporter PDF
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {equipmentData && equipmentData.length > 0 ? (
          Object.entries(groupedEquipment).map(([category, items]) => (
            <Box key={category} mb={4}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  textTransform: "capitalize",
                  color: theme.palette.primary.main,
                  mb: 2,
                }}
              >
                {category}
              </Typography>
              <Grid container spacing={2}>
                {items.map((equipment, index) => {
                  const functional = isFunctional(equipment.fonctionnel);

                  return (
                    <Grid item xs={12} sm={6} key={index}>
                      <Paper
                        elevation={3}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          borderLeft: `4px solid ${
                            functional
                              ? theme.palette.success.main
                              : theme.palette.error.main
                          }`,
                        }}
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="subtitle1" fontWeight="bold">
                            {equipment.name}
                          </Typography>
                          {functional ? (
                            <CheckCircle color="success" />
                          ) : (
                            <Cancel color="error" />
                          )}
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          mt={1}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Quantité:
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {equipment.quantite}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Statut:
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color={
                              functional
                                ? theme.palette.success.main
                                : theme.palette.error.main
                            }
                          >
                            {functional ? "Fonctionnel" : "Défectueux"}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          ))
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100px"
          >
            <Typography variant="body1" color="text.secondary">
              Aucun équipement disponible pour cette entrée.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2 }}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EquipmentDialog;
