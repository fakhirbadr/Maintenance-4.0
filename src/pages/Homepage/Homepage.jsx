import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css"; // Import the CSS file

const Homepage = () => {
  const navigate = useNavigate();

  // State to manage the hovered button's content
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleMouseEnter = (title, description) => {
    setHoveredButton({ title, description });
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  return (
    <div className="relative flex items-center justify-between h-[50rem] px-20">
      {/* Ligne SVG derrière les boutons */}
      <svg
        className="absolute top-1/2 left-0 right-0 z-0"
        height="2"
        width="100%"
      >
        <line
          x1="10%"
          y1="0"
          x2="90%"
          y2="0"
          className="line floating" // Add class for the animation
        />
      </svg>

      {/* Asset Management */}
      <button
        onMouseEnter={() => handleMouseEnter("HR SCX Management")}
        onMouseLeave={handleMouseLeave}
        onClick={() => navigate("/hr")}
        className="w-40 h-40 rounded-full bg-cover bg-center shadow-xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all z-10"
        style={{ backgroundImage: "url('/SCX TECHNOLOGY.png')" }}
      ></button>

      {/* NEXTSCAN */}
      <button
        onMouseEnter={() =>
          handleMouseEnter(
            "Asset Management",
            "This button takes you to the Asset Management page."
          )
        }
        onMouseLeave={handleMouseLeave}
        onClick={() => alert("NEXTSCAN clicked!")}
        className="w-40 h-40 rounded-full bg-cover bg-center shadow-xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all z-10"
        style={{ backgroundImage: "url('/scxlogo.png')" }}
      ></button>

      {/* HR Management */}
      <button
        onMouseEnter={() =>
          handleMouseEnter(
            "HR Management",
            "This button takes you to the HR Management page."
          )
        }
        onMouseLeave={handleMouseLeave}
        onClick={() => navigate("/test")}
        className="w-40 h-40 rounded-full bg-cover bg-center shadow-xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all z-10"
        style={{ backgroundImage: "url('/SCXmediot.png')" }}
      ></button>

      {/* Card with explanation */}
      {hoveredButton && (
        <div
          className={`card absolute bottom-20 left-1/2 transform -translate-x-1/2 w-72 bg-white p-4 rounded-lg shadow-xl ${
            hoveredButton ? "visible" : ""
          }`}
        >
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
