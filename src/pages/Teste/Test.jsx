import { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import leafletImage from "leaflet-image";
import { jsPDF } from "jspdf"; // Importer jsPDF

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerGreenIcon from "../Teste/markerGreenIcon.png";

const greenIcon = new L.Icon({
  iconUrl: markerGreenIcon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Test = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      matriculation: "ABC-123",
      name: "Livraison 1",
      status: "En cours",
      latitude: 33.5731,
      longitude: -7.5898,
      path: [[33.5731, -7.5898]],
    },
    {
      id: 2,
      matriculation: "XYZ-456",
      name: "Livraison 2",
      status: "Complétée",
      latitude: 34.0209,
      longitude: -6.8416,
      path: [[34.0209, -6.8416]],
    },
  ]);

  const [mapRef, setMapRef] = useState(null);

  const simulatePositionChange = () => {
    setDeliveries((prevDeliveries) =>
      prevDeliveries.map((delivery) => {
        const newLatitude = delivery.latitude + (Math.random() - 0.5) * 0.01;
        const newLongitude = delivery.longitude + (Math.random() - 0.5) * 0.01;
        return {
          ...delivery,
          latitude: newLatitude,
          longitude: newLongitude,
          path: [...delivery.path, [newLatitude, newLongitude]],
        };
      })
    );
  };

  useEffect(() => {
    const interval = setInterval(simulatePositionChange, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredDeliveries = deliveries.filter(
    (delivery) =>
      delivery.matriculation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeliveryClick = (delivery) => {
    setSelectedDelivery(delivery.id);
    if (mapRef) {
      const position = [delivery.latitude, delivery.longitude];
      mapRef.setView(position, 14);
    }
  };

  const generateReport = () => {
    if (selectedDelivery !== null) {
      const delivery = deliveries.find((d) => d.id === selectedDelivery);
      const doc = new jsPDF();

      // Add delivery info to PDF
      doc.text("Rapport de Livraison", 10, 10);
      doc.text(`Matriculation: ${delivery.matriculation}`, 10, 20);
      doc.text(`Nom: ${delivery.name}`, 10, 30);
      doc.text(`Statut: ${delivery.status}`, 10, 40);
      doc.text(
        `Position: (${delivery.latitude}, ${delivery.longitude})`,
        10,
        50
      );

      // Add path points
      doc.text("Trajet:", 10, 60);
      delivery.path.forEach((point, index) => {
        doc.text(
          `Point ${index + 1}: (${point[0].toFixed(4)}, ${point[1].toFixed(
            4
          )})`,
          10,
          70 + index * 10
        );
      });

      // Ensure mapRef is defined before capturing
      if (mapRef) {
        leafletImage(mapRef.leafletElement, function (err, canvas) {
          if (err) {
            console.error("Erreur lors de la capture de la carte :", err);
            return;
          }

          const imgData = canvas.toDataURL("image/png");
          doc.addImage(imgData, "PNG", 10, 10, 180, 100); // Adjust dimensions as necessary
          doc.save(`rapport_livraison_${delivery.matriculation}.pdf`);
        });
      } else {
        console.error("La référence de la carte n'est pas disponible.");
      }
    } else {
      alert("Veuillez sélectionner une livraison pour générer un rapport.");
    }
  };

  const textColor =
    theme.palette.mode === "dark" ? "text-orange-500" : "text-blue-500";

  return (
    <div>
      <h2
        className={`mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl uppercase ${textColor}`}
      >
        LIVRAISON
      </h2>

      <input
        type="text"
        className="border border-gray-300 p-2 rounded mb-4 w-full text-black"
        placeholder="Rechercher par matriculation ou nom..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="p-2">Matriculation</th>
              <th className="p-2">Nom</th>
              <th className="p-2">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeliveries.map((delivery) => (
              <tr
                key={delivery.id}
                className={`border-b cursor-pointer ${
                  selectedDelivery === delivery.id ? "bg-blue-200" : ""
                }`}
                onClick={() => handleDeliveryClick(delivery)}
              >
                <td className="p-2">{delivery.matriculation}</td>
                <td className="p-2">{delivery.name}</td>
                <td className="p-2">{delivery.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-bold mb-2">Outils de Suivi de Livraison</h2>
        <div className="flex space-x-4">
          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={simulatePositionChange}
          >
            Changer la position
          </button>
          <button
            className="bg-green-500 text-white p-2 rounded"
            onClick={generateReport}
          >
            Générer un rapport
          </button>
          <button className="bg-red-500 text-white p-2 rounded">
            Configurer les notifications
          </button>
        </div>
      </div>

      <div className="mt-6">
        <MapContainer
          center={[31.7917, -7.0926]}
          zoom={6}
          className="h-96 w-full"
          whenCreated={setMapRef}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {deliveries.map((delivery) => (
            <Marker
              key={delivery.id}
              position={[delivery.latitude, delivery.longitude]}
              icon={greenIcon}
            >
              <Popup>
                {delivery.name} - {delivery.matriculation}
              </Popup>
            </Marker>
          ))}
          {deliveries
            .filter(
              (delivery) =>
                selectedDelivery === null || selectedDelivery === delivery.id
            )
            .map((delivery) => (
              <Polyline
                key={delivery.id}
                positions={delivery.path}
                color="blue"
                dashArray="5"
                lineCap="round"
                weight={5}
              />
            ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Test;
