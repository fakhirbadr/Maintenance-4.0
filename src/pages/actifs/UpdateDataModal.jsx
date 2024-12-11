import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios"; // Ensure axios is installed

const UpdateDataModal = ({ setModelUpdateOpen, rowData }) => {
  const handleClose = () => setModelUpdateOpen(false);

  const [formData, setFormData] = useState({
    id: "", // Ajoutez ici l'ID

    name: "",
    coordinateur: "",
    region: "",
    province: "",
    lat: "",
    long: "",
    chargeSuivi: "",
    technicien: "",
    docteur: "",
    mail: "",
    num: "",
    etat: false,
  });

  useEffect(() => {
    if (rowData && Array.isArray(rowData)) {
      // Assurez-vous que rowData est un tableau
      console.log("RowData received:", rowData);

      // Filter out React elements
      const extractValue = (value) => {
        return value && value.$$typeof ? "" : value; // If it's a React element, return empty string
      };

      setFormData({
        id: rowData[0], // Assuming rowData[0] is the unique ID
        name: extractValue(rowData[2]), // Unité name
        coordinateur: extractValue(rowData[5]), // Coordinateur
        region: extractValue(rowData[3]), // Region
        province: extractValue(rowData[4]), // Province
        lat: extractValue(rowData[6]), // Latitude
        long: extractValue(rowData[7]), // Longitude
        chargeSuivi: extractValue(rowData[6]), // Charge Suivi
        technicien: extractValue(rowData[7]), // Technicien
        docteur: extractValue(rowData[8]), // Docteur
        mail: extractValue(rowData[9]), // Mail
        num: extractValue(rowData[10]), // Phone number
        etat: true, // Assuming etat is true (or set based on other conditions)
      });
    }
  }, [rowData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderedData = {
      _id: formData.id, // L'ID en premier
      etat: formData.etat, // L'état
      name: formData.name, // Le nom
      region: formData.region, // La région
      province: formData.province, // La province
      coordinateur: formData.coordinateur, // Le coordinateur
      chargeSuivi: formData.chargeSuivi, // Le charge de suivi
      technicien: formData.technicien, // Le technicien
      docteur: formData.docteur, // Le docteur
      mail: formData.mail, // L'email
      num: formData.num, // Le numéro
      lat: formData.lat, // La latitude
      long: formData.long, // La longitude
    };

    // Afficher les données réorganisées
    console.log("Données envoyées dans l'ordre : ", orderedData);

    try {
      const response = await axios.patch(
        `https://maintenance-4-0-backend-14.onrender.com/v1/unite/${formData.id}`,
        formData
      );
      console.log("Données mises à jour avec succès", response.data);
      setModelUpdateOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données:", error);
    }
  };

  return (
    <Dialog open={true} onClose={handleClose}>
      <DialogTitle>Modifier les données</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nom"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Coordinateur"
            name="coordinateur"
            value={formData.coordinateur}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Région"
            name="region"
            value={formData.region}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Province"
            name="province"
            value={formData.province}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Chargé du Suivi"
            name="chargeSuivi"
            value={formData.chargeSuivi}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Technicien"
            name="technicien"
            value={formData.technicien}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Docteur"
            name="docteur"
            value={formData.docteur}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="mail"
            value={formData.mail}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Numéro"
            name="num"
            value={formData.num}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Latitude"
            name="lat"
            value={formData.lat}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            label="Longitude"
            name="long"
            value={formData.long}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <DialogActions>
            <Button type="submit" color="primary">
              Enregistrer
            </Button>
            <Button onClick={handleClose} color="secondary">
              Annuler
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDataModal;
