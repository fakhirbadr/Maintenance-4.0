import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {
  Grid,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios"; // Import axios
import dayjs from "dayjs";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const DemandeCongeDialog = ({ open, onClose, nomComplet, role, province }) => {
  const [typeConge, setTypeConge] = React.useState("");
  const [dateDebut, setDateDebut] = React.useState(null);
  const [dateFin, setDateFin] = React.useState(null);
  const [justification, setJustification] = React.useState("");

  const formatDate = (date) => {
    return date ? date.format("DD/MM/YYYY") : ""; // Formater la date en "DD/MM/YYYY"
  };

  const handleSubmit = async () => {
    // Convertir les dates en objets Date valides (ISO format)
    const formattedDateDebut = dayjs(dateDebut).toISOString(); // Convertir la date en format ISO
    const formattedDateFin = dayjs(dateFin).toISOString(); // Convertir la date en format ISO

    // Préparer les données pour le POST
    const requestData = {
      nomComplet,
      role,
      province,
      historique: [
        {
          dateDebut: formattedDateDebut,
          dateFin: formattedDateFin,
          typeAbsence: typeConge,
          justification,
          isValidated: false, // À ajuster en fonction de la validation côté serveur
        },
      ],
    };

    try {
      // Envoi de la requête POST vers l'API
      const response = await axios.post(
        `${apiUrl}/api/v1/absences`,
        requestData
      );
      console.log("Réponse du serveur:", response.data); // Affiche la réponse complète
      console.log("Demande de congé soumise avec succès");
      onClose(); // Fermer la boîte de dialogue après l'envoi
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande de congé:", error);
      if (error.response) {
        console.error("Détails de la réponse:", error.response.data); // Affiche la réponse détaillée
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Demande d'absence</DialogTitle>
        <DialogContent>
          <Grid container sx={{ paddingY: 4 }} spacing={2}>
            <Grid item xs={4}>
              <TextField
                id="name"
                label="Nom"
                value={nomComplet}
                variant="standard"
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="province"
                label="province"
                value={province}
                variant="standard"
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="role"
                label="role"
                value={role === "user" ? "Technicien" : role}
                variant="standard"
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="standard">
                <InputLabel id="type-conge-label">Type d'absence</InputLabel>
                <Select
                  labelId="type-conge-label"
                  id="type-conge"
                  value={typeConge}
                  onChange={(e) => setTypeConge(e.target.value)}
                >
                  <MenuItem value="Congés payés">Congés payés</MenuItem>
                  <MenuItem value="Congé sans solde">Congé sans solde</MenuItem>
                  <MenuItem value="Congé maladie">Congé maladie</MenuItem>
                  <MenuItem value="Congé maternité">Congé maternité</MenuItem>
                  <MenuItem value="Congé paternité">Congé paternité</MenuItem>
                  <MenuItem value="Congé mariage">Congé mariage</MenuItem>
                  <MenuItem value="Naissance d’un enfant">
                    Naissance d’un enfant
                  </MenuItem>
                  <MenuItem value="Décès d’un proche">
                    Décès d’un proche
                  </MenuItem>
                  <MenuItem value="Congé pour accident du travail">
                    Congé pour accident du travail
                  </MenuItem>
                  <MenuItem value="Absence pour raisons administratives">
                    Absence pour raisons administratives
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                label="Date de début"
                value={dateDebut}
                onChange={(newValue) => setDateDebut(newValue)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth variant="standard" />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                label="Date de fin (inclus)"
                value={dateFin}
                onChange={(newValue) => setDateFin(newValue)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth variant="standard" />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="justification"
                label="Justification de la demande"
                multiline
                rows={4}
                variant="standard"
                fullWidth
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Soumettre
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default DemandeCongeDialog;
