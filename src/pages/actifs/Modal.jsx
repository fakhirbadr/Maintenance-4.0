import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Grid,
  FormControlLabel,
  Switch,
} from "@mui/material";

const regionsProvinces = {
  "Grand Casablanca-Settat": [
    "Casablanca",
    "Mohammedia",
    "El Jadida",
    "Settat",
    "Berrchid",
  ],
  "Rabat-Salé-Kénitra": [
    "Rabat",
    "Salé",
    "Kénitra",
    "Sidi Kacem",
    "Sidi Slimane",
  ],
  "Marrakech-Safi": [
    "Marrakech",
    "El Kelaa des Sraghna",
    "Chichaoua",
    "Safi",
    "Youssoufia",
  ],
  "Fès-Meknès": ["Fès", "Meknès", "Taza", "Ifrane", "El Hajeb"],
  "Souss-Massa": [
    "Agadir",
    "Tiznit",
    "Taroudant",
    "Chtouka Ait Baha",
    "Inezgane",
  ],
  "Béni Mellal-Khénifra": [
    "Béni Mellal",
    "Khénifra",
    "Azilal",
    "Khouribga",
    "Fqih Bensalah",
  ],
  "Drâa-Tafilalet": ["Errachidia", "Ouarzazate", "Zagora", "Midelt", "Tinghir"],
  "Tanger-Tetouan-Al Hoceima": [
    "Tanger",
    "Tetouan",
    "Al Hoceima",
    "Chefchaouen",
    "Larache",
  ],
  "Eddakhla-Oued Eddahab": ["Dakhla", "Oued Eddahab"],
  "Guelmim-Oued Noun": [
    "Guelmim",
    "Tan-Tan",
    "Sidi Ifni",
    "Tata",
    "Ouarzazate",
  ],
  Oriental: ["Oujda", "Nador", "Driouch", "Berkane", "Taourirt"],
  "Laayoune-Sakia El Hamra": ["Laayoune", "Boujdour", "Tarfaya", "Smara"],
};

const Modal = ({ setModelIsOpen, setOpen, onClose, handleClose }) => {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [formData, setFormData] = useState({
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
    etat: true,
  });

  const handleRegionChange = (event) => {
    const region = event.target.value;
    setSelectedRegion(region);
    setProvinces(regionsProvinces[region] || []);
    setFormData({ ...formData, region });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSwitchChange = (event) => {
    setFormData({ ...formData, etat: event.target.checked });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://maintenance-4-0-backend-14.onrender.com/api/v1/unite",
        formData
      );
      console.log("Données envoyées:", response.data);
      setModelIsOpen(false);
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi des données:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="name"
            label="name"
            placeholder="UMMC ABC"
            variant="outlined"
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel id="coordinateur-label">Coordinateur</InputLabel>
            <Select
              labelId="coordinateur-label"
              id="coordinateur"
              name="coordinateur"
              value={formData.coordinateur}
              onChange={handleInputChange}
              label="Coordinateur"
            >
              {[
                "Oumaima LALLALEN",
                "Mohamed RAZIN",
                "Ismail BELGHITI",
                "Abderahmen AKRAN",
              ].map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel id="region-label">Région</InputLabel>
            <Select
              labelId="region-label"
              id="region"
              value={selectedRegion}
              onChange={handleRegionChange}
              label="Région"
            >
              {Object.keys(regionsProvinces).map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required disabled={!selectedRegion}>
            <InputLabel id="province-label">Province</InputLabel>
            <Select
              labelId="province-label"
              id="province"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              label="Province"
            >
              {provinces.map((province) => (
                <MenuItem key={province} value={province}>
                  {province}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="lat"
            label="Latitude"
            type="number"
            name="lat"
            value={formData.lat}
            onChange={handleInputChange}
            placeholder="Latitude"
            variant="outlined"
            fullWidth
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.etat}
                onChange={handleSwitchChange}
                color="primary"
              />
            }
            label={formData.etat ? "Actif" : "Inactif"}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="long"
            label="Longitude"
            name="long"
            value={formData.long}
            onChange={handleInputChange}
            placeholder="Longitude"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            required
            id="chargeSuivi"
            label="Chargé de suivi"
            name="chargeSuivi"
            value={formData.chargeSuivi}
            onChange={handleInputChange}
            placeholder="Fakhir Badr"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            required
            id="technicien"
            label="Technicien"
            name="technicien"
            value={formData.technicien}
            onChange={handleInputChange}
            placeholder="Fakhir Badr"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            required
            id="docteur"
            label="Docteur"
            name="docteur"
            value={formData.docteur}
            onChange={handleInputChange}
            placeholder="Fakhir Badr"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="mail"
            label="Adresse mail"
            name="mail"
            value={formData.mail}
            onChange={handleInputChange}
            placeholder="mediot@mediot.ma"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="num"
            label="Téléphone"
            name="num"
            value={formData.num}
            onChange={handleInputChange}
            placeholder="123-456-7890"
            variant="outlined"
            fullWidth
          />
        </Grid>
      </Grid>

      <Grid
        className="pt-10 gap-x-4" // pt-6 = padding-top: 1.5rem
        item
        xs={12}
        container
        justifyContent="end"
        spacing={2}
      >
        <Button type="submit" variant="contained" color="primary">
          Enregistrer
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onClose} // Appelle une fonction pour fermer le modal
        >
          Annuler
        </Button>
      </Grid>
    </form>
  );
};

export default Modal;
