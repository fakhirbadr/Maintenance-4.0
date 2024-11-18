import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "@mui/material";
import L from "leaflet";
import customIconUrl from "../actifs/1.png";

const MapModal = ({ position, setMapModalIsOpen }) => {
  const theme = useTheme();
  const textColor =
    theme.palette.mode === "dark" ? "text-orange-500" : "text-blue-500";

  const latitude = position?.lat || 0;
  const longitude = position?.long || 0;

  const customIcon = L.icon({
    iconUrl: customIconUrl,
    iconSize: [25, 25],
    iconAnchor: [11, 11],
    popupAnchor: [1, -34],
  });

  // Close modal when clicking outside the map
  const handleClose = (e) => {
    e.stopPropagation();
    setMapModalIsOpen(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={handleClose}
    >
      <div
        className="bg-white p-4 rounded-md shadow-lg sm:justify-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2 className={`text-xl mb-4 ${textColor}`}>Carte pour la position</h2>
        <div style={{ height: "400px", width: "600px" }}>
          <MapContainer
            center={[latitude, longitude]}
            zoom={10}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <Marker position={[latitude, longitude]} icon={customIcon}>
              <Popup>
                Position: {latitude}, {longitude}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
