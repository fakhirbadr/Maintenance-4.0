import React, { useState, useEffect } from "react";
import NetworkReclamationsTable from "./NetworkReclamationsTable";
import TextField from "@mui/material/TextField";
import axios from "axios";
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";

function formatMbps(bits) {
  return (bits / 1024 / 1024).toFixed(2);
}

// Utilise la route locale pour éviter les blocages réseau
const TEST_FILE_URL = import.meta.env.VITE_API_URL + "/api/v1/test-download";

const NetworkStatus = () => {
  let role = "user";
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo && userInfo.role) {
      role = userInfo.role;
    }
  } catch (e) {}

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [download, setDownload] = useState(null);
  const [upload, setUpload] = useState(null);
  const [error, setError] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [success, setSuccess] = useState("");

  // Nouveau : gestion du site (UMMC)
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [siteInfo, setSiteInfo] = useState(null); // {region, province}

  // Récupérer les sites disponibles depuis localStorage
  useEffect(() => {
    try {
      const nameActifUser = JSON.parse(localStorage.getItem("nameActifUser"));
      if (nameActifUser && Array.isArray(nameActifUser)) {
        setSites(nameActifUser);
      }
    } catch (e) {
      console.error("Erreur lors de la récupération des sites:", e);
    }
  }, []);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setDownload(null);
    setUpload(null);
    setError("");
    setCommentaire("");
    setSuccess("");
    setSelectedSite("");
    setSiteInfo(null);
  };

  // Récupérer les infos du site (région, province) depuis l'API
  const fetchSiteInfo = async (siteName) => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const apiUrl = import.meta.env.VITE_API_URL;

      const res = await axios.get(`${apiUrl}/api/actifs`, { headers });
      const actif = res.data.find((a) => a.name === siteName);

      if (actif) {
        setSiteInfo({
          region: actif.region,
          province: actif.province || "",
        });
      } else {
        setError("Site non trouvé dans la base de données.");
      }
    } catch (e) {
      console.error("Erreur lors de la récupération des infos du site:", e);
      setError("Erreur lors de la récupération des informations du site.");
    }
  };

  // Gérer le changement de site
  const handleSiteChange = (event) => {
    const siteName = event.target.value;
    setSelectedSite(siteName);
    if (siteName) {
      fetchSiteInfo(siteName);
    } else {
      setSiteInfo(null);
    }
  };

  const testDownload = async () => {
    try {
      const start = performance.now();
      const response = await fetch(TEST_FILE_URL, { cache: "no-store" });
      const blob = await response.blob();
      const end = performance.now();
      const duration = (end - start) / 1000;
      const bits = blob.size * 8;
      return formatMbps(bits / duration);
    } catch (e) {
      setError("Erreur lors du test de téléchargement.");
      return null;
    }
  };

  const testUpload = async () => {
    try {
      const blob = new Blob([new Uint8Array(2 * 1024 * 1024)]); // 2MB
      const apiUrl = import.meta.env.VITE_API_URL;
      const start = performance.now();
      await fetch(`${apiUrl}/api/v1/test-upload`, {
        method: "POST",
        body: blob,
        headers: {
          // Pas de Content-Type pour laisser le navigateur gérer
        },
      });
      const end = performance.now();
      const duration = (end - start) / 1000;
      const bits = blob.size * 8;
      return formatMbps(bits / duration);
    } catch (e) {
      setError("Erreur lors du test d'upload.");
      return null;
    }
  };

  const handleTest = async () => {
    setSuccess("");
    setError("");
    setDownload(null);
    setUpload(null);
    setLoading(true);

    // Lance les deux tests en parallèle
    const [downloadResult, uploadResult] = await Promise.all([
      testDownload(),
      testUpload(),
    ]);

    setDownload(downloadResult);
    setUpload(uploadResult);
    setLoading(false);
  };

  const handleSendReclamation = async () => {
    setError("");
    setSuccess("");

    // Vérification que le site est sélectionné
    if (!selectedSite || !siteInfo) {
      setError("Veuillez sélectionner un site (UMMC).");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await axios.post(
        `${apiUrl}/api/v1/reclamationsReseau`,
        {
          debitDownload: download,
          debitUpload: upload,
          commentaire,
          site: selectedSite,
          region: siteInfo.region,
          province: siteInfo.province,
        },
        { headers },
      );
      setSuccess("Réclamation envoyée avec succès.");
      setCommentaire("");
      setSelectedSite("");
      setSiteInfo(null);
    } catch (e) {
      setError("Erreur lors de l'envoi de la réclamation réseau.");
    }
  };

  return (
    <>
      <Tooltip title="Test de débit réseau">
        <IconButton onClick={handleOpen}>
          <NetworkCheckIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Test de débit réseau</DialogTitle>
        <DialogContent>
          {/* Formulaire de test et création de réclamation OU tableau superviseur */}
          {role === "superviseur" ? (
            <NetworkReclamationsTable gestion={true} />
          ) : (
            <Box>
              {/* Sélection du site (UMMC) */}
              {role !== "superviseur" && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="site-select-label" sx={{ color: "#90caf9" }}>
                    Site (UMMC)
                  </InputLabel>
                  <Select
                    labelId="site-select-label"
                    value={selectedSite}
                    onChange={handleSiteChange}
                    label="Site (UMMC)"
                    sx={{
                      bgcolor: "#23293a",
                      color: "#fff",
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "#90caf9",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#90caf9",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#90caf9",
                      },
                    }}
                  >
                    {sites.map((site) => (
                      <MenuItem key={site} value={site}>
                        {site}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Affichage des infos du site */}
              {siteInfo && (
                <Box sx={{ mb: 2, p: 1, bgcolor: "#1a1f2e", borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Région: {siteInfo.region}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Province: {siteInfo.province || "Non spécifiée"}
                  </Typography>
                </Box>
              )}

              {role !== "superviseur" && (
                <Button
                  onClick={handleTest}
                  variant="contained"
                  disabled={loading || !selectedSite}
                  sx={{ mb: 2 }}
                >
                  Lancer le test
                </Button>
              )}

              {loading && <CircularProgress />}

              {download !== null && (
                <Typography>Débit download : {download} Mbps</Typography>
              )}

              {upload !== null && (
                <Typography>Débit upload : {upload} Mbps</Typography>
              )}

              {role !== "superviseur" && (
                <>
                  <TextField
                    label="Commentaire"
                    multiline
                    rows={4}
                    fullWidth
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                    sx={{
                      bgcolor: "#23293a",
                      borderRadius: 1,
                      input: { color: "#fff" },
                      mt: 2,
                    }}
                    InputLabelProps={{
                      style: { color: "#90caf9" },
                    }}
                  />
                  <Button
                    onClick={handleSendReclamation}
                    variant="contained"
                    color="primary"
                    disabled={
                      !download || !upload || !selectedSite || !siteInfo
                    }
                    sx={{ mt: 2 }}
                  >
                    Envoyer une réclamation
                  </Button>

                  {success && (
                    <Typography color="success.main" sx={{ mt: 2 }}>
                      {success}
                    </Typography>
                  )}

                  {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                      {error}
                    </Typography>
                  )}
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NetworkStatus;
