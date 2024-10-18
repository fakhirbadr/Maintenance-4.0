import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ImageOverlay,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "@mui/material";
import customIconUrl from "../actifs/1.png";

const MapModal = ({ position, setMapModalIsOpen }) => {
  const theme = useTheme();
  // Définir les coordonnées du marqueur
  const coordinates = position ? position.split(",") : [0, 0];
  const [latitude, longitude] = coordinates.map((coord) => parseFloat(coord));
  const textColor =
    theme.palette.mode === "dark" ? "text-orange-500" : "text-blue-500";

  const customIcon = L.icon({
    iconUrl: customIconUrl, // L'URL de l'image de l'icône
    iconSize: [44, 44], // Taille de l'icône
    iconAnchor: [22, 22], // Point d'ancrage de l'icône
    popupAnchor: [1, -34], // Point d'ancrage du popup
    shadowUrl: null, // Si vous avez une ombre pour l'icône
    shadowSize: null, // Taille de l'ombre
  });

  return (
    <div className="bg-white p-4 rounded-md shadow-lg sm:justify-center">
      <h2 className={`text-xl mb-4 ${textColor}`}>Carte pour la position</h2>
      <div style={{ height: "400px", width: "600px" }}>
        <MapContainer
          center={[latitude, longitude]}
          zoom={10}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[latitude, longitude]} icon={customIcon}>
            <Popup>
              Position: {latitude}, {longitude}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setMapModalIsOpen(false)}
      >
        Fermer
      </button>
    </div>
  );
};

export default MapModal;
