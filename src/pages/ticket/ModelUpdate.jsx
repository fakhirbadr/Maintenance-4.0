import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const ModelUpdate = ({ rowData, setModelUpdateOpen }) => {
  const [formData, setFormData] = useState({
    Site: rowData.site || "",
    date: rowData.date || "",
    technicien: rowData.technicien || "",
    typeIntervention: rowData.typeIntervention || "",
    statut: rowData.statut || "",
    description: rowData.description || "",
    heureDebut: rowData.heureDebut || "",
    heureFin: rowData.heureFin || "",
    commentaires: rowData.commentaires || "",
  });

  useEffect(() => {
    if (rowData) {
      setFormData(rowData); // Mettre à jour le state avec les données de la ligne
    }
  }, [rowData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Affichez formData pour vérifier sa structure
    setModelUpdateOpen(false); // Fermer le modal après la soumission
  };

  return (
    <Dialog open={true} onClose={setModelUpdateOpen}>
      <DialogTitle> Modifier un ticket</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                name="date"
                id="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Site"
                type="text"
                name="site"
                id="site"
                value={formData.Site}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Technicien"
                type="text"
                name="technicien"
                id="technicien"
                value={formData.technicien}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth required>
                <InputLabel id="typeIntervention-label">
                  Type d'intervention
                </InputLabel>
                <Select
                  labelId="typeIntervention-label"
                  name="typeIntervention"
                  id="typeIntervention"
                  value={formData.typeIntervention}
                  onChange={handleChange}
                  label="Type d'intervention"
                >
                  <MenuItem value={formData.typeIntervention}>
                    {formData.typeIntervention}
                  </MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="réparation">Réparation</MenuItem>
                  <MenuItem value="installation">Installation</MenuItem>
                  <MenuItem value="inspection">Inspection</MenuItem>
                  <MenuItem value="autre">Autre</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Date de début"
                type="datetime-local"
                name="heureDebut"
                id="date_Debut"
                value={formData.heureDebut}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Date de fin"
                type="datetime-local"
                name="heureFin"
                id="dateFin"
                value={formData.heureFin}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Commentaire"
                name="commentaires"
                id="commentaire"
                value={formData.commentaires}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>

            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
              }}
            >
              <Button variant="contained" color="primary" type="submit">
                Soumettre
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setModelUpdateOpen(false)}
              >
                Annuler
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModelUpdate;
