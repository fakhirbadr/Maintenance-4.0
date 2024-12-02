import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios"; // Assurez-vous d'importer axios

const UpdateModel = ({ open, onClose, ticket, onFieldChange, onSubmit }) => {
  // Fonction pour gérer la soumission des modifications
  const handleSubmit = async () => {
    try {
      // Préparer les données mises à jour, exclure les champs inutiles si nécessaire
      const updatedTicketData = {
        ...ticket,
      };
      // Faites un appel PATCH pour mettre à jour le ticket sur le serveur
      const response = await axios.patch(
        `https://maintenance-4-0-backend-14.onrender.com/api/v1/ticketMaintenance/${ticket._id}`,
        updatedTicketData
      );

      if (response.status === 200) {
        // Une fois la mise à jour effectuée, appeler la fonction onSubmit passée en prop
        onSubmit(response.data); // Vous pouvez ajuster la réponse selon votre besoin
        onClose(); // Fermer le modal après la soumission
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du ticket :", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modifier le Ticket</DialogTitle>
      <DialogContent>
        <TextField
          label="Nom"
          fullWidth
          margin="normal"
          value={ticket?.name || ""}
          onChange={(e) => onFieldChange("name", e.target.value)}
        />
        <TextField
          label="Site"
          fullWidth
          margin="normal"
          value={ticket?.site || ""}
          onChange={(e) => onFieldChange("site", e.target.value)}
        />
        <TextField
          label="Province"
          fullWidth
          margin="normal"
          value={ticket?.province || ""}
          onChange={(e) => onFieldChange("province", e.target.value)}
        />
        <TextField
          label="Technicien"
          fullWidth
          margin="normal"
          value={ticket?.technicien || ""}
          onChange={(e) => onFieldChange("technicien", e.target.value)}
        />
        <TextField
          label="Catégorie"
          fullWidth
          margin="normal"
          value={ticket?.categorie || ""}
          onChange={(e) => onFieldChange("categorie", e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={ticket?.description || ""}
          onChange={(e) => onFieldChange("description", e.target.value)}
        />
        <TextField
          label="Équipement défectueux"
          fullWidth
          margin="normal"
          value={ticket?.equipement_deficitaire || ""}
          onChange={(e) =>
            onFieldChange("equipement_deficitaire", e.target.value)
          }
        />
        <TextField
          label="Urgence"
          fullWidth
          margin="normal"
          value={ticket?.urgence || ""}
          onChange={(e) => onFieldChange("urgence", e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateModel;
