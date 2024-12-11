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
import axios from "axios"; // Importation de axios pour les requêtes HTTP

const UpdateStock = ({ rowData, setOpenUpdateModal, onClose }) => {
  // Initialisation du state pour stocker les données du formulaire
  const [formData, setFormData] = useState(rowData);

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Récupération du nom et de la valeur du champ modifié
    setFormData({
      ...formData, // Conserver les anciennes données
      [name]: value, // Mettre à jour uniquement le champ modifié
    });
  };

  // Fonction pour sauvegarder les modifications en appelant l'API
  const handleSave = async () => {
    try {
      // Effectuer une requête PUT à l'API pour mettre à jour les données
      const response = await axios.patch(
        `http://localhost:3000/api/v1/stocks/${formData._id}`, // URL avec l'ID du stock
        formData // Données mises à jour à envoyer
      );

      console.log("Données mises à jour avec succès : ", response.data);
      alert("Mise à jour réussie !");

      // Fermer le modal après la mise à jour
      onClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour : ", error);
      alert("Une erreur est survenue lors de la mise à jour.");
    }
  };

  // Fonction pour fermer le modal
  const handleCloseup = () => {
    onClose(); // Appeler la fonction pour fermer le modal (fournie par le parent)
  };

  return (
    <Dialog open={true} onClose={handleCloseup} maxWidth="sm" fullWidth>
      <DialogTitle>Mettre à jour le stock</DialogTitle>
      <DialogContent>
        {/* Formulaire contenant les champs à mettre à jour */}
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
        {/* Bouton pour annuler la mise à jour */}
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        {/* Bouton pour sauvegarder les modifications */}
        <Button onClick={handleSave} color="primary" variant="contained">
          Sauvegarder
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateStock;
