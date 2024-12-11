import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Grid,
} from "@mui/material";
import axios from "axios";

const AddStockModal = ({ setModalOpen }) => {
  const [formData, setFormData] = useState({
    name: "",
    categorie: "",
    quantity: 0,
    date_entre: "",
    emplacement: "",
    etat: "",
    referance: "",
    responsable: "",
    observations: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    // Appelle une fonction pour envoyer les données à l'API
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/stocks",
        formData
      );
      console.log("Données envoyées", response.data);
      setModalOpen(false); //Fermer le modal après l'ajout
    } catch (err) {
      console.error("erreur lors de l'envoi des données");
    }
  };

  return (
    <Dialog
      open={true}
      onClose={() => setModalOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Ajouter un Stock</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Nom"
              name="name"
              margin="dense"
              variant="outlined"
              value={formData.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Catégorie"
              name="categorie"
              margin="dense"
              variant="outlined"
              value={formData.categorie}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Quantité"
              name="quantity"
              margin="dense"
              variant="outlined"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Date d'entrée"
              name="date_entre"
              margin="dense"
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.date_entre}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Emplacement"
              name="emplacement"
              margin="dense"
              variant="outlined"
              value={formData.emplacement}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="État"
              name="etat"
              margin="dense"
              variant="outlined"
              value={formData.etat}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Référence"
              name="referance"
              margin="dense"
              variant="outlined"
              value={formData.referance}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Responsable"
              name="responsable"
              margin="dense"
              variant="outlined"
              value={formData.responsable}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observations"
              name="observations"
              margin="dense"
              variant="outlined"
              multiline
              rows={3}
              value={formData.observations}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setModalOpen(false)} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStockModal;
