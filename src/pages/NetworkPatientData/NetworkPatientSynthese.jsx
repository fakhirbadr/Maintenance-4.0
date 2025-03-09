import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Collapse,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { BarChartIcon } from "lucide-react";
import GraphFluxPatient from "./GraphFluxPatient"; // Assure-toi que l'import est correct
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

import "jspdf-autotable"; // Importez jspdf-autotable pour étendre jsPDF
const apiUrl = import.meta.env.VITE_API_URL;

const regions = {
  "Tanger-Tétouan-Al Hoceïma": [
    "Al Hoceïma",
    "Chefchaouen",
    "Larache",
    "Ouezzane",
  ],
  "L'Oriental": [
    "Oujda-Angad",

    "Driouch",
    "Taourirt",
    "Jerada",
    "Guercif",
    "Figuig",
  ],
  "Fès-Meknès": [
    "Ifrane",
    "Taza",
    "Sefrou",
    "Boulemane",

    "Moulay Yacoub",
    "Taounate",
  ],
  "Rabat-Salé-Kénitra": ["Sidi Kacem", "Khémisset"],
  "Béni Mellal-Khénifra": ["Béni Mellal", "Khénifra", "Azilal"],
  "Casablanca-Settat": ["Settat", "Sidi Bennour"],
  "Marrakech-Safi": [
    "Safi",
    "Essaouira",
    "Rehamna",
    "Chichaoua",
    "Al Haouz",
    "Youssoufia",
    "El Kelaâ des Sraghna",
  ],
  "Drâa-Tafilalet": ["Errachidia", "Ouarzazate", "Zagora", "Tinghir", "Midelt"],
  "Souss-Massa": ["Taroudant", "TATA", "Tiznit"],
};

