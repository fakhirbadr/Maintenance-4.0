import React, { useState, useEffect } from "react";
import Location from "../../components/Location";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import ModelMaintenance from "./ModelMaintenance.jsx";
import ModelFourniture from "./ModelFourniture.jsx";
import ModelPharmaceutique from "./ModelPharmaceutique.jsx";
import myImage from "./4.jpg";
import myImage2 from "./3.jpg";
import myImage5 from "./5.jpg";
import myImage6 from "./6.png";
import myImage7 from "./9.png";
import myImage8 from "./10.jpg";
import myImage9 from "./11.png";
import ModelVehicule from "./ModelVehicule";
import ModelRetour from "./ModelRetour";
import { Grid, useTheme, Box, Container, Fade, Grow } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import ModalSi from "./ModalSi";

const Ticket = () => {
  const theme = useTheme();
  const [openMaintenance, setOpenMaintenance] = useState(false);
  const [openFourniture, setOpenFourniture] = useState(false);
  const [openVehicule, setOpenVehicule] = useState(false);
  const [openRetour, setOpenRetour] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [openProblemeSI, setOpenProblemeSI] = useState(false);
  const [openPharmaceutique, setOpenPharmaceutique] = useState(false);
  const [userRole, setUserRole] = useState("");

  // Récupérer le rôle utilisateur depuis le localStorage
  useEffect(() => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        const obj = JSON.parse(userInfo);
        setUserRole(obj.role || "");
      }
    } catch (e) {
      setUserRole("");
    }
  }, []);

  // Styles améliorés avec animation
  const cardStyles = {
    width: "100%", // Changé de maxWidth à width pour forcer la largeur
    height: "100%",
    bgcolor: theme.palette.background.paper,
    borderRadius: 2,
    overflow: "hidden",
    boxShadow: `0 6px 15px ${alpha(theme.palette.common.black, 0.1)}`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    "&:hover": {
      transform: "translateY(-10px)",
      boxShadow: `0 12px 20px ${alpha(theme.palette.common.black, 0.2)}`,
    },
  };

  const cardMediaStyles = {
    height: { xs: 140, md: 220 }, // Augmenté légèrement la hauteur
    objectFit: "cover",
    transition: "transform 0.5s ease, filter 0.5s ease",
    filter: "brightness(0.85)",
    "&:hover": {
      transform: "scale(1.05)",
      filter: "brightness(1)",
    },
  };

  // Animation variants pour les cartes
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const handleCardHover = (index) => {
    setHoveredCard(index);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  // Données des cartes complètes
  const allCardData = [
    {
      title: "Intervention Technique",
      image: myImage2,
      description:
        "Signalement de panne ou demande de maintenance préventive pour équipements industriels.",
      onClick: () => setOpenMaintenance(true),
    },
    {
      title: "Commande Matériel",
      image: myImage,
      description:
        "Demande d'achat de fournitures, pièces détachées ou équipements spécifiques.",
      onClick: () => setOpenFourniture(true),
    },
     {
      title: "Commande Pharmaceutique",
      image: myImage9,
      description:
        "Demande d'équipements pharmaceutiques : Glucomètre, Lunette oxygène, Ordonnanceur, Gel d'échographie, Drap d'examen, Toise.",
      onClick: () => setOpenPharmaceutique(true),
    },
    {
      title: "Service Véhicule",
      image: myImage5,
      description:
        "Réservation de véhicule ou demande d'intervention mécanique d'urgence.",
      onClick: () => setOpenVehicule(true),
    },
    {
      title: "Transfer Management",
      image: myImage6,
      description:
        "Ce module permet de gérer le déplacement des équipements entre les différentes unités, sites ou zones d’intervention.",
      onClick: () => setOpenRetour(true),
    },
    {
      title: "Problème Système d'Information",
      image: myImage7,
      description:
        "Signalement d'un dysfonctionnement ou d'un incident lié au système d'information.",
      onClick: () => setOpenProblemeSI(true),
    },
   
    //  {
    //   title: "HR Services",
    //   image: myImage8,
    //   description:
    //     "Ce module regroupe toutes vos demandes RH afin de faciliter leur gestion et leur traitement.",
    //   onClick: () => setOpenProblemeSI(true),
    // },
  ];

  // Filtrer les cartes selon le rôle
  const cardData = userRole === "technicien" 
    ? allCardData.filter(card => card.title === "Service Véhicule")
    : allCardData;

  // Configuration de la grille selon le nombre de cartes
  const getGridConfig = () => {
    if (userRole === "technicien") {
      // Pour les techniciens (1 seule carte)
      return {
        container: { justifyContent: "center" },
        item: { xs: 12, md: 6, lg: 4 }
      };
    } else {
      // Pour les autres rôles (6 cartes)
      return {
        container: { justifyContent: "center" },
        item: { xs: 12, md: 6, lg: 2 }
      };
    }
  };

  const gridConfig = getGridConfig();

  return (
    <>
      <Location />
      <Box
        className="h-[calc(100dvh-var(--upbar-height))]"
        sx={{
          background: `linear-gradient(${alpha(
            theme.palette.background.default,
            0.8
          )}, ${alpha(theme.palette.background.default, 1)})`,
          pt: 4,
          pb: 8,
        }}
      >
        <Container maxWidth="xl">
          <Typography
            variant="h4"
            component="h1"
            align="center"
            sx={{
              mb: 5,
              fontWeight: "bold",
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "fadeIn 1s ease-in-out",
              "@keyframes fadeIn": {
                "0%": { opacity: 0, transform: "translateY(-20px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            {userRole === "technicien" ? "Service Véhicule" : "Services Disponibles"}
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3} {...gridConfig.container}>
              {cardData.map((card, index) => (
                <Grid
                  item
                  {...gridConfig.item}
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Grow
                    in={true}
                    timeout={(index + 1) * 400}
                    style={{ transformOrigin: "0 0 0" }}
                  >
                    <Card
                      sx={{
                        ...cardStyles,
                        width: userRole === "technicien" ? "100%" : "90%",
                        maxWidth: userRole === "technicien" ? 400 : 300,
                      }}
                      onMouseEnter={() => handleCardHover(index)}
                      onMouseLeave={handleCardLeave}
                    >
                      <CardActionArea onClick={card.onClick}>
                        <Box sx={{ overflow: "hidden", position: "relative" }}>
                          <CardMedia
                            component="img"
                            image={card.image}
                            alt={card.title}
                            sx={cardMediaStyles}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              background: `linear-gradient(to bottom, transparent 50%, ${alpha(
                                theme.palette.background.paper,
                                0.9
                              )} 100%)`,
                              opacity: hoveredCard === index ? 0.7 : 0.5,
                              transition: "opacity 0.3s ease",
                            }}
                          />
                        </Box>
                        <CardContent sx={{ position: "relative", zIndex: 1 }}>
                          <Typography
                            gutterBottom
                            variant="h6"
                            component="div"
                            sx={{
                              color: theme.palette.primary.light,
                              fontWeight: "bold",
                              transition: "transform 0.3s ease",
                              transform:
                                hoveredCard === index
                                  ? "translateY(-5px)"
                                  : "none",
                            }}
                          >
                            {card.title}
                          </Typography>
                          <Box
                            sx={{
                              width: "40px",
                              height: "3px",
                              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                              mb: 2,
                              transition: "width 0.3s ease",
                              width: hoveredCard === index ? "60px" : "40px",
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              display: { xs: "none", md: "block" },
                              color: theme.palette.text.secondary,
                              opacity: 0.9,
                            }}
                          >
                            {card.description}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Modals - Affichage conditionnel selon le rôle */}
      {userRole !== "technicien" && (
        <>
          <ModelMaintenance
            open={openMaintenance}
            onClose={() => setOpenMaintenance(false)}
          />
          <ModelFourniture
            open={openFourniture}
            onClose={() => setOpenFourniture(false)}
          />
          <ModelRetour open={openRetour} onClose={() => setOpenRetour(false)} />
          <ModalSi open={openProblemeSI} onClose={() => setOpenProblemeSI(false)} />
          <ModelPharmaceutique open={openPharmaceutique} onClose={() => setOpenPharmaceutique(false)} />
        </>
      )}
      
      {/* Modal Véhicule - Toujours disponible */}
      <ModelVehicule
        open={openVehicule}
        onClose={() => setOpenVehicule(false)}
      />
    </>
  );
};

export default Ticket;