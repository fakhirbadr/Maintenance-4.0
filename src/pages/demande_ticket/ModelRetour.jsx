import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const ModelRetour = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", md: 400 },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ color: "primary.main" }}>
          🛠 Retour d'Équipement
        </Typography>

        {/* Ajouter ici le formulaire spécifique */}
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          Formulaire de retour d'équipement à compléter...
        </Typography>

        <Button variant="contained" onClick={onClose} sx={{ mt: 2 }}>
          Fermer
        </Button>
      </Box>
    </Modal>
  );
};

export default ModelRetour;