const NetworkPatientSynthese = () => {
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsedRegions, setCollapsedRegions] = useState(
    Object.keys(regions).reduce((acc, region) => {
      acc[region] = true; // Toutes les régions fermées par défaut
      return acc;
    }, {})
  );
  const [open, setOpen] = useState(false);
  const [structuredData, setStructuredData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("");

  const provinceRegionMap = Object.entries(regions).reduce(
    (acc, [region, provinces]) => {
      provinces.forEach((province) => (acc[province] = region));
      return acc;
    },
    {}
  );

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Configuration du titre
    const title = "Synthèse File d'Attente Patients";
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 53, 147);

    // Calcul de la position X pour centrer le titre
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(title);
    const xCenter = (pageWidth - textWidth) / 2;

    doc.text(title, xCenter, 20);

    let yOffset = 30;

    Object.entries(structuredData).forEach(([region, provinces], index) => {
      if (index > 0) {
        doc.addPage(); // Ajouter une nouvelle page pour chaque région sauf la première
        yOffset = 20; // Réinitialiser yOffset pour la nouvelle page
      }

      // Entête région
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(139, 0, 0);
      const regionText = `Région: ${region}`;
      const textWidthRegion = doc.getTextWidth(regionText);
      const xCenterRegion = (pageWidth - textWidthRegion) / 2;

      doc.text(regionText, xCenterRegion, yOffset);

      doc.setTextColor(156, 27, 51);
      yOffset += 10;

      // Préparation des données
      const leftColumn = []; // Unités avec <10 patients
      const rightColumn = []; // Unités avec >=10 patients

      Object.entries(provinces).forEach(([province, users]) => {
        Object.entries(users).forEach(([user, horaires]) => {
          // Calcul du maximum de patients
          let maxPatients = Math.max(
            ...Object.values(horaires).map((h) => h.patientsWaiting || 0)
          );

          // Tri dans les colonnes
          if (maxPatients >= 10) {
            rightColumn.push({ province, user, horaires, maxPatients });
          } else {
            leftColumn.push({ province, user, horaires, maxPatients });
          }
        });
      });

      // Affichage en deux colonnes côte à côte
      let maxLength = Math.max(leftColumn.length, rightColumn.length); // Nombre maximal d'unités dans les deux colonnes

      for (let i = 0; i < maxLength; i++) {
        let currentY = yOffset;

        // Afficher l'unité de gauche (si elle existe)
        if (leftColumn[i]) {
          const unit = leftColumn[i];
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text(
            `• ${unit.province} - ${unit.user} (Max: ${unit.maxPatients})`,
            14,
            currentY
          );
          currentY += 7;

          const data = Object.entries(unit.horaires).map(([heure, data]) => [
            heure,
            data.patientsWaiting ?? "N/A",
          ]);

          doc.autoTable({
            startY: currentY,
            startX: 14,
            head: [["Heure", "Patients"]],
            body: data,
            theme: "striped",
            margin: { left: 14, top: 2, bottom: 2 },
            tableWidth: 80,
            styles: { fontSize: 8, cellPadding: 1 },
          });
          currentY = doc.autoTable.previous.finalY + 5;
        }

        // Afficher l'unité de droite (si elle existe)
        if (rightColumn[i]) {
          const unit = rightColumn[i];
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text(
            `• ${unit.province} - ${unit.user} (Max: ${unit.maxPatients})`,
            110,
            yOffset
          );
          let rightColumnY = yOffset + 7;

          const data = Object.entries(unit.horaires).map(([heure, data]) => [
            heure,
            data.patientsWaiting ?? "N/A",
          ]);

          doc.autoTable({
            startY: rightColumnY,
            startX: 110,
            head: [["Heure", "Patients"]],
            body: data,
            theme: "striped",
            margin: { left: 110, top: 2, bottom: 2 },
            tableWidth: 80,
            styles: { fontSize: 8, cellPadding: 1 },
          });
          rightColumnY = doc.autoTable.previous.finalY + 5;

          // Synchroniser la hauteur des deux colonnes
          if (rightColumnY > currentY) {
            currentY = rightColumnY;
          }
        }

        // Mettre à jour yOffset pour la prochaine paire d'unités
        yOffset = currentY + 10;
      }
    });

    doc.save("Synthese_File_Attente.pdf");
  };

  const toggleRegion = (regionName) => {
    setCollapsedRegions((prev) => ({
      ...prev,
      [regionName]: !prev[regionName],
    }));
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/v1/testSpeedNetwork`);
        if (!response.ok) throw new Error("Erreur de chargement des données");
        const data = await response.json();

        // Obtenir la date d'aujourd'hui sous format YYYY-MM-DD
        const today = new Date().toISOString().split("T")[0];

        // Filtrer les données pour garder uniquement celles d'aujourd'hui
        const todayData = data.filter(
          (item) => item.date && item.date.split("T")[0] === today
        );

        // Structuration des données par région et province
        const structuredData = todayData.reduce((acc, item) => {
          const region = provinceRegionMap[item.province];
          if (!region) return acc;

          const {
            province,
            user,
            testHoraire,
            download,
            upload,
            patientsWaiting,
          } = item;

          acc[region] = acc[region] || {};
          acc[region][province] = acc[region][province] || {};
          acc[region][province][user] = acc[region][province][user] || {
            "10h": { download: null, upload: null },
            "12h": { download: null, upload: null },
            "16h": { download: null, upload: null },
          };

          if (["10h", "12h", "16h"].includes(testHoraire)) {
            acc[region][province][user][testHoraire] = {
              download,
              upload,
              patientsWaiting,
            };
          }

          return acc;
        }, {});

        const transformedData = [];

        Object.entries(structuredData).forEach(([region, provinces]) => {
          Object.entries(provinces).forEach(([province, users]) => {
            Object.entries(users).forEach(([user, horaires]) => {
              Object.entries(horaires).forEach(([horaire, values]) => {
                transformedData.push({
                  region,
                  province,
                  user,
                  horaire,
                  download: values.download ?? 0,
                  upload: values.upload ?? 0,
                  patientsWaiting: values.patientsWaiting ?? 0,
                });
              });
            });
          });
        });

        console.log(transformedData);

        setStructuredData(structuredData);
        console.log(structuredData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchData = async (period) => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/inactiveUmmc`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      return [];
    }
  };

  const exportToExcel = async (period) => {
    const data = await fetchData(period);

    // Filtrer et transformer les données
    const filteredData = data.map((item) => {
      return {
        date: new Date(item.date).toISOString().split("T")[0], // Format yyyy-mm-jj
        province: item.province, // Conserver uniquement la province
        technicien: item.technicien,
        "Fermé à": item.CloseAt, // Renommer CloseAt
        "Fermé jusqu'à": item.CloseTo, // Renommer CloseTo
        raison: item.raison,
        createdAt: new Date(item.createdAt).toLocaleString("fr-FR", {
          // Format yyyy-mm-dd hh:mm
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });

    // Convertir les données en feuille Excel
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UMMC Inactifs");

    // Générer le fichier Excel
    XLSX.writeFile(workbook, `UMMC_Inactifs_${period}.xlsx`);
  };

  const handleExport = (period) => {
    exportToExcel(period);
    handleClose();
  };

  const renderTable = (provinceData) => (
    <Table size="small" sx={{ mb: 3 }}>
      <TableHead>
        <TableRow>
          <TableCell
            sx={{ fontWeight: 400, bgcolor: "#e7c3c3", color: "black" }}
          >
            Unité
          </TableCell>
          {["10h", "12h", "16h"].map((time) => (
            <TableCell
              key={time}
              sx={{ fontWeight: 400, bgcolor: "#e7c3c3", color: "black" }}
            >
              {time} (↓/↑/Patients)
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(provinceData).map(([user, tests]) => (
          <TableRow key={user} hover>
            <TableCell>{user}</TableCell>
            {["10h", "12h", "16h"].map((time) => (
              <TableCell key={time}>
                {tests[time]?.download
                  ? `${tests[time].download} / ${tests[time].upload} / ${tests[time].patientsWaiting} Patients en attente`
                  : "N/A"}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress size={30} />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" align="center" sx={{ p: 3 }}>
        Erreur: {error}
      </Typography>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mb: 4,
        }}
      >
        {/* Titre */}
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: "1.875rem", md: "2.25rem" },
            fontWeight: "extrabold",
            lineHeight: "none",
            letterSpacing: "tight",
            textTransform: "uppercase",
            color: "#9C1B33",
          }}
        >
          Synthèse Surveillance Réseau & File d'Attente
        </Typography>

        {/* Bouton pour ouvrir le dialogue */}
        <IconButton
          aria-label="graphique"
          sx={{
            color: "#9C1B33",
            "&:hover": { backgroundColor: "rgba(156, 27, 51, 0.1)" },
          }}
          onClick={() => setOpen(true)}
        >
          <BarChartIcon fontSize="large" />
        </IconButton>
        <Button variant="contained" color="primary" onClick={exportToPDF}>
          Exporter en PDF
        </Button>
        <Button variant="contained" color="primary" onClick={handleClick}>
          Exporter les UMMC inactifs
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleExport("Aujourd'hui")}>
            Aujourd'hui
          </MenuItem>
          <MenuItem onClick={() => handleExport("Cette semaine")}>
            Cette semaine
          </MenuItem>
          <MenuItem onClick={() => handleExport("Ce mois")}>Ce mois</MenuItem>
          <MenuItem onClick={() => handleExport("Cette année")}>
            Cette année
          </MenuItem>
        </Menu>
      </Box>

      {/* Composant Dialog séparé */}
      <GraphFluxPatient
        open={open}
        data={structuredData}
        handleClose={() => setOpen(false)}
      />

      {Object.entries(regions).map(([regionName, provinces]) => (
        <Paper
          key={regionName}
          sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 2 }}
        >
          <Box
            onClick={() => toggleRegion(regionName)}
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              pb: 1,
              borderBottom: 1,
              borderColor: "primary.main",
            }}
          >
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {regionName}
            </Typography>
            {collapsedRegions[regionName] ? (
              <ExpandMoreIcon />
            ) : (
              <ExpandLessIcon />
            )}
          </Box>
          <Collapse in={!collapsedRegions[regionName]}>
            {provinces.map((province) => (
              <Box
                key={province}
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "background.paper",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  {province}
                </Typography>
                {structuredData?.[regionName]?.[province] ? (
                  renderTable(structuredData[regionName][province])
                ) : (
                  <Typography color="text.disabled" fontStyle="italic">
                    Aucun test disponible
                  </Typography>
                )}
              </Box>
            ))}
          </Collapse>
        </Paper>
      ))}
    </Container>
  );
};
export default NetworkPatientSynthese;
