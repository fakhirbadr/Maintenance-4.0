import React, { useState } from "react";
import Location from "../../components/Location";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import ModelMaintenance from "./ModelMaintenance.jsx"; // Modal for maintenance
import ModelFourniture from "./ModelFourniture.jsx"; // Modal for fourniture
import myImage from "./4.jpg"; // Adjust the path according to where the image is located.
import myImage2 from "./3.jpg"; // Adjust the path according to where the image is located.

const Ticket = () => {
  const [openMaintenance, setOpenMaintenance] = useState(false); // State to handle maintenance modal
  const [openFourniture, setOpenFourniture] = useState(false); // State to handle fourniture modal

  // Function to handle opening the maintenance modal
  const handleOpenMaintenance = () => {
    setOpenMaintenance(true);
  };

  // Function to handle opening the fourniture modal
  const handleOpenFourniture = () => {
    setOpenFourniture(true);
  };

  // Function to handle closing the modals
  const handleClose = () => {
    setOpenMaintenance(false);
    setOpenFourniture(false);
  };

  return (
    <>
      <Location />
      <div className="fixed flex justify-center items-center inset-0 bg-black z-50 bg-opacity-0">
        <div className="flex justify-center items-center space-x-4">
          {/* Card for maintenance ticket */}
          <div>
            <Card sx={{ maxWidth: 1045, maxHeight: 1100 }}>
              <CardActionArea onClick={handleOpenMaintenance}>
                {/* Trigger modal for maintenance */}
                <CardMedia
                  component="img"
                  image={myImage2}
                  alt="green iguana"
                  sx={{
                    height: "345px",
                    width: "600px",
                    objectFit: "cover",
                  }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Création d'un ticket de maintenance
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Veuillez remplir le formulaire ci-dessous afin de soumettre
                    une demande de maintenance.
                    <br /> Cette procédure permet de garantir un suivi efficace
                    et rapide pour résoudre tout
                    <br /> problème lié à l'équipement.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>

          {/* Card for supplies ticket */}
          <div>
            <Card sx={{ maxWidth: 1045, maxHeight: 1100 }}>
              <CardActionArea onClick={handleOpenFourniture}>
                {/* Trigger modal for fourniture */}
                <CardMedia
                  component="img"
                  image={myImage}
                  alt="green iguana"
                  sx={{
                    height: "345px",
                    width: "600px",
                    objectFit: "cover",
                  }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Ticket Fourniture
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Pour une demande de matériel industriel ou informatique, ou
                    n'importe quelle autre
                    <br /> demande, veuillez remplir le formulaire. Si vous avez
                    des doutes concernant la procédure
                    <br /> ou si la demande n'est pas nécessaire, n'hésitez pas
                    à contacter notre support technique .
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
        </div>
      </div>

      {/* Use separate modals for each ticket */}
      <ModelMaintenance open={openMaintenance} onClose={handleClose} />
      <ModelFourniture open={openFourniture} onClose={handleClose} />
    </>
  );
};

export default Ticket;
