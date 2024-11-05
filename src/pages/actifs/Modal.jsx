import React, { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Grid,
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

const Modal = ({ setModelIsOpen }) => {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [provinces, setProvinces] = useState([]);

  const handleRegionChange = (event) => {
    const region = event.target.value;
    setSelectedRegion(region);
    setProvinces(regionsProvinces[region] || []);
  };

  return (
    <form>
      <Grid container spacing={2} direction="column">
        {/* Ligne 1 */}
        <Grid container item spacing={2}>
          {/* Nom */}
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="Nom"
              label="Nom"
              placeholder="UMMC ABC"
              variant="outlined"
              fullWidth
            />
          </Grid>
          {/* Coordinateur */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel id="coordinateur-label">Coordinateur</InputLabel>
              <Select
                labelId="coordinateur-label"
                id="countries"
                defaultValue=""
                label="Coordinateur"
              >
                <MenuItem value="" disabled>
                  Choisissez le coordinateur
                </MenuItem>
                <MenuItem value="Oumaima LALLALEN">Oumaima LALLALEN</MenuItem>
                <MenuItem value="Mohamed RAZIN">Mohamed RAZIN</MenuItem>
                <MenuItem value="Ismail BELGHITI">Ismail BELGHITI</MenuItem>
                <MenuItem value="Abderahmen AKRAN">Abderahmen AKRAN</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Ligne 2 */}
        <Grid container item spacing={2}>
          {/* Région */}
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
                <MenuItem value="" disabled>
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

          {/* Province */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required disabled={!selectedRegion}>
              <InputLabel id="province-label">Province</InputLabel>
              <Select labelId="province-label" id="province" label="Province">
                <MenuItem value="" disabled>
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

          {/* Latitude */}
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="Latitude"
              label="Latitude"
              type="number"
              placeholder="Latitude"
              variant="outlined"
              fullWidth
            />
          </Grid>

          {/* Longitude */}
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="longitude"
              label="Longitude"
              placeholder="Longitude"
              variant="outlined"
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Ligne 3 */}
        <Grid container item spacing={2}>
          {/* Chargé de suivi */}
          <Grid item xs={12} md={4}>
            <TextField
              required
              id="Chargé_de_suivie"
              label="Chargé de suivi"
              placeholder="Fakhir Badr"
              variant="outlined"
              fullWidth
            />
          </Grid>

          {/* Technicien */}
          <Grid item xs={12} md={4}>
            <TextField
              required
              id="Technicien"
              label="Technicien"
              placeholder="Fakhir Badr"
              variant="outlined"
              fullWidth
            />
          </Grid>

          {/* Docteur */}
          <Grid item xs={12} md={4}>
            <TextField
              required
              id="Docteur"
              label="Docteur"
              placeholder="Fakhir Badr"
              variant="outlined"
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Ligne 4 */}
        <Grid container item spacing={2}>
          {/* Adresse mail */}
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="mail"
              label="Adresse mail"
              placeholder="mediot@mediot.ma"
              variant="outlined"
              fullWidth
            />
          </Grid>

          {/* Téléphone */}
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="Télephone"
              label="Téléphone"
              placeholder="123-456-7890"
              variant="outlined"
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Ligne 5 - Photo */}
        <Grid container item justifyContent="center" spacing={2}>
          <Grid item>
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" />
            </label>
          </Grid>
        </Grid>
      </Grid>

      {/* Buttons */}
    </form>
  );
};

export default Modal;
