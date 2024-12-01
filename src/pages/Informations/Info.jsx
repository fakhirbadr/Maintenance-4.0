import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { divIcon } from "leaflet";
import Location from "../../components/Location";
// import Morroco from "../../../public/images/Infromations/morroco.png";
// import FondationM6 from "../../../public/images/Infromations/images.png";
// import SCX from "../../../public/images/Rapport/aba-galaxy.png";
import { rows } from "../actifs/Data";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

// Configuration des icônes Leaflet personnalisées
const ummcIcon = new L.DivIcon({
  className: "custom-icon",
  html: `
    <div style="color: red; font-size: 24px;">
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hospital"><path d="M12 6v4"/><path d="M14 14h-4"/><path d="M14 18h-4"/><path d="M14 8h-4"/><path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"/><path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18"/></svg>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const ulcIcon = new L.DivIcon({
  className: "custom-icon",
  html: `
    <div style="color: blue; font-size: 24px;">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ambulance"><path d="M10 10H6"/><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"/><path d="M8 8v4"/><path d="M9 18h6"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const Info = () => {
  const [selectedUMMC, setSelectedUMMC] = useState("");
  const [selectedULC, setSelectedULC] = useState("");
  const [selectedPosition, setSelectedPosition] = useState([31.7917, -7.0926]); // Position par défaut du Maroc
  const [filteredRows, setFilteredRows] = useState(rows); // Pour afficher toutes les unités au début
  const [openDialog, setOpenDialog] = useState(false); // État pour gérer le dialogue
  const [selectedImage, setSelectedImage] = useState(""); // État pour l'image sélectionnée

  // Filtrage des UMMC et ULC
  const ummcUnits = rows.filter((row) => row.Nom.includes("UMMC"));
  const ulcUnits = rows.filter((row) => row.Nom.includes("ULC"));

  // Gestion de la sélection UMMC
  const handleUMMCChange = (event) => {
    const unit = ummcUnits.find((unit) => unit.Nom === event.target.value);
    setSelectedUMMC(event.target.value);
    setSelectedPosition(unit.Position.split(",").map(Number)); // Mise à jour de la position
    setFilteredRows([unit]); // Affichage de l'unité UMMC sélectionnée
  };

  // Gestion de la sélection ULC
  const handleULCChange = (event) => {
    const unit = ulcUnits.find((unit) => unit.Nom === event.target.value);
    setSelectedULC(event.target.value);
    setSelectedPosition(unit.Position.split(",").map(Number)); // Mise à jour de la position
    setFilteredRows([unit]); // Affichage de l'unité ULC sélectionnée
  };

  // Fonction pour ouvrir le dialogue avec l'image de l'unité
  const handleMarkerClick = (image) => {
    setSelectedImage(image); // Définir l'image sélectionnée
    setOpenDialog(true); // Ouvrir le dialogue
  };

  // Fonction pour fermer le dialogue
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedImage(""); // Réinitialiser l'image sélectionnée
  };

  return (
    <>
      <Location />
      {/* <div className="flex justify-evenly items-center mt-4">
        <img src={Morroco} alt="Morroco" className="w-24 h-24 object-contain" />
        <img src={SCX} alt="SCX" className="w-24 h-24 object-contain" />
        <img
          src={FondationM6}
          alt="FondationM6"
          className="w-24 h-24 object-contain"
        />
      </div> */}

      <div className="flex justify-center items-center gap-x-6 mt-4">
        {/* Sélection pour UMMC */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="select-ummc-label">
            Sélectionnez une unité UMMC
          </InputLabel>
          <Select
            labelId="select-ummc-label"
            value={selectedUMMC}
            onChange={handleUMMCChange}
          >
            {ummcUnits.map((unit) => (
              <MenuItem key={unit.id} value={unit.Nom}>
                {unit.Nom} - {unit.Région}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sélection pour ULC */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="select-ulc-label">
            Sélectionnez une unité ULC
          </InputLabel>
          <Select
            labelId="select-ulc-label"
            value={selectedULC}
            onChange={handleULCChange}
          >
            {ulcUnits.map((unit) => (
              <MenuItem key={unit.id} value={unit.Nom}>
                {unit.Nom} - {unit.Région}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Carte pour afficher toutes les unités */}
      <div className="mt-8">
        <MapContainer
          center={selectedPosition} // Position basée sur la sélection
          zoom={6}
          style={{ height: "600px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Affichage des marqueurs avec des couleurs différentes pour UMMC et ULC */}
          {filteredRows.map((unit) => {
            const position = unit.Position.split(",").map(Number);
            if (!position || position.length !== 2) return null; // Vérifiez la validité de la position

            return (
              <Marker
                key={unit.id}
                position={position}
                icon={unit.Nom.includes("UMMC") ? ummcIcon : ulcIcon}
              >
                <Popup>
                  {unit.Nom} - {unit.Région}
                  <div>
                    <Button
                      onClick={() => handleMarkerClick(unit.Image)} // Utilisez la fonction correctement ici
                      variant="contained"
                    >
                      Consulter l'unité
                    </Button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Dialogue pour afficher l'image de l'unité */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Image de l'unité</DialogTitle>
        <DialogContent>
          <img src={selectedImage} alt="Unité" style={{ width: "100%" }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Info;
