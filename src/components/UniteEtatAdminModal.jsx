import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  useMediaQuery,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditPointageModal from "./EditPointageModal";
import UniteEtatModal from "./UniteEtatModal";
import * as XLSX from 'xlsx';

// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;
const columns = [
  { id: "customId", label: "ID" },
  { id: "site", label: "site" },
  { id: "actif", label: "État" },
  { id: "region", label: "Région" },
  { id: "province", label: "Province" },
  { id: "user", label: "Utilisateur" },
  { id: "heureDebut", label: "Début" },
  { id: "medcinPresent", label: "Médecin" },
  { id: "infirmiere1Present", label: "Inf. 1" },
  { id: "infirmiere2Present", label: "Inf. 2" },
  { id: "motifInactivite", label: "Motif Inactivité" },
  { id: "heureInactivite", label: "Début Inactivité" },
  { id: "heureOuvertureEstimee", label: "Heure Ouverture Est." },
  { id: "siteActif", label: "Site Actif" },
];

function formatBool(val) {
  if (val === true) return "Oui";
  if (val === false) return "Non";
  return "";
}

function formatDate(val) {
  if (!val) return "";
  return new Date(val).toLocaleString("fr-FR");
}

function groupByDay(pointages) {
  return pointages.reduce((acc, ptg) => {
    const dateStr = ptg.dateRequest
      ? new Date(ptg.dateRequest).toLocaleDateString("fr-FR")
      : "Date inconnue";
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(ptg);
    return acc;
  }, {});
}

function groupByRegion(pointages) {
  return pointages.reduce((acc, ptg) => {
    const region = ptg.region || "Région inconnue";
    if (!acc[region]) acc[region] = [];
    acc[region].push(ptg);
    return acc;
  }, {});
}

function getUnitesSansPointage(unites, pointagesDuJour) {
  const pointageUniteNames = new Set(pointagesDuJour.map((p) => p.site));
  const grouped = {};
  for (const unite of unites) {
    if (!grouped[unite.region]) grouped[unite.region] = [];
    if (!pointageUniteNames.has(unite.name)) {
      grouped[unite.region].push(unite);
    }
  }
  return grouped;
}

