import React, { useEffect, useState, useMemo, useCallback } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SpeedDialAction,
  SpeedDialIcon,
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
import { ShareIcon } from "lucide-react";
import ExcelModel from "./ExcelModel";
import Index from "./nonMedical/Index";
import DialogMedcin from "./DialogMedcin";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Configuration de l'URL de l'API
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

// Actions pour le SpeedDial - mémorisé car ne change jamais
const actions = [{ icon: <ShareIcon />, name: "Share" }];

const Test = () => {
  // Style pour les éléments Paper - mémorisé avec useMemo
  const Item = useMemo(
    () =>
      styled(Paper)(({ theme }) => ({
        backgroundColor: "#fff",
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
        ...theme.applyStyles("dark", {
          backgroundColor: "#1A2027",
        }),
      })),
    []
  );

  // Récupération des informations utilisateur une seule fois
  const userInfo = useMemo(
    () => JSON.parse(localStorage.getItem("userInfo") || "{}"),
    []
  );
  const { role, region, province } = userInfo;
  const isDocteur = role === "docteurs";

  // États pour la gestion des onglets, régions, provinces, dates, etc.
  const [value, setValue] = useState(0);
  const [selectedProvince, setSelectedProvince] = useState(
    isDocteur ? province : null
  );
  const [selectedRegion, setSelectedRegion] = useState(
    isDocteur ? region : null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedActif, setSelectedActif] = useState(() => {
    if (isDocteur) {
      const nameActifUser = localStorage.getItem("nameActifUser");
      if (nameActifUser) {
        try {
          return JSON.parse(nameActifUser)[0].replace(/['"]+/g, "");
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  });

  const [totalPriseEnCharge, setTotalPriseEnCharge] = useState(0);
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
  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);

  // Fonction pour récupérer les données - mémorisée avec useCallback
  const fetchData = useCallback(
    async (region, province, selectedActif, dateDebut, dateFin) => {
      setLoading(true);
      try {
        const params = {};
        if (region) params.region = region;
        if (province) params.province = province;
        if (selectedActif) params.unite = selectedActif;

        // Formater les dates en YYYY-MM-DD
        if (dateDebut) params.dateDebut = dayjs(dateDebut).format("YYYY-MM-DD");
        if (dateFin) params.dateFin = dayjs(dateFin).format("YYYY-MM-DD");

        // Construire l'URL avec les paramètres
        const queryString = new URLSearchParams(params).toString();
        const url = `${apiUrl}/api/v1/ummcperformance?${queryString}`;

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
        // Utiliser directement les filtres disponibles de l'API
        setRegions(data.availableFilters?.regions || []);
        setProvinces(data.availableFilters?.provinces || []);
        setActifs(data.availableFilters?.unites || []);
        setAgeRates(data.ageRates || {});
        console.log(ageRates);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Effet pour récupérer les données initiales et les données filtrées
  // Utilisation d'un effet avec dépendances optimisées
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchData(
        selectedRegion,
        selectedProvince,
        selectedActif,
        dateDebut,
        dateFin
      );
    }, 300); // Ajout d'un debounce pour éviter les appels API trop fréquents

    return () => clearTimeout(debounceTimeout);
  }, [
    fetchData,
    selectedRegion,
    selectedProvince,
    selectedActif,
    dateDebut,
    dateFin,
  ]);

  // Gestion du changement d'onglet - mémorisé avec useCallback
  const handleChange = useCallback((event, newValue) => {
    setValue(newValue);
  }, []);

  // Gestion de l'ouverture et de la fermeture du modal Excel - mémorisé avec useCallback
  const handleOpenModal = useCallback((actionName) => {
    setSelectedAction(actionName);
    setOpenModelExcel(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenModelExcel(false);
    setSelectedAction("");
  }, []);

  // Gestion des changements de filtre - mémorisé avec useCallback
  const handleRegionChange = useCallback((e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    setSelectedProvince(null);
    setSelectedActif(null);
  }, []);

  const handleProvinceChange = useCallback((e) => {
    const province = e.target.value;
    setSelectedProvince(province);
    setSelectedActif(null);
  }, []);

  const handleActifChange = useCallback((e) => {
    setSelectedActif(e.target.value);
  }, []);

  // Mémorisation de l'état d'ouverture de la dialog
  const handleOpenDialog = useCallback(() => setOpen(true), []);
  const handleCloseDialog = useCallback(() => setOpen(false), []);

  // Mémorisation des sélecteurs de date
  const handleDateDebutChange = useCallback(
    (newValue) => setDateDebut(newValue),
    []
  );
  const handleDateFinChange = useCallback(
    (newValue) => setDateFin(newValue),
    []
  );

  // Mémorisation du filtre régions
  const regionsItems = useMemo(() => {
    return regions.sort().map((region, index) => (
      <MenuItem key={index} value={region}>
        {region}
      </MenuItem>
    ));
  }, [regions]);

  // Mémorisation du filtre provinces
  const provincesItems = useMemo(() => {
    return provinces.sort().map((province, index) => (
      <MenuItem key={index} value={province}>
        {province}
      </MenuItem>
    ));
  }, [provinces]);

  // Mémorisation du filtre actifs
  const actifsItems = useMemo(() => {
    return actifs.sort().map((unite, index) => (
      <MenuItem key={index} value={unite}>
        {unite}
      </MenuItem>
    ));
  }, [actifs]);

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
        <div className="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl uppercase text-[#880B25]">
          SCX Performance des UMMC (disponible bientôt ❇️)
        </div>
        <div>
          <img
            src="../../../public/SCX asset management (1).png"
            alt="SCX Asset Management"
            style={{ height: "40px" }}
            loading="lazy"
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
                {/* <Button
                  sx={{ background: "#e5afe9", color: "black" }}
                  onClick={handleOpenDialog}
                >
                  Nouvelle Entrée Médicale
                </Button>
                <DialogMedcin open={open} handleClose={handleCloseDialog} /> */}
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
                      alignItems: "center",
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
                          value={selectedRegion || ""}
                          onChange={handleRegionChange}
                        >
                          <MenuItem value="">Toutes les régions</MenuItem>
                          {regionsItems}
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
                          value={selectedProvince || ""}
                          onChange={handleProvinceChange}
                        >
                          <MenuItem value="">Toutes les provinces</MenuItem>
                          {provincesItems}
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
                          value={selectedActif || ""}
                          onChange={handleActifChange}
                        >
                          <MenuItem value="">Toutes les unités</MenuItem>
                          {actifsItems}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Date de début */}
                    <Grid item>
                      <DatePicker
                        label="Date Début"
                        value={dateDebut}
                        onChange={handleDateDebutChange}
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
                        onChange={handleDateFinChange}
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

              {loading ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography>Chargement des données...</Typography>
                </Box>
              ) : error ? (
                <Box sx={{ textAlign: "center", py: 4, color: "error.main" }}>
                  <Typography>{error}</Typography>
                </Box>
              ) : (
                /* Grille des indicateurs */
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
              )}
            </div>
          </>
        )}
        {value === 1 && <Index />}
      </div>
    </div>
  );
};

export default React.memo(Test);
