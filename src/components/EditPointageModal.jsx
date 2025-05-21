import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";

const EditPointageModal = ({ open, onClose, pointage, onSave }) => {
  const [form, setForm] = useState(pointage || {});

  React.useEffect(() => {
    setForm(pointage || {});
  }, [pointage]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // onSave doit faire l'appel API dans le parent
    onSave(form);
  };

  if (!pointage) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Modifier le pointage</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <TextField
            margin="dense"
            label="ID personnalisé"
            name="customId"
            value={form.customId || ""}
            onChange={handleChange}
            fullWidth
            disabled
          />
          <TextField
            margin="dense"
            label="Région"
            name="region"
            value={form.region || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Province"
            name="province"
            value={form.province || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Utilisateur"
            name="user"
            value={form.user || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Motif Inactivité"
            name="motifInactivite"
            value={form.motifInactivite || ""}
            onChange={handleChange}
            fullWidth
          />
          <Box mt={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!form.medcinPresent}
                  onChange={handleChange}
                  name="medcinPresent"
                />
              }
              label="Médecin présent"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!form.infirmiere1Present}
                  onChange={handleChange}
                  name="infirmiere1Present"
                />
              }
              label="Infirmier 1 présent"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!form.infirmiere2Present}
                  onChange={handleChange}
                  name="infirmiere2Present"
                />
              }
              label="Infirmier 2 présent"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!form.siteActif}
                  onChange={handleChange}
                  name="siteActif"
                />
              }
              label="Site actif"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained" color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditPointageModal;
