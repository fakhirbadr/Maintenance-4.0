import React, { useState } from "react";
import Location from "../../components/Location";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import ModelMaintenance from "./ModelMaintenance.jsx";
import ModelFourniture from "./ModelFourniture.jsx";
import myImage from "./4.jpg";
import myImage2 from "./3.jpg";
import myImage5 from "./5.jpg";
import myImage6 from "./6.png";
import ModelVehicule from "./ModelVehicule";
import ModelRetour from "./ModelRetour"; // Nouveau composant modal
import { Grid, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

const Ticket = () => {
  const theme = useTheme();
  const [openMaintenance, setOpenMaintenance] = useState(false);
  const [openFourniture, setOpenFourniture] = useState(false);
  const [openVehicule, setOpenVehicule] = useState(false);
  const [openRetour, setOpenRetour] = useState(false); // État pour le nouveau modal

  // Styles cohérents avec le dark mode
  const cardStyles = {
    maxWidth: "100%",
    height: "100%",
    bgcolor: theme.palette.background.paper,
    transition: "transform 0.2s",
    "&:hover": {
      transform: "scale(1.02)",
      boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}`,
    },
  };

  return (
    <>
      <Location />
      <div className="h-[calc(100dvh-var(--upbar-height))] px-7 flex justify-center space-x-4 flex-col gap-y-5 md:flex-col w-full">
        <Grid container spacing={3} justifyContent="center">
          {/* Intervention Technique */}
          <Grid item xs={12} sm={8} md={3}>
            <Card sx={cardStyles}>
              <CardActionArea onClick={() => setOpenMaintenance(true)}>
                <CardMedia
                  component="img"
                  image={myImage2}
                  alt="Demande d'intervention technique"
                  sx={{
                    height: { xs: 100, md: 200 },
                    objectFit: "cover",
                    filter: "brightness(0.8)",
                  }}
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{ color: theme.palette.primary.light }}
                  >
                    Intervention Technique
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: { xs: "none", md: "block" },
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Signalement de panne ou demande de maintenance préventive
                    pour équipements industriels.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          {/* Commande Matériel */}
          <Grid item xs={12} sm={8} md={3}>
            <Card sx={cardStyles}>
              <CardActionArea onClick={() => setOpenFourniture(true)}>
                <CardMedia
                  component="img"
                  image={myImage}
                  alt="Commande de matériel"
                  sx={{
                    height: { xs: 100, md: 200 },
                    objectFit: "cover",
                    filter: "brightness(0.8)",
                  }}
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{ color: theme.palette.primary.light }}
                  >
                    Commande Matériel
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: { xs: "none", md: "block" },
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Demande d'achat de fournitures, pièces détachées ou
                    équipements spécifiques.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          {/* Service Véhicule */}
          <Grid item xs={12} sm={8} md={3}>
            <Card sx={cardStyles}>
              <CardActionArea onClick={() => setOpenVehicule(true)}>
                <CardMedia
                  component="img"
                  image={myImage5}
                  alt="Gestion de véhicule"
                  sx={{
                    height: { xs: 100, md: 200 },
                    objectFit: "cover",
                    filter: "brightness(0.8)",
                  }}
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{ color: theme.palette.primary.light }}
                  >
                    Service Véhicule
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: { xs: "none", md: "block" },
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Réservation de véhicule ou demande d'intervention mécanique
                    d'urgence.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          {/* Retour d'Équipement - Nouvelle carte */}
          {/* <Grid item xs={12} sm={8} md={3}>
            <Card sx={cardStyles}>
              <CardActionArea onClick={() => setOpenRetour(true)}>
                <CardMedia
                  component="img"
                  image={myImage6}
                  alt="Retour d'équipement"
                  sx={{
                    height: { xs: 100, md: 200 },
                    objectFit: "cover",
                    filter: "brightness(0.8)",
                  }}
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{ color: theme.palette.primary.light }}
                  >
                    Retour d'Équipement
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: { xs: "none", md: "block" },
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Signalement d'un équipement défectueux ou demande de retour
                    de matériel en fin d'utilisation.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid> */}
        </Grid>
      </div>

      {/* Modals */}
      <ModelMaintenance
        open={openMaintenance}
        onClose={() => setOpenMaintenance(false)}
      />
      <ModelFourniture
        open={openFourniture}
        onClose={() => setOpenFourniture(false)}
      />
      <ModelVehicule
        open={openVehicule}
        onClose={() => setOpenVehicule(false)}
      />
      <ModelRetour open={openRetour} onClose={() => setOpenRetour(false)} />
    </>
  );
};

export default Ticket;