const UniteEtatAdminModal = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [pointages, setPointages] = useState([]);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPointage, setSelectedPointage] = useState(null);
  const [sendingMail, setSendingMail] = useState(false);
  const [sendingBoth, setSendingBoth] = useState(false);
  const [sendMailMsg, setSendMailMsg] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [unites, setUnites] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        const obj = JSON.parse(userInfo);
        setUserRole(obj.role || "");
        setUserEmail(obj.email || "");
      }
    } catch (e) {
      setUserRole("");
      setUserEmail("");
    }
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch(`${apiUrl}/api/v1/pointage`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement");
        let data = await res.json();
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        data = data.filter((p) => {
          if (!p.createdAt) return false;
          const d = new Date(p.createdAt);
          return d >= thirtyDaysAgo && d <= now;
        });
        setPointages(Array.isArray(data) ? data : [data]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  const fetchUnites = () => {
    fetch(`${apiUrl}/api/actifs/nameRegionProvince`)
      .then((res) => res.json())
      .then((data) => setUnites(Array.isArray(data) ? data : [data]))
      .catch(() => setUnites([]));
  };

  useEffect(() => {
    if (open) {
      fetchData();
      fetchUnites();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const grouped = groupByDay(pointages);
  const days = Object.keys(grouped);

  useEffect(() => {
    if (days.length > 0 && !selectedDay) {
      setSelectedDay(days[0]);
    }
  }, [days, selectedDay]);

  const handleEditClick = (row) => {
    setSelectedPointage(row);
    setEditModalOpen(true);
  };

  const handleAdminEditClick = () => {
    setAdminModalOpen(true);
  };

  const handleAdminModalClose = () => {
    setAdminModalOpen(false);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedPointage(null);
  };

  const handleEditSave = async (form) => {
    try {
      if (!form.customId) throw new Error("ID manquant pour la mise à jour");
      const res = await fetch(`${apiUrl}/api/v1/pointage/${form.customId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      setEditModalOpen(false);
      setSelectedPointage(null);
      fetchData();
    } catch (e) {
      alert(e.message);
    }
  };

  const sendRecapEmail = async () => {
    setSendingMail(true);
    setSendMailMsg("");
    try {
      if (!selectedDay) {
        setSendMailMsg("Aucun jour sélectionné.");
        setSendingMail(false);
        return;
      }
      const [d, m, y] = selectedDay.split("/");
      const dayStr = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      const res = await fetch(`${apiUrl}/api/v1/pointage/send-daily-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dayStr }),
      });
      const data = await res.json();
      if (res.ok) {
        setSendMailMsg("Email envoyé avec succès !");
      } else {
        setSendMailMsg(data.message || "Erreur lors de l'envoi.");
      }
    } catch (e) {
      setSendMailMsg("Erreur lors de l'envoi.");
    }
    setSendingMail(false);
  };

  const sendBothReports = async () => {
    setSendingBoth(true);
    setSendMailMsg("");
    try {
      if (!selectedDay) {
        setSendMailMsg("Aucun jour sélectionné.");
        setSendingBoth(false);
        return;
      }
      const [d, m, y] = selectedDay.split("/");
      const dayStr = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      const responses = await Promise.allSettled([
        fetch(`${apiUrl}/api/v1/pointage/send-daily-report`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: dayStr }),
        }),
        fetch(`${apiUrl}/api/v1/pointage/send-inactives-report`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: dayStr }),
        }),
      ]);
      const results = [];
      for (let i = 0; i < responses.length; i++) {
        const name = i === 0 ? "Quotidien" : "Inactifs";
        const response = responses[i];
        if (response.status === "rejected") {
          results.push(`${name}: Erreur réseau - ${response.reason.message}`);
          continue;
        }
        const res = response.value;
        try {
          const text = await res.text();
          if (
            text.trim().startsWith("<!DOCTYPE html>") ||
            text.includes("<html>") ||
            text.includes("<head>")
          ) {
            results.push(`${name}: Erreur serveur (500)`);
            continue;
          }
          try {
            const data = JSON.parse(text);
            if (res.ok) {
              results.push(`${name}: Succès`);
            } else {
              const errorMsg = data.message || data.error || res.statusText;
              results.push(`${name}: ${errorMsg}`);
            }
          } catch (e) {
            results.push(
              `${name}: Réponse invalide - ${text.substring(0, 50)}`
            );
          }
        } catch (e) {
          results.push(`${name}: Erreur de lecture - ${e.message}`);
        }
      }
      setSendMailMsg(results.join(" | "));
    } catch (e) {
      setSendMailMsg("Erreur inattendue: " + e.message);
    } finally {
      setSendingBoth(false);
    }
  };

  const exportAbsencesToExcel = () => {
    if (!selectedDay) {
      alert("Veuillez sélectionner une date");
      return;
    }
  
    const presenceData = [];
    
    // Traiter les pointages existants (exclure les unités ULC)
    pointagesDuJour.forEach(pointage => {
      if (pointage.site && !pointage.site.startsWith("ULC")) {
        presenceData.push({
          Date: selectedDay,
          Région: pointage.region || "Non spécifiée",
          Province: pointage.province || "Non spécifiée",
          "Unité": pointage.site,
          "Médecin": pointage.medcinPresent === true ? "Présent" : pointage.medcinPresent === false ? "Absent" : "Non renseigné",
          "Infirmière 1": pointage.infirmiere1Present === true ? "Présent" : pointage.infirmiere1Present === false ? "Absent" : "Non renseigné",
          "Infirmière 2": pointage.infirmiere2Present === true ? "Présent" : pointage.infirmiere2Present === false ? "Absent" : "Non renseigné"
        });
      }
    });
  
    // Ajouter les unités sans pointage (exclure les unités ULC)
    Object.entries(unitesSansPointageParRegion).forEach(([region, unites]) => {
      unites.forEach(unite => {
        if (unite.name && !unite.name.startsWith("ULC")) {
          presenceData.push({
            Date: selectedDay,
            Région: region,
            Province: unite.province,
            "Unité": unite.name,
            "Médecin": "Pas de pointage",
            "Infirmière 1": "Pas de pointage",
            "Infirmière 2": "Pas de pointage"
          });
        }
      });
    });
  
    if (presenceData.length === 0) {
      alert("Aucune donnée à exporter pour cette date");
      return;
    }
  
    // Trier par région puis par province
    presenceData.sort((a, b) => {
      if (a.Région !== b.Région) {
        return a.Région.localeCompare(b.Région);
      }
      return a.Province.localeCompare(b.Province);
    });
  
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(presenceData);
    
    // Définir les styles de couleur
    const greenFill = { fgColor: { rgb: "90EE90" } }; // Vert clair pour présent
    const redFill = { fgColor: { rgb: "FFB6C1" } };   // Rouge clair pour absent
    const grayFill = { fgColor: { rgb: "D3D3D3" } };  // Gris pour pas de pointage
    const headerFill = { fgColor: { rgb: "FFFFAA00" } }; // Jaune pour les en-têtes
  
    // Appliquer les styles aux cellules
    const range = XLSX.utils.decode_range(ws['!ref']);
    
    // Style des en-têtes (première ligne)
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = {
        font: { bold: true, color: { rgb: "000000" } },
        fill: headerFill,
        alignment: { horizontal: "center" }
      };
    }
  
    // Style des données
    for (let row = 1; row <= range.e.r; row++) {
      // Colonnes du personnel (Médecin, Infirmière 1, Infirmière 2)
      const medecinCol = 4; // Colonne E (index 4)
      const inf1Col = 5;    // Colonne F (index 5)
      const inf2Col = 6;    // Colonne G (index 6)
      
      [medecinCol, inf1Col, inf2Col].forEach(col => {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!ws[cellAddress]) return;
        
        const cellValue = ws[cellAddress].v;
        let fill;
        
        if (cellValue === "Présent") {
          fill = greenFill;
        } else if (cellValue === "Absent") {
          fill = redFill;
        } else {
          fill = grayFill;
        }
        
        ws[cellAddress].s = {
          fill: fill,
          alignment: { horizontal: "center" },
          font: { bold: cellValue === "Présent" || cellValue === "Absent" }
        };
      });
    }
    
    // Ajuster la largeur des colonnes
    const colWidths = [
      { wch: 12 }, // Date
      { wch: 15 }, // Région
      { wch: 15 }, // Province
      { wch: 25 }, // Unité
      { wch: 15 }, // Médecin
      { wch: 15 }, // Infirmière 1
      { wch: 15 }  // Infirmière 2
    ];
    
    ws['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(wb, ws, "Présence Personnel");
    
    const fileName = `Presence_Personnel_${selectedDay.replace(/\//g, '-')}.xlsx`;
    
    XLSX.writeFile(wb, fileName);
  };

  const pointagesDuJour =
    selectedDay && grouped[selectedDay] ? grouped[selectedDay] : [];
  const groupedByRegion = groupByRegion(pointagesDuJour);
  const unitesSansPointageParRegion = getUnitesSansPointage(
    unites,
    pointagesDuJour
  );

  const showAdminButton = userRole === "chargés de performance";

  function canEdit(row) {
    return (
      userRole === "chargés de performance" ||
      (row.user && row.user.toLowerCase() === userEmail.toLowerCase())
    );
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen={fullScreen}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: "90vw",
            height: "90vh",
            m: "auto",
          },
        }}
      >
        <DialogTitle>Pointage - Admin</DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <Box mb={2}>
            <Typography variant="body2" mt={1} mb={2}>
              Liste des pointages pour les 30 derniers jours.
              <br />
              Sélectionnez un jour pour voir les pointages et envoyer le
              récapitulatif.
            </Typography>
            <FormControl sx={{ minWidth: 220, mb: 2 }}>
              <InputLabel>Jour</InputLabel>
              <Select
                value={selectedDay}
                label="Jour"
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                {days.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              onClick={sendBothReports}
              disabled={sendingBoth || !selectedDay}
              color="primary"
              variant="contained"
              sx={{
                mb: 2,
                mt: 0,
                ml: 2,
                backgroundColor: "#4caf50",
                "&:hover": { backgroundColor: "#388e3c" },
              }}
            >
              {sendingBoth
                ? "Envoi des rapports..."
                : "Envoyer les deux rapports"}
            </Button>
            <Button
              onClick={sendRecapEmail}
              disabled={sendingMail || !selectedDay}
              color="secondary"
              variant="contained"
              sx={{ mb: 2, mt: 0, ml: 2 }}
            >
              {sendingMail
                ? "Envoi en cours..."
                : "Rapport quotidien seulement"}
            </Button>
            {sendMailMsg && (
              <Typography color="info.main" sx={{ mt: 1, mb: 1 }}>
                {sendMailMsg}
              </Typography>
            )}
          </Box>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={200}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : !selectedDay || !pointagesDuJour ? (
            <Typography align="center" mt={2}>
              Aucun pointage à afficher pour ce jour.
            </Typography>
          ) : Object.keys(groupedByRegion).length === 0 ? (
            <Typography align="center" mt={2}>
              Aucun pointage à afficher pour ce jour.
            </Typography>
          ) : (
            Object.entries(groupedByRegion).map(([region, pts]) => (
              <Box key={region} sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  {region}
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {columns.map((col) => (
                        <TableCell key={col.id}>{col.label}</TableCell>
                      ))}
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pts.map((row) => (
                      <TableRow key={row._id}>
                        <TableCell>{row.customId}</TableCell>
                        <TableCell>{row.site}</TableCell>
                        <TableCell>{row.actif}</TableCell>
                        <TableCell>{row.region}</TableCell>
                        <TableCell>{row.province}</TableCell>
                        <TableCell>{row.user}</TableCell>
                        <TableCell>{formatDate(row.heureDebut)}</TableCell>
                        <TableCell>{formatBool(row.medcinPresent)}</TableCell>
                        <TableCell>
                          {formatBool(row.infirmiere1Present)}
                        </TableCell>
                        <TableCell>
                          {formatBool(row.infirmiere2Present)}
                        </TableCell>
                        <TableCell>{row.motifInactivite || "-"}</TableCell>
                        <TableCell>{formatDate(row.heureInactivite)}</TableCell>
                        <TableCell>
                          {formatDate(row.heureOuvertureEstimee)}
                        </TableCell>
                        <TableCell>{formatBool(row.siteActif)}</TableCell>
                        <TableCell>
                          {canEdit(row) && (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleEditClick(row)}
                            >
                              Modifier
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Box mt={1}>
                  <Typography
                    variant="subtitle2"
                    color="error"
                    sx={{ mb: 0.5 }}
                  >
                    Unités sans pointage :
                  </Typography>
                  {(unitesSansPointageParRegion[region] || []).length === 0 ? (
                    <Typography variant="body2">Aucune.</Typography>
                  ) : (
                    <ul>
                      {unitesSansPointageParRegion[region].map((unite) => (
                        <li key={unite._id}>
                          {unite.name} ({unite.province})
                        </li>
                      ))}
                    </ul>
                  )}
                </Box>
              </Box>
            ))
          )}
        </DialogContent>
        <DialogActions>
          {showAdminButton && (
            <>
             <Button
  onClick={exportAbsencesToExcel}
  color="success"
  variant="contained"
  sx={{ mr: 1 }}
>
  Exporter statut unités (Excel)
</Button>
              <Button
                onClick={handleAdminEditClick}
                color="info"
                variant="contained"
              >
                Mode Admin *
              </Button>
            </>
          )}
          <Button onClick={onClose} color="primary" variant="contained">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
      <EditPointageModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        pointage={selectedPointage}
        onSave={handleEditSave}
      />
      <UniteEtatModal
        open={adminModalOpen}
        onClose={handleAdminModalClose}
      />
    </>
  );
};

export default UniteEtatAdminModal;