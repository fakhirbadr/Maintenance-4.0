import React, { useState, useEffect } from "react";
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
import axios from "axios";
import dayjs from "dayjs";

// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const DemandeCongeDialog = ({
  open,
  onClose,
  nomComplet,
  role,
  province,
  id,
}) => {
  const [typeConge, setTypeConge] = useState("");
  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);
  const [justification, setJustification] = useState("");
  const [names, setNames] = useState([]);
  const [selectedName, setSelectedName] = useState(""); // Nouvel état

  useEffect(() => {
    const userIds = JSON.parse(localStorage.getItem("userActifs"));
    if (userIds && Array.isArray(userIds)) {
      const fetchedNames = [];
      userIds.forEach(async (id) => {
        try {
          const response = await fetch(`${apiUrl}/api/actifs/${id}`);
          if (response.ok) {
            const data = await response.json();
            fetchedNames.push(data);
            if (fetchedNames.length === userIds.length) {
              setNames(fetchedNames);
            }
          } else {
            console.error(`Erreur pour l'ID ${id}: ${response.statusText}`);
          }
        } catch (error) {
          console.error(`Erreur lors de la récupération des données:`, error);
        }
      });
    }
  }, []);

  const handleSelectChange = (event) => {
    setSelectedName(event.target.value);
  };

  const handleSubmit = async () => {
    const formattedDateDebut = dayjs(dateDebut).toISOString();
    const formattedDateFin = dayjs(dateFin).toISOString();

    const requestData = {
      nomComplet,
      role,
      cle: id,
      province,
      actif: selectedName, // Nom de l'actif sélectionné
      historique: [
        {
          dateDebut: formattedDateDebut,
          dateFin: formattedDateFin,
          typeAbsence: typeConge,
          justification,
          isValidated: false,
        },
      ],
    };

    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/absences`,
        requestData
      );
      console.log("Réponse du serveur:", response.data);
      console.log("Demande de congé soumise avec succès");
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande de congé:", error);
      if (error.response) {
        console.error("Détails de la réponse:", error.response.data);
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
            <Grid item xs={12} sm={6}>
              <FormControl variant="standard" fullWidth>
                <InputLabel id="demo-simple-select-standard-label">
                  Nom de l'Actif
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={selectedName}
                  onChange={handleSelectChange}
                >
                  {names.map((actif) => (
                    <MenuItem key={actif._id} value={actif.name}>
                      {actif.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="province"
                label="Province"
                value={province}
                variant="standard"
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="role"
                label="Rôle"
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
