import React, { useEffect, useState } from "react";
import Location from "../../components/Location";
import ClotureNonCloture from "./Graph1/ClotureNonCloture";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import BesoinTaux from "./Graphe 2/BesoinTaux";
import BesoinVehicule from "./Graph 3/BesoinVehicule";
import CategorieMaintenance from "./Graph4/CategorieMaintenance";
import Mttr from "./Graphe5/Mttr";
import Tr from "./Graph 6/Tr";
import TypesBesoin from "./graph 7/TypesBesoin";
import CategorieBesoin from "./graph 8/CategorieBesoin";
import Graphtest from "./Graph 9/Graphtest";
import axios from "axios";
import { MenuItem, TextField } from "@mui/material";
import TauxDisponibilité from "./Graphe 11/TauxDisponibilité";

const Dashboard = () => {
  const [regions, setRegions] = useState([]); // Liste des régions depuis l'API
  const [selectedRegion, setSelectedRegion] = useState(""); // Région sélectionnée
  const [province, setProvince] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [actifs, setActifs] = useState([]); // Liste des actifs
  const [filteredActifs, setFilteredActifs] = useState([]); // Actifs filtrés en fonction de la province
  const [closedTicketsCount, setClosedTicketsCount] = useState(0);
  const [fournituresClosed, setFournituresClosed] = useState(0);
  const [selectedActif, setSelectedActif] = useState("");
  const handleActifChange = (event) => {
    setSelectedActif(event.target.value); // Mettez à jour l'actif sélectionné
  };

  const handleTicketsClosedUpdate = (value) => {
    setClosedTicketsCount(value);
  };
  // Callback function to update the state in the parent component
  const handleFournituresClosedUpdate = (closedCount) => {
    setFournituresClosed(closedCount);
  };

  useEffect(() => {
    axios
      .get("https://backend-v1-e3bx.onrender.com/api/actifs")
      .then((response) => {
        const fetchedRegions = response.data.map((item) => item.region); // Extraire les régions
        const uniqueRegions = [...new Set(fetchedRegions)]; // Éviter les doublons
        setRegions(uniqueRegions);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des régions :", error);
      });
  }, []);
  // Fetch provinces based on the selected region
  useEffect(() => {
    if (selectedRegion) {
      axios
        .get(
          `https://backend-v1-e3bx.onrender.com/api/actifs?region=${selectedRegion}`
        )
        .then((response) => {
          const fetchedProvinces = response.data.map((item) => item.province); // Extract provinces
          const uniqueProvinces = [...new Set(fetchedProvinces)]; // Remove duplicates
          setProvince(uniqueProvinces);
        })
        .catch((error) => {
          console.error("Error fetching provinces:", error);
        });
    } else {
      setProvince([]); // Clear provinces if no region is selected
    }
  }, [selectedRegion]); // Trigger fetch when selectedRegion changes
  // Fetch actifs based on the selected region and province
  useEffect(() => {
    if (selectedProvince) {
      axios
        .get(
          `https://backend-v1-e3bx.onrender.com/api/actifs?region=${selectedRegion}&province=${selectedProvince}`
        )
        .then((response) => {
          const fetchedActifs = response.data.map((item) => item.name);
          setFilteredActifs(fetchedActifs);
        })
        .catch((error) => {
          console.error("Error fetching actifs:", error);
        });
    } else {
      setFilteredActifs([]);
    }
  }, [selectedProvince, selectedRegion]);
  // Gérer la sélection de la région
  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
    setSelectedProvince(""); // Reset province selection when region changes
  };
  // Handle province selection
  const handleProvinceChange = (event) => {
    setSelectedProvince(event.target.value);
  };
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: "center",
    color: theme.palette.text.secondary,
    ...theme.applyStyles("dark", {
      backgroundColor: "#1E1E1E",
    }),
  }));
  return (
    <>
      <div className="flex items-center ">
        <div className="mr-auto">
          <Location />
        </div>
        <div className="flex justify-center flex-1  space-x-4">
          <span className="text-center text-base bg-orange-100 text-black py-2 px-1 rounded-lg font-medium">
            Total des interventions :{" "}
            <span className="font-semibold">{closedTicketsCount}</span>
          </span>
          <span className="text-center text-base  bg-orange-100 text-black py-2 px-1 rounded-lg font-medium">
            Total des livraisons :{" "}
            <span className="font-semibold">{fournituresClosed}</span>
          </span>
        </div>
      </div>

      <hr className="w-3/4 pb-4" />

      {/* Barre de filtre */}
      {/* Barre de filtre */}
      <div className="text-black flex items-center justify-center py-2 space-x-4">
        {/* Region Filter */}
        <TextField
          label="Filtrer par Région"
          select
          value={selectedRegion}
          onChange={handleRegionChange}
          variant="outlined"
          size="small"
          sx={{ width: "200px" }}
        >
          <MenuItem value="">Toutes les Régions</MenuItem>
          {regions.map((region) => (
            <MenuItem key={region} value={region}>
              {region}
            </MenuItem>
          ))}
        </TextField>

        {/* Province Filter (always visible, disabled until a region is selected) */}
        <TextField
          label="Filtrer par Province"
          select
          value={selectedProvince}
          onChange={handleProvinceChange}
          variant="outlined"
          size="small"
          sx={{ width: "200px" }}
          disabled={!selectedRegion} // Disable the province filter until a region is selected
        >
          <MenuItem value="">Toutes les Provinces</MenuItem>
          {province.map((prov) => (
            <MenuItem key={prov} value={prov}>
              {prov}
            </MenuItem>
          ))}
        </TextField>
        {/* Filtered Actifs (assets) */}
        {/* <TextField
          label="Filtrer par Actif"
          select
          value={selectedActif}
          onChange={handleActifChange}
          variant="outlined"
          size="small"
          sx={{ width: "200px" }}
          disabled={!selectedProvince} // Désactiver si aucune province n'est sélectionnée
        >
          <MenuItem value="">Tous les Actifs</MenuItem>
          {filteredActifs.map((actif) => (
            <MenuItem key={actif} value={actif}>
              {actif}
            </MenuItem>
          ))}
        </TextField> */}

        {/* Date Filter */}
        <div className="space-x-4">
          <TextField
            label=""
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            variant="outlined"
            size="small"
            sx={{ width: "200px" }}
          />
          <TextField
            label=""
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            variant="outlined"
            size="small"
            sx={{ width: "200px" }}
          />
        </div>
      </div>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={4}>
            <div>
              <ClotureNonCloture
                region={selectedRegion} // Already passing selectedRegion
                province={selectedProvince} // Passing selectedProvince to ClotureNonCloture
                startDate={startDate} // Passing startDate
                endDate={endDate} // Passing endDate
                onTicketsClosedUpdate={handleTicketsClosedUpdate}
                site={selectedActif ? [selectedActif] : undefined} // Ne passer un actif que s'il est sélectionné
              />
            </div>
          </Grid>
          <Grid item xs={12} lg={4}>
            <div>
              <BesoinTaux
                region={selectedRegion}
                province={selectedProvince}
                startDate={startDate} // Passing startDate
                endDate={endDate}
                onFournituresClosedUpdate={handleFournituresClosedUpdate}
              />
            </div>
          </Grid>
          <Grid item xs={12} lg={4}>
            <div>
              <BesoinVehicule />
            </div>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Item sx={{ backgroundColor: "#1E1E1E" }}>
              <CategorieMaintenance
                region={selectedRegion}
                province={selectedProvince}
                startDate={startDate} // Passing startDate
                endDate={endDate} // Passing endDate
              />
            </Item>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Item sx={{ backgroundColor: "#1E1E1E" }}>
              <Graphtest
                region={selectedRegion}
                province={selectedProvince}
                startDate={startDate} // Passing startDate
                endDate={endDate}
              />
            </Item>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Item sx={{ backgroundColor: "#1E1E1E" }}>
              <TauxDisponibilité
                region={selectedRegion}
                province={selectedProvince}
                startDate={startDate} // Passing startDate
                endDate={endDate}
              />
            </Item>
          </Grid>
          <Grid item xs={12} lg={8}>
            <Item>
              <TypesBesoin
                region={selectedRegion}
                province={selectedProvince}
                startDate={startDate} // Passing startDate
                endDate={endDate}
              />
            </Item>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Item sx={{ backgroundColor: "#1E1E1E" }}>
              <CategorieBesoin
                region={selectedRegion}
                province={selectedProvince}
                startDate={startDate} // Passing startDate
                endDate={endDate}
              />
            </Item>
          </Grid>

          {/* <Grid item xs={12} lg={4}>
            <Item>
              <Mttr
                region={selectedRegion}
                province={selectedProvince}
                startDate={startDate} // Passing startDate
                endDate={endDate}
              />
            </Item>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Item>
              <Tr />
            </Item>
          </Grid> */}
        </Grid>
      </Box>
    </>
  );
};

export default Dashboard;
