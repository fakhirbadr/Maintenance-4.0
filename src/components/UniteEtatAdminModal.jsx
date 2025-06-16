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

// Regroupe les pointages par jour (clé = date locale FR, basé sur dateRequest)
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

// Regroupe les pointages par région pour un jour donné
function groupByRegion(pointages) {
  return pointages.reduce((acc, ptg) => {
    const region = ptg.region || "Région inconnue";
    if (!acc[region]) acc[region] = [];
    acc[region].push(ptg);
    return acc;
  }, {});
}

// Retourne les unités actives sans pointage pour un jour donné, groupées par région
function getUnitesSansPointage(unites, pointagesDuJour) {
  // Set des noms d'unité ayant pointé ce jour
  const pointageUniteNames = new Set(pointagesDuJour.map((p) => p.site));
  // Regroupe les unités par région
  const grouped = {};
  for (const unite of unites) {
    if (!grouped[unite.region]) grouped[unite.region] = [];
    // On ajoute seulement si l'unité n'a PAS fait de pointage ce jour
    if (!pointageUniteNames.has(unite.name)) {
      grouped[unite.region].push(unite);
    }
  }
  return grouped; // {region: [unites sans pointage]}
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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Récupère le rôle et l'email de l'utilisateur depuis le localStorage
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

  // Récupère les pointages (à chaque ouverture)
  const fetchData = () => {
    setLoading(true);
    fetch(`${apiUrl}/api/v1/pointage`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement");
        let data = await res.json();
        // Filtrer sur les 30 derniers jours (par rapport à createdAt)
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

  // Récupère les unités actives (une seule fois à l'ouverture)
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

  // Regroupe les pointages par jour
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

  // Ouvre la modale EditPointageModal vide (mode admin)
  const handleAdminEditClick = () => {
    setSelectedPointage(null); // On passe null pour ouvrir en mode vide
    setEditModalOpen(true);
  };

  // Ferme la modale
  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedPointage(null);
  };

  // Reste inchangé (édition uniquement)
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

  // Envoi le recapitulatif du jour sélectionné par mail
  const sendRecapEmail = async () => {
    setSendingMail(true);
    setSendMailMsg("");
    try {
      if (!selectedDay) {
        setSendMailMsg("Aucun jour sélectionné.");
        setSendingMail(false);
        return;
      }
      // Transforme le format '20/05/2025' en '2025-05-20'
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

  // Envoi des deux rapports simultanément
  const sendBothReports = async () => {
    setSendingBoth(true);
    setSendMailMsg("");
    try {
      if (!selectedDay) {
        setSendMailMsg("Aucun jour sélectionné.");
        setSendingBoth(false);
        return;
      }

      // Formatage de la date
      const [d, m, y] = selectedDay.split("/");
      const dayStr = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;

      // Envoi des deux rapports en parallèle
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

      // Traitement des réponses
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

          // Détecter les réponses HTML
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
              // Extraire le message d'erreur du JSON
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

  // --- Groupement par région pour le jour sélectionné
  const pointagesDuJour =
    selectedDay && grouped[selectedDay] ? grouped[selectedDay] : [];
  const groupedByRegion = groupByRegion(pointagesDuJour);
  const unitesSansPointageParRegion = getUnitesSansPointage(
    unites,
    pointagesDuJour
  );

  // Seuls les utilisateurs ayant le rôle 'chargés de performance' voient le bouton "Mode Admin"
  const showAdminButton = userRole === "chargés de performance";

  // Seuls les utilisateurs ayant le rôle 'chargés de performance' OU qui sont l'utilisateur du pointage voient le bouton "Modifier"
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
                {/* Unités sans pointage */}
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
            <Button
              onClick={handleAdminEditClick}
              color="info"
              variant="contained"
            >
              Mode Admin *
            </Button>
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
    </>
  );
};

export default UniteEtatAdminModal;