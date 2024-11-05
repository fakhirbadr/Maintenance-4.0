import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material"; // Importation des composants Material UI

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
  "Laâyoune-Sakia El Hamra": ["Laâyoune", "Boujdour", "Tarfaya", "Smara"],
};

const UpdateModal = ({ rowData }) => {
  const [selectedRegion, setSelectedRegion] = useState(rowData.Région || "");
  const [provinces, setProvinces] = useState(
    regionsProvinces[selectedRegion] || []
  );
  const [formData, setFormData] = useState({
    Nom: rowData.Nom || "",
    Région: rowData.Région || "",
    Province: rowData.Province || "",
    Coordinateur: rowData.Coordinateur || "",
    Latitude: rowData.Latitude || "",
    Longitude: rowData.Longitude || "",
    Chargé_de_suivie: rowData.Chargé_de_suivie || "",
    Technicien: rowData.Technicien || "",
    Docteur: rowData.Docteur || "",
    mail: rowData.Mail || "",
    Téléphone: rowData.Num || "",
  });

  useEffect(() => {
    setProvinces(regionsProvinces[selectedRegion] || []);
  }, [selectedRegion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
    setFormData((prev) => ({
      ...prev,
      Région: event.target.value,
      Province: "",
    }));
  };

  return (
    <div className="p-4">
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Nom"
              variant="outlined"
              fullWidth
              required
              name="Nom"
              value={formData.Nom}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Coordinateur</InputLabel>
              <Select
                name="Coordinateur"
                value={formData.Coordinateur}
                onChange={handleChange}
                required
              >
                <MenuItem value="Oumaima LALLALEN">Oumaima LALLALEN</MenuItem>
                <MenuItem value="Mohamed RAZIN">Mohamed RAZIN</MenuItem>
                <MenuItem value="Ismail BELGHITI">Ismail BELGHITI</MenuItem>
                <MenuItem value="Abderahmen AKRAN">Abderahmen AKRAN</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Région</InputLabel>
              <Select
                name="Région"
                value={selectedRegion}
                onChange={handleRegionChange}
                required
              >
                <MenuItem disabled hidden>
                  Choisissez La région
                </MenuItem>
                {Object.keys(regionsProvinces).map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Province</InputLabel>
              <Select
                name="Province"
                value={formData.Province}
                onChange={handleChange}
                disabled={!selectedRegion}
                required
              >
                <MenuItem disabled hidden>
                  Choisissez La province
                </MenuItem>
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
              label="Latitude"
              variant="outlined"
              fullWidth
              required
              name="Latitude"
              type="number"
              value={formData.Latitude}
              onChange={handleChange}
              helperText="Entrez la latitude"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Longitude"
              variant="outlined"
              fullWidth
              required
              name="Longitude"
              type="number"
              value={formData.Longitude}
              onChange={handleChange}
              helperText="Entrez la longitude"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Chargé de suivi"
              variant="outlined"
              fullWidth
              required
              name="Chargé_de_suivie"
              value={formData.Chargé_de_suivie}
              onChange={handleChange}
              helperText="Entrez le nom du chargé de suivi"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Technicien"
              variant="outlined"
              fullWidth
              required
              name="Technicien"
              value={formData.Technicien}
              onChange={handleChange}
              helperText="Entrez le nom du technicien"
            />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default UpdateModal;
