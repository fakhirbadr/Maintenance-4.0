import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

const UpdateDialog = ({
  open,
  handleClose,
  currentFourniture,
  handleUpdate,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    categorie: "",
    besoin: "",
    quantite: "",
    technicien: "",
    commentaire: "",
    dateCreation: "",
  });

  useEffect(() => {
    if (currentFourniture) {
      setFormData({
        name: currentFourniture.name,
        categorie: currentFourniture.categorie,
        besoin: currentFourniture.besoin,
        quantite: currentFourniture.quantite,
        technicien: currentFourniture.technicien,
        commentaire: currentFourniture.commentaire,
        dateCreation: currentFourniture.dateCreation,
      });
    }
  }, [currentFourniture]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    handleUpdate(formData);
    handleClose(); // Close the dialog after submitting
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Modifier la Fourniture</DialogTitle>
      <DialogContent>
        <TextField
          label="Nom"
          fullWidth
          margin="dense"
          variant="standard"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          label="Catégorie"
          fullWidth
          margin="dense"
          variant="standard"
          name="categorie"
          value={formData.categorie}
          onChange={handleChange}
        />
        <TextField
          label="Besoin"
          fullWidth
          margin="dense"
          variant="standard"
          name="besoin"
          value={formData.besoin}
          onChange={handleChange}
        />
        <TextField
          label="Quantité"
          fullWidth
          margin="dense"
          variant="standard"
          name="quantite"
          value={formData.quantite}
          onChange={handleChange}
        />
        <TextField
          label="Technicien"
          fullWidth
          margin="dense"
          variant="standard"
          name="technicien"
          value={formData.technicien}
          onChange={handleChange}
        />
        <TextField
          label="commentaire responsable"
          fullWidth
          margin="dense"
          variant="standard"
          name="commentaire"
          value={formData.commentaire}
          onChange={handleChange}
        />
        <TextField
          label="Date de création"
          fullWidth
          margin="dense"
          variant="standard"
          name="dateCreation"
          value={new Date(formData.dateCreation).toLocaleString("fr-FR")}
          disabled
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Sauvegarder
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateDialog;
