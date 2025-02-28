import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
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
import GlobalGraph from "./Graph Globale/GlobalGraph";
import Index from "./Tablekpiv2/Index";

// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

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
  const [totalClosed, setTotalClosed] = useState(null);
  const hasFetchedRegionsRef = useRef(false); // Référence pour suivre si les régions ont déjà été chargées

  // Callback pour mettre à jour le nombre de tickets fermés
  const handleTicketsClosedUpdate = useCallback((value) => {
    setClosedTicketsCount(value);
  }, []);

  // Callback pour mettre à jour le nombre de fournitures fermées
  const handleFournituresClosedUpdate = useCallback((closedCount) => {
    setFournituresClosed(closedCount);
  }, []);

  // Callback pour mettre à jour le total des tickets fermés
  const handleTotalClosed = useCallback((value) => {
    setTotalClosed(value);
  }, []);

  // Gérer la sélection de la région
  const handleRegionChange = useCallback((event) => {
    setSelectedRegion(event.target.value);
    setSelectedProvince(""); // Reset province selection when region changes
  }, []);

  // Gérer la sélection de la province
  const handleProvinceChange = useCallback((event) => {
    setSelectedProvince(event.target.value);
  }, []);

  // Gérer la sélection de la date de début
  const handleStartDateChange = useCallback((e) => {
    setStartDate(e.target.value);
  }, []);

  // Gérer la sélection de la date de fin
  const handleEndDateChange = useCallback((e) => {
    setEndDate(e.target.value);
  }, []);

  // Gérer la sélection de l'actif
  const handleActifChange = useCallback((event) => {
    setSelectedActif(event.target.value);
  }, []);

  // Récupérer les régions depuis l'API
  useEffect(() => {
    if (hasFetchedRegionsRef.current) return; // Ne pas relancer la requête si les régions ont déjà été chargées

    axios
      .get(`${apiUrl}/api/actifs`)
      .then((response) => {
        const fetchedRegions = response.data.map((item) => item.region); // Extraire les régions
        const uniqueRegions = [...new Set(fetchedRegions)]; // Éviter les doublons
        setRegions(uniqueRegions);
        hasFetchedRegionsRef.current = true; // Marquer les régions comme chargées
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des régions :", error);
      });
  }, []);

  // Récupérer les provinces en fonction de la région sélectionnée
  useEffect(() => {
    if (selectedRegion) {
      axios
        .get(`${apiUrl}/api/actifs?region=${selectedRegion}`)
        .then((response) => {
          const fetchedProvinces = response.data.map((item) => item.province); // Extraire les provinces
          const uniqueProvinces = [...new Set(fetchedProvinces)]; // Éviter les doublons
          setProvince(uniqueProvinces);
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des provinces :",
            error
          );
        });
    } else {
      setProvince([]); // Réinitialiser les provinces si aucune région n'est sélectionnée
    }
  }, [selectedRegion]);

  // Récupérer les actifs en fonction de la province sélectionnée
  useEffect(() => {
    if (selectedProvince) {
      axios
        .get(
          `${apiUrl}/api/actifs?region=${selectedRegion}&province=${selectedProvince}`
        )
        .then((response) => {
          const fetchedActifs = response.data.map((item) => item.name);
          setFilteredActifs(fetchedActifs);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des actifs :", error);
        });
    } else {
      setFilteredActifs([]); // Réinitialiser les actifs si aucune province n'est sélectionnée
    }
  }, [selectedProvince, selectedRegion]);

  // Mémoriser les provinces pour éviter des recalculs inutiles
  const provinceOptions = useMemo(() => {
    return province.map((prov) => (
      <MenuItem key={prov} value={prov}>
        {prov}
      </MenuItem>
    ));
  }, [province]);

  // Mémoriser les actifs filtrés pour éviter des recalculs inutiles
  const actifOptions = useMemo(() => {
    return filteredActifs.map((actif) => (
      <MenuItem key={actif} value={actif}>
        {actif}
      </MenuItem>
    ));
  }, [filteredActifs]);

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
            <span className="font-semibold">{totalClosed}</span>
          </span>
        </div>
      </div>

      <hr className="w-3/4 pb-4" />

      {/* Barre de filtre */}
      <div className="text-black flex items-center justify-center py-2 space-x-4 py-5">
        {/* Filtre par région */}
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

        {/* Filtre par province */}
        <TextField
          label="Filtrer par Province"
          select
          value={selectedProvince}
          onChange={handleProvinceChange}
          variant="outlined"
          size="small"
          sx={{ width: "200px" }}
          disabled={!selectedRegion} // Désactiver si aucune région n'est sélectionnée
        >
          <MenuItem value="">Toutes les Provinces</MenuItem>
          {provinceOptions}
        </TextField>

        {/* Filtre par actif */}
        <TextField
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
          {actifOptions}
        </TextField>

        {/* Filtre par date */}
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
          <Grid item xs={12} lg={12}>
            <Index
              region={selectedRegion}
              province={selectedProvince}
              startDate={startDate}
              endDate={endDate}
              onTotalClosed={handleTotalClosed}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <ClotureNonCloture
              region={selectedRegion}
              province={selectedProvince}
              startDate={startDate}
              endDate={endDate}
              onTicketsClosedUpdate={handleTicketsClosedUpdate}
              site={selectedActif ? [selectedActif] : undefined}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <BesoinTaux
              region={selectedRegion}
              province={selectedProvince}
              startDate={startDate}
              endDate={endDate}
              onFournituresClosedUpdate={handleFournituresClosedUpdate}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <BesoinVehicule />
          </Grid>

          <Grid item xs={12} lg={4}>
            <Item sx={{ backgroundColor: "#1E1E1E" }}>
              <CategorieMaintenance
                region={selectedRegion}
                province={selectedProvince}
                startDate={startDate}
                endDate={endDate}
              />
            </Item>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Item sx={{ backgroundColor: "#1E1E1E" }}>
              <Graphtest
                region={selectedRegion}
                province={selectedProvince}
                startDate={startDate}
                endDate={endDate}
              />
            </Item>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Item sx={{ backgroundColor: "#1E1E1E" }}>
              <TauxDisponibilité
                region={selectedRegion}
                province={selectedProvince}
                startDate={startDate}
                endDate={endDate}
              />
            </Item>
          </Grid>
          <Grid item xs={12} lg={8}>
            <Item>
              <TypesBesoin
                region={selectedRegion}
                province={selectedProvince}
                startDate={startDate}
                endDate={endDate}
              />
            </Item>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Item sx={{ backgroundColor: "#1E1E1E" }}>
              <CategorieBesoin
                region={selectedRegion}
                province={selectedProvince}
                startDate={startDate}
                endDate={endDate}
              />
            </Item>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default React.memo(Dashboard);
