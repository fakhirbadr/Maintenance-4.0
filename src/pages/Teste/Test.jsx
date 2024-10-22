import React from "react";
import jsPDF from "jspdf";

const Test = () => {
  const mapboxStaticMapURL = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+555555(-7.589843,33.57311)/-7.589843,33.57311,13/600x400?access_token=YOUR_MAPBOX_ACCESS_TOKEN`;

  const generatePDF = () => {
    const doc = new jsPDF();

    const image = new Image();
    image.src = mapboxStaticMapURL;
    image.onload = function () {
      doc.text("Carte statique - Casablanca", 10, 10);
      doc.addImage(image, "JPEG", 10, 20, 180, 150);
      doc.save("map.pdf");
    };
  };

  return (
    <div>
      <h2>Carte statique de Casablanca</h2>
      <img
        src={mapboxStaticMapURL}
        alt="Static Map"
        style={{ width: "100%", height: "400px" }}
      />
      <button onClick={generatePDF}>Générer le PDF</button>
    </div>
  );
};

export default Test;
