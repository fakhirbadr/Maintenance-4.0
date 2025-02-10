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
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { BarChartIcon } from "lucide-react";
import GraphFluxPatient from "./GraphFluxPatient"; // Assure-toi que l'import est correct
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Importez jspdf-autotable pour étendre jsPDF
const apiUrl = import.meta.env.VITE_API_URL;

const regions = {
  "Tanger-Tétouan-Al Hoceïma": [
    "Tanger",
    "Tétouan",
    "Al Hoceïma",
    "Chefchaouen",
    "Larache",
    "Ouezzane",
    "Fahs-Anjra",
  ],
  "L'Oriental": [
    "Oujda-Angad",
    "Nador",
    "Berkane",
    "Driouch",
    "Taourirt",
    "Jerada",
    "Guercif",
    "Figuig",
  ],
  "Fès-Meknès": [
    "Fès",
    "Meknès",
    "Ifrane",
    "Taza",
    "Sefrou",
    "Boulemane",
    "El Hajeb",
    "Moulay Yacoub",
    "Taounate",
  ],
  "Rabat-Salé-Kénitra": [
    "Rabat",
    "Salé",
    "Kénitra",
    "Sidi Kacem",
    "Sidi Slimane",
    "Khémisset",
  ],
  "Béni Mellal-Khénifra": [
    "Béni Mellal",
    "Khénifra",
    "Azilal",
    "Fquih Ben Salah",
    "Kasba Tadla",
  ],
  "Casablanca-Settat": [
    "Casablanca",
    "Mohammedia",
    "Settat",
    "El Jadida",
    "Berrechid",
    "Nouaceur",
    "Médiouna",
    "Sidi Bennour",
    "Benslimane",
  ],
  "Marrakech-Safi": [
    "Marrakech",
    "Safi",
    "El Jadida",
    "Essaouira",
    "Rehamna",
    "Chichaoua",
    "Al Haouz",
    "Youssoufia",
    "El Kelaâ des Sraghna",
  ],
  "Drâa-Tafilalet": ["Errachidia", "Ouarzazate", "Zagora", "Tinghir", "Midelt"],
  "Souss-Massa": [
    "Agadir Ida-Outanane",
    "Taroudant",
    "TATA",
    "Tiznit",
    "Chtouka Aït Baha",
    "Inezgane-Aït Melloul",
  ],
  "Guelmim-Oued Noun": ["Guelmim", "Tan-Tan", "Sidi Ifni", "Assa-Zag"],
  "Laâyoune-Sakia El Hamra": ["Laâyoune", "Boujdour", "Tarfaya", "Es-Semara"],
  "Dakhla-Oued Ed-Dahab": ["Dakhla", "Oued Ed-Dahab", "Aousserd"],
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

  const provinceRegionMap = Object.entries(regions).reduce(
    (acc, [region, provinces]) => {
      provinces.forEach((province) => (acc[province] = region));
      return acc;
    },
    {}
  );

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Titre
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 53, 147); // Couleur bleue
    doc.text("Synthèse Surveillance Réseau & File d'Attente", 14, 20);

    // Boucle pour ajouter les données à partir de structuredData
    let yOffset = 30;
    Object.entries(structuredData).forEach(([region, provinces]) => {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0); // Couleur noire
      doc.text(`Region: ${region}`, 14, yOffset);
      yOffset += 10;

      Object.entries(provinces).forEach(([province, users]) => {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Province: ${province}`, 14, yOffset);
        yOffset += 10;

        Object.entries(users).forEach(([user, horaires]) => {
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text(`Unité: ${user}`, 14, yOffset);
          yOffset += 10;

          // Création d'un tableau pour les horaires
          const headers = [
            "Heure",
            "Download (Mbps)",
            "Upload (Mbps)",
            "Patients en attente",
          ];
          const data = ["10h", "12h", "16h"].map((time) => {
            const { download, upload, patientsWaiting } = horaires[time] || {};
            return [
              time,
              download ? `${download}` : "N/A",
              upload ? `${upload}` : "N/A",
              patientsWaiting ? `${patientsWaiting}` : "N/A",
            ];
          });

          // Ajout du tableau
          doc.autoTable({
            startY: yOffset,
            head: [headers],
            body: data,
            theme: "striped", // Thème du tableau
            headStyles: { fillColor: [40, 53, 147] }, // Couleur d'en-tête
            alternateRowStyles: { fillColor: [245, 245, 245] }, // Couleur des lignes alternées
            margin: { left: 14 }, // Marge gauche
          });

          yOffset = doc.autoTable.previous.finalY + 10; // Ajuster l'offset après le tableau
        });
      });
    });

    // Enregistrement du PDF
    doc.save("Synthese_Surveillance_Réseau.pdf");
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
