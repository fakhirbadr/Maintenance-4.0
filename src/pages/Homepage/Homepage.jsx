import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";

const Homepage = () => {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleMouseEnter = (title, description) => {
    setHoveredButton({ title, description });
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  return (
    <div className="relative flex items-center justify-between h-[50rem] px-20">
      {/* Logo central semi-transparent */}
      <img
        src="/scx.png"
        alt="SCX Logo"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30 z-0"
        style={{ width: "600px", height: "300px" }}
      />

      {/* Ligne SVG */}
      <svg
        className="absolute top-1/2 left-0 right-0 z-0"
        height="2"
        width="100%"
      >
        <line x1="10%" y1="0" x2="90%" y2="0" className="line floating" />
      </svg>

      {/* Bouton HR SCX */}
      <button
        onMouseEnter={() =>
          handleMouseEnter(
            "HR SCX Management",
            "Gestion des ressources humaines"
          )
        }
        onMouseLeave={handleMouseLeave}
        onClick={() => navigate("/hr")}
        className="w-40 h-40 rounded-full bg-cover bg-center shadow-xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all z-10"
        style={{ backgroundImage: "url('/SCX TECHNOLOGY.png')" }}
      ></button>

      {/* Bouton NEXTSCAN */}
      <button
        onMouseEnter={() =>
          handleMouseEnter("NEXTSCAN", "Système de gestion des actifs")
        }
        onMouseLeave={handleMouseLeave}
        onClick={() => alert("NEXTSCAN clicked!")}
        className="w-40 h-40 rounded-full bg-cover bg-center shadow-xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all z-10"
        style={{ backgroundImage: "url('/scxlogo.png')" }}
      ></button>

      {/* Bouton SCX Media */}
      <button
        onMouseEnter={() =>
          handleMouseEnter("SCX Media", "Plateforme média interne")
        }
        onMouseLeave={handleMouseLeave}
        onClick={() => navigate("/test")}
        className="w-40 h-40 rounded-full bg-cover bg-center shadow-xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all z-10"
        style={{ backgroundImage: "url('/SCXmediot.png')" }}
      ></button>

      {/* Carte d'information au survol */}
      {hoveredButton && (
        <div className="card absolute bottom-20 left-1/2 transform -translate-x-1/2 w-72 bg-white p-4 rounded-lg shadow-xl">
          <h3 className="text-lg font-semibold text-black">
            {hoveredButton.title}
          </h3>
          <p className="text-black">{hoveredButton.description}</p>
        </div>
      )}
    </div>
  );
};

export default Homepage;
