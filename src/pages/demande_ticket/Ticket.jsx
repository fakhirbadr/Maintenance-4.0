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
import myImage5 from "./5.jpg"; // Adjust the path according to where the image is located.
import ModelVehicule from "./ModelVehicule";
import { Grid } from "@mui/material";

const Ticket = () => {
  const [openMaintenance, setOpenMaintenance] = useState(false); // State to handle maintenance modal
  const [openFourniture, setOpenFourniture] = useState(false); // State to handle fourniture modal
  const [openVehicule, setOpenVehicule] = useState(false);

  // Function to handle opening the behicule modal
  const handleOpenvehiculee = () => {
    setOpenVehicule(true);
  };

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
    setOpenVehicule(false);
  };

  return (
    <>
      <Location />
      <div className="h-[calc(100dvh-var(--upbar-height))] px-7 flex justify-center space-x-4 flex-col gap-y-5 md:flex-col w-full">
        {/* Card Grid */}
        <Grid container spacing={3} justifyContent="center">
          {/* Maintenance Ticket */}
          <Grid item xs={12} sm={8} md={3}>
            <Card sx={{ maxWidth: "100%", height: "100%" }}>
              <CardActionArea onClick={handleOpenMaintenance}>
                <CardMedia
                  component="img"
                  image={myImage2}
                  alt="Création d'un ticket de maintenance"
                  sx={{
                    height: { xs: 100, md: 200 }, // Responsive height for the image
                    objectFit: "cover",
                  }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    Création d'un ticket de maintenance
                  </Typography>
                  {/* Responsive text visibility */}
                  <Typography
                    variant="body2"
                    sx={{
                      display: { xs: "none", md: "block" }, // Hide on small screens
                      color: "text.secondary",
                    }}
                  >
                    Veuillez remplir le formulaire ci-dessous afin de soumettre
                    une demande de maintenance.
                    <br /> Cette procédure permet de garantir un suivi efficace
                    et rapide pour résoudre tout problème lié à l'équipement.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          {/* Supplies Ticket */}
          <Grid item xs={12} sm={8} md={3}>
            <Card sx={{ maxWidth: "100%", height: "100%" }}>
              <CardActionArea onClick={handleOpenFourniture}>
                <CardMedia
                  component="img"
                  image={myImage}
                  alt="Création d'un ticket commande"
                  sx={{
                    height: { xs: 100, md: 200 },
                    objectFit: "cover",
                  }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    Création d'un ticket commande
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: { xs: "none", md: "block" },
                      color: "text.secondary",
                    }}
                  >
                    Pour une demande de matériel industriel ou informatique, ou
                    n'importe quelle autre demande, veuillez remplir le
                    formulaire. Si vous avez des doutes concernant la procédure
                    ou si la demande n'est pas nécessaire, n'hésitez pas à
                    contacter notre support technique.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          {/* Vehicle Ticket */}
          <Grid item xs={12} sm={8} md={3}>
            <Card sx={{ maxWidth: "100%", height: "100%" }}>
              <CardActionArea onClick={handleOpenvehiculee}>
                <CardMedia
                  component="img"
                  image={myImage5}
                  alt="Création d'un ticket pour véhicule"
                  sx={{
                    height: { xs: 100, md: 200 },
                    objectFit: "cover",
                  }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    Création d'un ticket pour véhicule
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: { xs: "none", md: "block" },
                      color: "text.secondary",
                    }}
                  >
                    Pour toute demande de matériel industriel, informatique, ou
                    autre, veuillez remplir le formulaire ci-dessous. En cas de
                    doute sur la procédure ou si vous n'êtes pas sûr de la
                    nécessité de la demande, n'hésitez pas à demander de l'aide.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </div>

      {/* Use separate modals for each ticket */}
      <ModelMaintenance open={openMaintenance} onClose={handleClose} />
      <ModelFourniture open={openFourniture} onClose={handleClose} />
      <ModelVehicule open={openVehicule} onClose={handleClose} />
    </>
  );
};

export default Ticket;
