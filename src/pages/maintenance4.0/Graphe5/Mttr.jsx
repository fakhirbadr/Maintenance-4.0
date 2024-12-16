import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Menu,
  MenuItem,
  Button,
  Box,
  Select,
  InputLabel,
  FormControl,
  MenuItem as MuiMenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";

const Mttr = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mttr, setMttr] = useState(null); // State to store the calculated MTTR
  const [regions, setRegions] = useState([
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
  ]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [sites, setSites] = useState([]); // State to store sites for the selected region
  const [selectedSite, setSelectedSite] = useState(""); // State to store selected site

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Open the menu
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the menu
  };

  const handleSelectRegion = (region) => {
    setSelectedRegion(region);
    setSelectedSite(""); // Reset selected site when region changes
    handleClose(); // Close the menu after selecting a region
  };

  const handleSelectSite = (site) => {
    setSelectedSite(site);
  };

  useEffect(() => {
    if (selectedRegion) {
      // Fetch maintenance ticket data for the selected region
      axios
        .get(
          `http://localhost:3000/api/v1/ticketMaintenance?isClosed=true&currentMonth=true&province=${selectedRegion}`
        )
        .then((response) => {
          const data = response.data;

          // Get unique sites for the selected region
          const uniqueSites = [...new Set(data.map((ticket) => ticket.site))];
          setSites(uniqueSites);

          const totalMinutes = data.reduce((total, ticket) => {
            const resolutionTime = ticket.tempsDeResolutionDetaille;
            const [days, hours, minutes] = resolutionTime
              .split(" ")
              .map((time) => parseInt(time));
            const totalTicketMinutes = days * 24 * 60 + hours * 60 + minutes;
            return total + totalTicketMinutes;
          }, 0);

          const averageMttr = totalMinutes / data.length; // Calculate average MTTR
          setMttr(averageMttr);
        })
        .catch((error) => {
          console.error("Error fetching data", error);
        });
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedRegion && selectedSite) {
      // Fetch maintenance ticket data for the selected site and region
      axios
        .get(
          `http://localhost:3000/api/v1/ticketMaintenance?isClosed=true&currentMonth=true&province=${selectedRegion}&site=${selectedSite}`
        )
        .then((response) => {
          const data = response.data;
          const totalMinutes = data.reduce((total, ticket) => {
            const resolutionTime = ticket.tempsDeResolutionDetaille;
            const [days, hours, minutes] = resolutionTime
              .split(" ")
              .map((time) => parseInt(time));
            const totalTicketMinutes = days * 24 * 60 + hours * 60 + minutes;
            return total + totalTicketMinutes;
          }, 0);

          const averageMttr = totalMinutes / data.length; // Calculate average MTTR
          setMttr(averageMttr);
        })
        .catch((error) => {
          console.error("Error fetching data for selected site", error);
        });
    }
  }, [selectedRegion, selectedSite]);

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
      <Grid container sx={{ flexGrow: 1 }}>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRight: "1px solid #444", // Line separator
          }}
        >
          {/* Display average MTTR with two decimal places */}
          <Typography variant="h6">
            {mttr
              ? `${Math.floor(mttr / 60)}h ${(mttr % 60).toFixed(2)}m`
              : "Loading..."}
          </Typography>
        </Grid>

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

          {/* Site filter dropdown */}
          {selectedRegion && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="site-select-label">
                Sélectionner un site
              </InputLabel>
              <Select
                labelId="site-select-label"
                value={selectedSite}
                onChange={(e) => handleSelectSite(e.target.value)}
                label="Sélectionner un site"
              >
                {sites.map((site, index) => (
                  <MuiMenuItem key={index} value={site}>
                    {site}
                  </MuiMenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Mttr;
