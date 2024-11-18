import React, { useState, useEffect } from "react";
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

const UpdateData = ({ selectedRowData, setModalIsOpen }) => {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
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

  useEffect(() => {
    if (selectedRowData) {
      setFormData({ ...selectedRowData });
      setSelectedRegion(selectedRowData.region);
      setProvinces(regionsProvinces[selectedRowData.region] || []);
    }
  }, [selectedRowData]);

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
      const response = await axios.patch(
        `http://localhost:3000/api/v1/unite/${formData.id}`,
        formData
      );
      console.log("Données mises à jour:", response.data);
      setModalIsOpen(false); // Fermer le modal après mise à jour
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour:",
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
            label="Nom"
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
        {/* Les autres champs de formulaire restent les mêmes */}
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
        {/* Champs supplémentaires */}
        <Grid item xs={12} container justifyContent="center" spacing={2}>
          <Button type="submit" variant="contained" color="primary">
            Mettre à jour
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default UpdateData;
