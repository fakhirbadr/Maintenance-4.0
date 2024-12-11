import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  TextField,
  IconButton,
  Input,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const ModalUser = ({ open, handleClose, selectedRow, onSave }) => {
  if (!selectedRow) return null;

  const [formData, setFormData] = useState({
    name: selectedRow[2],
    poste: selectedRow[3],
    hireDate: selectedRow[4],
    cin: selectedRow[5],
    region: selectedRow[6],
    province: selectedRow[7],
    age: selectedRow[8],
    sex: selectedRow[9],
    phone: selectedRow[10],
    email: selectedRow[11],
    address: selectedRow[12],
    photo: selectedRow[1], // Assurez-vous que photo est sous forme d'URL ou d'élément
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          photo: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(formData); // Envoie les données mises à jour au parent
    handleClose();
  };

  const photoElement =
    typeof selectedRow[1] === "object" && selectedRow[1].type === "img"
      ? selectedRow[1]
      : null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Détails de l'utilisateur</DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          label="Nom"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          name="poste"
          label="Poste"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.poste}
          onChange={handleChange}
        />
        <TextField
          name="hireDate"
          label="Date d'embauche"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.hireDate}
          onChange={handleChange}
        />
        <TextField
          name="cin"
          label="CIN"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.cin}
          onChange={handleChange}
        />
        <TextField
          name="region"
          label="Région"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.region}
          onChange={handleChange}
        />
        <TextField
          name="province"
          label="Province"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.province}
          onChange={handleChange}
        />
        <TextField
          name="age"
          label="Âge"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.age}
          onChange={handleChange}
        />
        <TextField
          name="sex"
          label="Sexe"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.sex}
          onChange={handleChange}
        />
        <TextField
          name="phone"
          label="Téléphone"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.phone}
          onChange={handleChange}
        />
        <TextField
          name="email"
          label="E-mail"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          name="address"
          label="Adresse"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.address}
          onChange={handleChange}
        />
        <div>
          <Typography variant="body1">Photo:</Typography>
          {photoElement ? (
            photoElement
          ) : (
            <Typography variant="body1">Photo non disponible</Typography>
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginTop: 10 }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Annuler
        </Button>
        <Button onClick={handleSave} color="primary">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalUser;
