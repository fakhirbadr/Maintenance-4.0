import React, { useState } from "react";
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setDownload(null);
    setUpload(null);
    setError("");
    setCommentaire("");
    setSuccess("");
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
      // @ts-ignore
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
    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      // @ts-ignore
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await axios.post(
        `${apiUrl}/api/v1/reclamationsReseau`,
        {
          debitDownload: download,
          debitUpload: upload,
          commentaire,
        },
        { headers }
      );
      setSuccess("Réclamation envoyée avec succès.");
      setCommentaire("");
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
            <NetworkReclamationsTable />
          ) : (
            <Box>
              {role !== "superviseur" && (
                <Button
                  onClick={handleTest}
                  variant="contained"
                  disabled={loading}
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
                    disabled={!download || !upload}
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
