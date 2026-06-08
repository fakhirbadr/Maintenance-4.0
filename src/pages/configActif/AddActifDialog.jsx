import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const AddActifDialog = ({ open, onClose, onAddActif }) => {
  const [newActif, setNewActif] = useState({
    name: "",
    region: "",
    province: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewActif((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!newActif.name || !newActif.region) {
      alert("Le nom et la région sont obligatoires");
      return;
    }
    onAddActif(newActif);
    // Réinitialiser le formulaire après soumission
    setNewActif({ name: "", region: "", province: "" });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter un nouvel actif</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Nom de l'actif"
          type="text"
          fullWidth
          variant="outlined"
          value={newActif.name}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          name="region"
          label="Région"
          type="text"
          fullWidth
          variant="outlined"
          value={newActif.region}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          name="province"
          label="Province (optionnel)"
          type="text"
          fullWidth
          variant="outlined"
          value={newActif.province}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddActifDialog;