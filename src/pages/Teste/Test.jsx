import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SpeedDialAction,
  SpeedDialIcon,
  TextField,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import Groups3OutlinedIcon from "@mui/icons-material/Groups3Outlined";
import AddHomeWorkRoundedIcon from "@mui/icons-material/AddHomeWorkRounded";
import Grid from "@mui/material/Grid";
import CardInfo from "./CardInfo";
import TrancheAge from "./TrancheAge";
import Pathologie from "./Pathologie";
import RepartitionParServices from "./RepartitionParServices";
import Specialiste from "./Specialiste";
import TauxTeleExpertise from "./TauxTeleExpertise";
import SpeedDial from "@mui/material/SpeedDial";
import SaveIcon from "@mui/icons-material/Save";
import { ShareIcon } from "lucide-react";
import ExcelModel from "./ExcelModel";
import TauxDeCompletude from "./nonMedical/TauxDeCompletude/TauxDeCompletude";
import Index from "./nonMedical/Index";
import DialogMedcin from "./DialogMedcin";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Configuration de l'URL de l'API
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

// Actions pour le SpeedDial
const actions = [{ icon: <ShareIcon />, name: "Share" }];

const Test = () => {
  // Style pour les éléments Paper
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }));

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const { role, region, province } = userInfo;

  const isDocteur = role === "docteurs";

  // États pour la gestion des onglets, régions, provinces, dates, etc.
  const [value, setValue] = React.useState(0);
  const [selectedProvince, setSelectedProvince] = useState(
    isDocteur ? province : null
  );
  const [selectedRegion, setSelectedRegion] = useState(
    isDocteur ? region : null
  );
  // const selectedActif = isDocteur
  //   ? JSON.parse(localStorage.getItem("nameActifUser"))?.[0].replace(
  //       /['"]+/g,
  //       ""
  //     ) || null
  //   : null;
  // console.log(localStorage.getItem("nameActifUser"));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedActif, setSelectedActif] = useState(
    isDocteur
      ? JSON.parse(localStorage.getItem("nameActifUser"))?.[0].replace(
          /['"]+/g,
          ""
        ) || null
      : null
  );
  const [totalPriseEnCharge, setTotalPriseEnCharge] = useState(0);
  const [data, setData] = useState("");
  const [openModelExcel, setOpenModelExcel] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [ageRates, setAgeRates] = useState({});
  const [open, setOpen] = useState(false);
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [actifs, setActifs] = useState([]);
  const [allData, setAllData] = useState([]);
  const [topPathologies, setTopPathologies] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [genderRates, setGenderRates] = useState([]);
  const userRole = userInfo ? userInfo.role : null;
  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);

  console.log("selectedActif :", selectedActif);
  console.log("selectedProvince :", selectedProvince);
  console.log("selectedRegion :", selectedRegion);

  console.log("allData:", allData);
  // Fonction pour extraire les valeurs uniques
  const extractUniqueValues = (
    data,
    key,
    filterKey = null,
    filterValue = null
  ) => {
    const uniqueValues = new Set();
    data.forEach((item) => {
      if (item[key] && (!filterKey || item[filterKey] === filterValue)) {
        // Si la valeur est un tableau, ajoutez chaque élément au Set
        if (Array.isArray(item[key])) {
          item[key].forEach((value) => uniqueValues.add(value));
        } else {
          uniqueValues.add(item[key]);
        }
      }
    });
    return Array.from(uniqueValues);
  };

  // Fonction pour récupérer les données
  const fetchData = async (
    region,
    province,
    selectedActif,
    dateDebut,
    dateFin
  ) => {
    try {
      const params = {};
      if (region) params.region = region;
      if (province) params.province = province;
      if (selectedActif) params.unite = selectedActif; // Utiliser selectedActif au lieu de actif

      // Formater les dates en YYYY-MM-DD
      if (dateDebut) params.dateDebut = dayjs(dateDebut).format("YYYY-MM-DD");
      if (dateFin) params.dateFin = dayjs(dateFin).format("YYYY-MM-DD");

      // Construire l'URL avec les paramètres
      const queryString = new URLSearchParams(params).toString();
      const url = `${apiUrl}/api/v1/ummcperformance?${queryString}`;
      console.log("URL de la requête :", url);

      const response = await fetch(url);
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des données");

      const data = await response.json();

      // Mettre à jour les états avec les données reçues
      setAllData(data.data || []);
      setTotalPriseEnCharge(data.totalPriseEnCharge || 0);
      setTopPathologies(data.topPathologies || []);
      setServicesData(data.servicesData || []);
      setGenderRates(data.genderRates || []);

      // Extraire les régions uniques
      const uniqueRegions = extractUniqueValues(data.data || [], "region");
      setRegions(uniqueRegions);

      // Filtrer les provinces en fonction de la région sélectionnée
      const filteredProvinces = region
        ? extractUniqueValues(data.data || [], "province", "region", region)
        : extractUniqueValues(data.data || [], "province");

      setProvinces(filteredProvinces);

      // Filtrer les unités en fonction de la province sélectionnée
      const filteredActifs = province
        ? extractUniqueValues(data.data || [], "unite", "province", province)
        : extractUniqueValues(data.data || [], "unite");

      setActifs(filteredActifs);
      setAgeRates(data.ageRates || {});
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour récupérer les données initiales et les données filtrées
  useEffect(() => {
    if (!isDocteur) {
      fetchData(
        selectedRegion,
        selectedProvince,
        selectedActif,
        dateDebut,
        dateFin
      );
    } else {
      fetchData(
        selectedRegion,
        selectedProvince,
        selectedActif,
        dateDebut,
        dateFin
      );
    }
  }, [selectedRegion, selectedProvince, selectedActif, dateDebut, dateFin]);

  // Gestion du changement d'onglet
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Gestion de l'ouverture et de la fermeture du modal Excel
  const handleOpenModal = (actionName) => {
    setSelectedAction(actionName);
    setOpenModelExcel(true);
  };

  const handleCloseModal = () => {
    setOpenModelExcel(false);
    setSelectedAction("");
  };

  // Mettre à jour les provinces quand la région change
  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    setSelectedProvince(null);

    if (!isDocteur) setSelectedActif(null);

    const filteredProvinces = region
      ? extractUniqueValues(allData, "province", "region", region)
      : extractUniqueValues(allData, "province");

    setProvinces(filteredProvinces);
    setActifs([]);
  };
  console.log("totalPriseEnCharge", totalPriseEnCharge);
  console.log("allData", allData);
  console.log("topPathologies", topPathologies);
  console.log("servicesData", servicesData);
  console.log("genderRates", genderRates);
  console.log("dateDebut", dateDebut);
  console.log("dateFin", dateFin);

  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setSelectedProvince(province);

    if (!isDocteur) setSelectedActif(null);

    // Filtrer les unités en fonction de la province sélectionnée
    const filteredActifs = province
      ? extractUniqueValues(allData, "unite", "province", province)
      : extractUniqueValues(allData, "unite");

    console.log("filteredActifs", filteredActifs); // Ajoutez ce log pour vérifier les unités filtrées

    setActifs(filteredActifs);
  };

  return (
    <div className="bg-[#F2E5D7] min-h-screen overflow-y-auto">
      {/* SpeedDial pour les actions rapides */}
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          opacity: 0.65,
        }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => handleOpenModal(action.name)}
          />
        ))}
      </SpeedDial>

      {/* Modal pour l'export Excel */}
      <ExcelModel
        open={openModelExcel}
        handleCloseModal={handleCloseModal}
        selectedAction={selectedAction}
      />

      {/* En-tête de la page */}
      <div className="flex justify-between px-9 py-5">
        <div className="mb-4  text-3xl font-extrabold leading-none tracking-tight md:text-4xl uppercase text-[#880B25]">
          SCX Performance des UMMC (disponible bientôt ❇️)
        </div>
        <div>
          <img
            src="../../../public/SCX asset management (1).png"
            alt="SCX Asset Management"
            style={{ height: "40px" }}
          />
        </div>
      </div>

      {/* Onglets pour la navigation */}
      <div className="flex justify-center">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Tabs for performance indicators"
        >
          <Tab label="performance medical" />
          <Tab label="performance non medical" />
        </Tabs>
      </div>

      {/* Contenu des onglets */}
      <div className="px-6 py-4">
        {value === 0 && (
          <>
            <div>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography
                  variant="h4"
                  component="h2"
                  className="uppercase"
                  sx={{ fontWeight: "bold", color: "#880B25" }}
                >
                  performance medical
                </Typography>
                <Button
                  sx={{ background: "#e5afe9", color: "black" }}
                  onClick={() => setOpen(true)}
                >
                  Nouvelle Entrée Médicale
                </Button>
                {/* <DialogMedcin open={open} handleClose={() => setOpen(false)} /> */}
              </Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Grid
                    container
                    spacing={3}
                    sx={{
                      justifyContent: "center",
                      maxWidth: "1200px",
                      mx: "auto",
                      alignItems: "center", // Ajoutez cette ligne pour aligner verticalement les éléments
                    }}
                  >
                    {/* Filtre Région */}
                    <Grid item>
                      <FormControl
                        sx={{
                          m: 1,
                          minWidth: 200,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            transition:
                              "box-shadow 0.3s ease, border-color 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
                            },
                            "&.Mui-focused": {
                              boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
                              borderColor: "#880B25",
                            },
                          },
                        }}
                      >
                        <InputLabel
                          sx={{ color: "#880B25", fontWeight: "bold" }}
                        >
                          Région
                        </InputLabel>
                        <Select
                          value={selectedRegion}
                          onChange={handleRegionChange}
                          disabled={userRole === "docteurs"}
                          sx={{
                            "& .MuiSelect-icon": {
                              color: "#880B25",
                            },
                          }}
                        >
                          <MenuItem value="">Toutes les régions</MenuItem>
                          {regions.map((region, index) => (
                            <MenuItem
                              key={index}
                              value={region}
                              sx={{ color: "#333" }}
                            >
                              {region}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Filtre Province */}
                    <Grid item>
                      <FormControl
                        sx={{
                          m: 1,
                          minWidth: 200,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            transition:
                              "box-shadow 0.3s ease, border-color 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
                            },
                            "&.Mui-focused": {
                              boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
                              borderColor: "#880B25",
                            },
                          },
                        }}
                        disabled={!selectedRegion}
                      >
                        <InputLabel
                          sx={{ color: "#880B25", fontWeight: "bold" }}
                        >
                          Province
                        </InputLabel>
                        <Select
                          value={selectedProvince}
                          onChange={handleProvinceChange}
                          disabled={userRole === "docteurs"}
                          displayEmpty
                          sx={{
                            "& .MuiSelect-icon": {
                              color: "#880B25",
                            },
                          }}
                        >
                          <MenuItem value="">Toutes les provinces</MenuItem>
                          {provinces.map((province, index) => (
                            <MenuItem
                              key={index}
                              value={province}
                              sx={{ color: "#333" }}
                            >
                              {province}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Filtre Unité */}
                    <Grid item>
                      <FormControl
                        sx={{
                          m: 1,
                          minWidth: 200,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            transition:
                              "box-shadow 0.3s ease, border-color 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
                            },
                            "&.Mui-focused": {
                              boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
                              borderColor: "#880B25",
                            },
                          },
                        }}
                        disabled={!selectedProvince}
                      >
                        <InputLabel
                          sx={{ color: "#880B25", fontWeight: "bold" }}
                        >
                          Unité
                        </InputLabel>
                        <Select
                          value={selectedActif}
                          onChange={(e) => setSelectedActif(e.target.value)}
                          disabled={userRole === "docteurs"}
                          displayEmpty
                          sx={{
                            "& .MuiSelect-icon": {
                              color: "#880B25",
                            },
                          }}
                        >
                          <MenuItem value="">Toutes les unités</MenuItem>
                          {actifs.map((unite, index) => (
                            <MenuItem
                              key={index}
                              value={unite}
                              sx={{ color: "#333" }}
                            >
                              {unite}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Date de début */}
                    <Grid item>
                      <DatePicker
                        label="Date Début"
                        value={dateDebut}
                        onChange={(newValue) => setDateDebut(newValue)}
                        sx={{
                          minWidth: 200,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          },
                        }}
                      />
                    </Grid>

                    {/* Date de fin */}
                    <Grid item>
                      <DatePicker
                        label="Date Fin"
                        value={dateFin}
                        onChange={(newValue) => setDateFin(newValue)}
                        sx={{
                          minWidth: 200,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </LocalizationProvider>

              {/* Grille des indicateurs */}
              <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                gap={2}
              >
                <Item sx={{ flex: "1 1 30%", backgroundColor: "#fcf2e6" }}>
                  <CardInfo
                    title="TOTAL DES PRISES EN CHARGE"
                    value={totalPriseEnCharge}
                    icon={PersonAddAltOutlinedIcon}
                    genderRates={genderRates}
                  />
                </Item>
                <Item sx={{ flex: "1 1 30%", backgroundColor: "#fcf2e6" }}>
                  <CardInfo
                    title="EFFECTIF TOTAL OPERATIONNEL"
                    value={345}
                    icon={Groups3OutlinedIcon}
                  />
                </Item>
                <Item sx={{ flex: "1 1 30%", backgroundColor: "#fcf2e6" }}>
                  <CardInfo
                    title="TOTAL DES UMMC INSTALLÉES"
                    value={100}
                    icon={AddHomeWorkRoundedIcon}
                  />
                </Item>
                <Item sx={{ flex: "1 1 30%", backgroundColor: "#fcf2e6" }}>
                  <TrancheAge
                    ageRates={ageRates}
                    selectedRegion={selectedRegion}
                    selectedProvince={selectedProvince}
                    selectedActif={selectedActif}
                  />
                </Item>
                <Item sx={{ flex: "1 1 30%", backgroundColor: "#fcf2e6" }}>
                  <Pathologie
                    topPathologies={topPathologies}
                    selectedRegion={selectedRegion}
                    selectedProvince={selectedProvince}
                    selectedActif={selectedActif}
                  />
                </Item>
                <Item sx={{ flex: "1 1 30%", backgroundColor: "#fcf2e6" }}>
                  <RepartitionParServices servicesData={servicesData} />
                </Item>
                <Item sx={{ flex: "1 1 30%", backgroundColor: "#fcf2e6" }}>
                  <Specialiste />
                </Item>
                <Item sx={{ flex: "1 1 30%", backgroundColor: "#fcf2e6" }}>
                  <TauxTeleExpertise
                    selectedRegion={selectedRegion}
                    selectedProvince={selectedProvince}
                    selectedActif={selectedActif}
                  />
                </Item>
              </Box>
            </div>
          </>
        )}
        {value === 1 && <Index />}
      </div>
    </div>
  );
};

export default Test;
