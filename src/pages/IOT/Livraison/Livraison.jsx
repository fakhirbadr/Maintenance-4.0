import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import Location from "../../../components/Location";
import Vehicule from "./vehicule/Vehicule";
import Config from "./configuration/Config";
import Historique from "./historique/Historique";
import Stats from "./State/Stats";

const Livraison = () => {
  const [value, setValue] = useState(0); // Début à 0 pour le premier onglet

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      {/* Titre de la page */}
      <Box sx={{ padding: 2 }}>
        <Location />
      </Box>

      {/* Onglets pour les différentes sections */}
      <Box className="justify-center items-start">
        <Tabs value={value} onChange={handleChange} aria-label="Livraison tabs">
          <Tab label="Véhicule " />
          <Tab label="Configue " />
          <Tab label="Maps " />
          <Tab label="Historique" />
          <Tab label="stats" />
        </Tabs>

        {/* Contenu qui change selon l'onglet sélectionné */}
        <Box sx={{ padding: 2 }}>
          {value === 0 && (
            <Box>
              <div>
                <Vehicule />
              </div>
            </Box>
          )}
          {value === 1 && (
            <Box>
              <div>
                <Config />
              </div>
            </Box>
          )}
          {value === 2 && (
            <Box>
              <div>
                <Maps />
              </div>{" "}
            </Box>
          )}
          {value === 3 && (
            <Box>
              <div>
                <Historique />
              </div>{" "}
            </Box>
          )}
          {value === 4 && (
            <Box>
              <div>
                <Stats />
              </div>{" "}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Livraison;
