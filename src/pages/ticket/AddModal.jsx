import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";

const AddModal = ({ setModelAddIsOpen }) => {
  // State for form inputs
  const [ticketDetails, setTicketDetails] = useState({
    id: "",
    date: "",
    site: "",
    technicien: "",
    typeIntervention: "",
    statut: "",
    lieu: "",
    description: "",
    heureDebut: "",
    heureFin: "",
    priorite: "",
    unites: "",
  });
  const [unites, setUnites] = useState([]); // Liste des unités

  // Récupérer les unités depuis l'API
  useEffect(() => {
    const fetchUnites = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/unite"); // Remplacez avec votre URL API
        setUnites(response.data.data.unites); // Accède à data.unites et stocke les unités dans l'état
      } catch (error) {
        console.error("Erreur lors de la récupération des unités:", error);
      }
    };
    fetchUnites();
  }, []);

  useEffect(() => {
    // Vérifie si 'unites' contient des données et les imprime dans la console
    if (unites.length > 0) {
      unites.forEach((unite) => {
        console.log(unite); // Imprime chaque objet 'unite' dans la console
      });
    }
  }, [unites]);
  useEffect(() => {
    // Vérifie si 'unites' contient des données et imprime seulement le nom dans la console
    if (unites.length > 0) {
      unites.forEach((unite) => {
        console.log(unite.name); // Imprime seulement le nom de chaque 'unite' dans la console
      });
    }
  }, [unites]);

  // Handle text field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Submit form function
  const handleSubmit = () => {
    console.log("Ticket ajouté :", ticketDetails); // Replace with API call or other logic
    setModelAddIsOpen(false); // Close modal after adding
  };

  return (
    <Dialog
      open={true}
      onClose={() => setModelAddIsOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Ajouter un Ticket</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Date"
              name="date"
              type="date"
              value={ticketDetails.date}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="site-label">Site</InputLabel>
              <Select
                labelId="site-label"
                id="site"
                name="site"
                value={ticketDetails.site}
                onChange={handleChange}
                label="Site"
              >
                {unites.map((unite) => (
                  <MenuItem key={unite.id} value={unite.name}>
                    {unite.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Technicien"
              name="technicien"
              value={ticketDetails.technicien}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="type-intervention-label">
                Type intervention
              </InputLabel>
              <Select
                labelId="type-intervention-label"
                id="type-intervention"
                name="type-intervention"
                value={ticketDetails.typeIntervention}
                onChange={handleChange}
                label="type-intervention"
              >
                <MenuItem value="Basse">En cours</MenuItem>
                <MenuItem value="Moyenne">Escaladé</MenuItem>
                <MenuItem value="Haute">Clôturer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="statut-label">Statut</InputLabel>
              <Select
                labelId="statut-label"
                id="statut"
                name="statut"
                value={ticketDetails.statut}
                onChange={handleChange}
                label="Statut"
              >
                <MenuItem value="Basse">En cours</MenuItem>
                <MenuItem value="Moyenne">Escaladé</MenuItem>
                <MenuItem value="Haute">Clôturer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Lieu"
              name="lieu"
              value={ticketDetails.lieu}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Description"
              name="description"
              value={ticketDetails.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="priorite-label">Priorité</InputLabel>
              <Select
                labelId="priorite-label"
                id="priorite"
                name="priorite"
                value={ticketDetails.priorite}
                onChange={handleChange}
                label="Priorité"
              >
                <MenuItem value="Basse">Basse</MenuItem>
                <MenuItem value="Moyenne">Moyenne</MenuItem>
                <MenuItem value="Haute">Haute</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Heure Début"
              name="heureDebut"
              type="time"
              value={ticketDetails.heureDebut}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Heure Fin"
              name="heureFin"
              type="time"
              value={ticketDetails.heureFin}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setModelAddIsOpen(false)} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddModal;
