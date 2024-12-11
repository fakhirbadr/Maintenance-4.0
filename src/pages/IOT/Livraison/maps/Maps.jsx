import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet styles
import { filteredRows } from "../configuration/Config"; // Import filtered vehicle data

const Maps = () => {
  const defaultPosition = [33.5731, -7.5898]; // Casablanca coordinates as default

  // Initialize state to store vehicle positions and their paths (trajectories)
  const [vehicleData, setVehicleData] = useState(
    filteredRows.map((vehicle) => ({
      ...vehicle,
      position: vehicle.position.split(",").map(Number), // Convert string position to array [lat, long]
      path: [vehicle.position.split(",").map(Number)], // Start with the initial position as the first point in the path
    }))
  );

  // State for selected vehicle type filter
  const [selectedVehicle, setSelectedVehicle] = useState("");

  // Function to randomly adjust vehicle positions for simulation
  const updateVehiclePositions = () => {
    setVehicleData((prevData) =>
      prevData.map((vehicle) => {
        const newLat = vehicle.position[0] + (Math.random() - 0.5) * 0.001; // Slight random change to latitude
        const newLng = vehicle.position[1] + (Math.random() - 0.5) * 0.001; // Slight random change to longitude

        // Update position and add new position to path
        const newPosition = [newLat, newLng];
        return {
          ...vehicle,
          position: newPosition,
          path: [...vehicle.path, newPosition],
        };
      })
    );
  };

  // Use useEffect to update positions every second
  useEffect(() => {
    const interval = setInterval(() => {
      updateVehiclePositions();
    }, 1000); // Update every 1 second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  // Filtered vehicle data based on the selected vehicle
  const filteredVehicleData = selectedVehicle
    ? vehicleData.filter((vehicle) => vehicle.marque === selectedVehicle)
    : vehicleData; // If no vehicle is selected, show all vehicles

  // Get unique vehicle marques for dropdown options
  const uniqueMarques = Array.from(
    new Set(vehicleData.map((vehicle) => vehicle.marque))
  );

  return (
    <div>
      <select
        value={selectedVehicle}
        onChange={(e) => setSelectedVehicle(e.target.value)}
        style={{
          margin: "10px",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          backgroundColor: "black",
        }}
      >
        <option value="">All Vehicles</option>
        {uniqueMarques.map((marque, index) => (
          <option key={index} value={marque}>
            {marque}
          </option>
        ))}
      </select>

      <div style={{ height: "70vh", width: "100%" }}>
        <MapContainer
          center={defaultPosition}
          zoom={17} // Adjust zoom level to cover larger areas
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          maxZoom={18}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {filteredVehicleData.map((vehicle, index) => (
            <div key={index}>
              {/* Marker for the current position */}
              <Marker position={vehicle.position}>
                <Popup>
                  <strong>
                    {vehicle.marque} {vehicle.modele}
                  </strong>
                  <br />
                  Immatriculation: {vehicle.immatriculation}
                  <br />
                  Conducteur: {vehicle.conducteur}
                  <br />
                  Localisation: {vehicle.localisation}
                </Popup>
              </Marker>

              {/* Polyline for the trajectory */}
              <Polyline positions={vehicle.path} color="blue" />
            </div>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Maps;
