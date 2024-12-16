import React, { useState } from "react";
import { Grid, Typography, Menu, MenuItem, Button, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Mttr = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const regions = [
    "Casablanca-Settat",
    "Rabat-Salé-Kénitra",
    "Tanger-Tétouan-Al Hoceïma",
    "Fès-Meknès",
    "Marrakech-Safi",
    "Souss-Massa",
    "Oriental",
    "Béni Mellal-Khénifra",
    "Dakhla-Oued Ed-Dahab",
    "Laâyoune-Sakia El Hamra",
    "Guelmim-Oued Noun",
    "Drâa-Tafilalet",
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Ouvre le menu
  };

  const handleClose = () => {
    setAnchorEl(null); // Ferme le menu
  };

  const handleSelectRegion = (region) => {
    console.log(`Region selected: ${region}`); // Logique lors de la sélection d'une région
    handleClose(); // Fermer le menu
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === "dark" ? "#1E1E1E" : "#FFFFFF",
        color: theme.palette.text.primary,
        minHeight: 240,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      <Box sx={{ mt: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ textTransform: "uppercase", fontWeight: "bold" }}
        >
          Temps moyen de réparation
        </Typography>
        <Typography variant="body2" textAlign="center" mt={1}>
          Le temps moyen nécessaire pour réparer un système défaillant et le
          restaurer dans toutes ses fonctions
        </Typography>
      </Box>
      {/* Grille principale */}
      <Grid container sx={{ flexGrow: 1 }}>
        {/* Section MTTR */}
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRight: "1px solid #444", // Ligne séparatrice
          }}
        >
          <Typography variant="h6">43min 56s</Typography>
        </Grid>

        {/* Section Filtre avec bouton menu */}
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={handleClick}
            sx={{
              textTransform: "none",
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            }}
          >
            Sélectionner une région
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {regions.map((region, index) => (
              <MenuItem key={index} onClick={() => handleSelectRegion(region)}>
                {region}
              </MenuItem>
            ))}
          </Menu>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Mttr;
