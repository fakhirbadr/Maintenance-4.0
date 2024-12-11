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
    type_intervention: "",
    statut: "",
    province: "",
    description: "",
    heureDebut: "",
    heure_fin: "",
    priorité: "",
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
      unites.forEach((unite) => {});
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
  useEffect(() => {
    // Trouve l'unité sélectionnée en fonction du "site" (nom)
    const selectedUnite = unites.find(
      (unite) => unite.name === ticketDetails.site
    );

    if (selectedUnite) {
      setTicketDetails((prevState) => ({
        ...prevState,
        province: selectedUnite.province, // Met à jour "lieu" avec la province
      }));
    }
  }, [ticketDetails.site, unites]); // Dépend de "site" et de "unites"

  // Submit form function
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3009/api/v1/tickets",
        ticketDetails
      );

      setModelAddIsOpen(false);
    } catch (error) {
      console.log(
        "Erreur lors de l'envoi des données",
        error.error.response ? error.response.data : error.message
      );
    }
    // console.log("Ticket ajouté :", ticketDetails); // Replace with API call or other logic
    // setModelAddIsOpen(false); // Close modal after adding
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
                {unites.map((unite, index) => (
                  <MenuItem key={unite.id || index} value={unite.name}>
                    {unite.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="technicien"
              name="technicien"
              value={ticketDetails.technicien}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="type_intervention">Type intervention</InputLabel>
              <Select
                labelId="type_intervention"
                id="type_intervention"
                name="type_intervention"
                value={ticketDetails.type_intervention}
                onChange={handleChange}
                label="Type intervention"
              >
                <MenuItem value="En cours">En cours</MenuItem>
                <MenuItem value="Escaladé">Escaladé</MenuItem>
                <MenuItem value="Clôturé">Clôturé</MenuItem>
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
                <MenuItem value="En cours">En cours</MenuItem>
                <MenuItem value="Escaladé">Escaladé</MenuItem>
                <MenuItem value="Clôturer">Clôturer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Province"
              name="province"
              value={ticketDetails.province}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled // Rendre ce champ non modifiable
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
              <InputLabel id="priorité-label">Priorité</InputLabel>
              <Select
                labelId="priorité-label"
                id="priorité"
                name="priorité"
                value={ticketDetails.priorité}
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
              name="heure_fin"
              type="time"
              value={ticketDetails.heure_fin}
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
