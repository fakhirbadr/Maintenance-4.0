import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useState, useEffect, useMemo } from "react";
import TauxDeCompletude from "./TauxDeCompletude/TauxDeCompletude";
import TauxDeCompletudeAdministratif from "./TauxDeCompletudeAdministratif/TauxDeCompletudeAministratif";
import TauxDeCompletudeDeDossierComplet from "./TauxDeCompletudeDeDossierComplet/TauxDeCompletudeDeDossierComplet";
import TauxDeCompletudeDesPrescriptions from "./TauxDeCompletudeDesPrescriptions/TauxDeCompletudeDesPrescriptions";
import TauxDeSaisie from "./TauxDeSaisie/TauxDeSaisie";
import FluxPatients from "./FluxPatient/FluxPatients";
import TeleExpertise from "./teleMedcine/TeleExpertise";

const Index = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const nameActifUser = JSON.parse(localStorage.getItem("nameActifUser")) || [];

  // Vérifier si c'est un tableau et récupérer le premier élément
  const name =
    Array.isArray(nameActifUser) && nameActifUser.length > 0
      ? nameActifUser[0].replace(/['"]+/g, "")
      : null;

  const { role, region, province } = userInfo;

  const isDocteur = role === "docteurs";

  console.log("Role:", role);
  console.log("Region:", region);
  console.log("Province:", province);
  console.log("nameActifUser:", name);

  // États des filtres
  const [selectedRegion, setSelectedRegion] = useState(
    isDocteur ? region : "Toutes les régions"
  );
  const [selectedProvince, setSelectedProvince] = useState(
    isDocteur ? province : ""
  );
  const [selectedActif, setSelectedActif] = useState(isDocteur ? name : "");
  const [selectedComparison, setSelectedComparison] = useState("");

  // États des données
  const [medicalData, setMedicalData] = useState([]);
  const [adminData, setAdminData] = useState([]);
  const [regions, setRegions] = useState([]);
  const [dossierData, setDossierData] = useState([]); // Ajoutez cette ligne
  const [prescriptionsData, setPrescriptionsData] = useState([]);
  const [tauxDeSaisieData, setTauxDeSaisieData] = useState([]);

  // Chargement des structures hiérarchiques
  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        const [
          medicalRes,
          adminRes,
          dossierRes,
          prescriptionsRes,
          tauxDeSaisieRes,
        ] = await Promise.all([
          fetch("http://localhost:3000/api/v1/tauxDeCompletudeMedical"),
          fetch("http://localhost:3000/api/v1/tauxDeCompletudeAdministratif"),
          fetch(
            "http://localhost:3000/api/v1/tauxDeCompletudeDeDossierComplet"
          ),
          fetch(
            "http://localhost:3000/api/v1/TauxDeCompletudeDesPrescriptions"
          ),
          fetch("http://localhost:3000/api/v1/TauxDeSaisie"),
        ]);

        const medicalJson = await medicalRes.json();
        const adminJson = await adminRes.json();
        const dossierJson = await dossierRes.json();
        const prescriptionsJson = await prescriptionsRes.json();
        const saisieJson = await tauxDeSaisieRes.json();

        setMedicalData(medicalJson.tauxHierarchiques);
        setAdminData(adminJson.tauxHierarchiques);
        setDossierData(dossierJson.tauxHierarchiques);
        setPrescriptionsData(prescriptionsJson.tauxHierarchiques); // Stockez les données du dossier
        setTauxDeSaisieData(saisieJson.tauxHierarchiques);

        // Fusionnez toutes les régions
        const allRegions = [
          { region: "Toutes les régions", provinces: [] },
          ...medicalJson.tauxHierarchiques,
          ...adminJson.tauxHierarchiques,
          ...dossierJson.tauxHierarchiques,
          ...prescriptionsJson.tauxHierarchiques, // Incluez les régions du dossier
          ...saisieJson.tauxHierarchiques,
        ].filter((v, i, a) => a.findIndex((t) => t.region === v.region) === i);

        setRegions(allRegions);
      } catch (error) {
        console.error("Erreur de chargement des données :", error);
      }
    };

    fetchHierarchy();
  }, []);

  // Calcul des provinces
  const provinces = useMemo(() => {
    if (selectedRegion === "Toutes les régions") return [];

    return [
      ...(medicalData.find((r) => r.region === selectedRegion)?.provinces ||
        []),
      ...(adminData.find((r) => r.region === selectedRegion)?.provinces || []),
      ...(dossierData.find((r) => r.region === selectedRegion)?.provinces ||
        []), // Ajoutez cette ligne
      ...(prescriptionsData.find((r) => r.region === selectedRegion)
        ?.provinces || []),
      ...(tauxDeSaisieData.find((r) => r.region === selectedRegion)
        ?.provinces || []),
    ].filter((v, i, a) => a.findIndex((t) => t.province === v.province) === i);
  }, [
    selectedRegion,
    medicalData,
    adminData,
    dossierData,
    prescriptionsData,
    tauxDeSaisieData,
  ]); // Ajoutez dossierData aux dépendances
  // Calcul des unités
  const actifs = useMemo(() => {
    if (!selectedProvince) return [];

    const findUnits = (dataset) => {
      const regionData = dataset.find((r) => r.region === selectedRegion);
      return (
        regionData?.provinces?.find((p) => p.province === selectedProvince)
          ?.unites || []
      );
    };

    return [
      ...findUnits(medicalData),
      ...findUnits(adminData),
      ...findUnits(dossierData),
      ...findUnits(prescriptionsData), // Ajoutez cette ligne
      ...findUnits(tauxDeSaisieData),
    ].filter((v, i, a) => a.findIndex((t) => t.unite === v.unite) === i);
  }, [
    selectedRegion,
    selectedProvince,
    medicalData,
    adminData,
    dossierData,
    prescriptionsData,
    tauxDeSaisieData,
  ]); // Ajoutez dossierData aux dépendances

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          {/* Filtre Région */}
          <Grid item>
            <FormControl sx={{ m: 1, minWidth: 200 }}>
              <InputLabel>Région</InputLabel>
              <Select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setSelectedProvince("");
                  setSelectedActif("");
                }}
              >
                {regions.map((region) => (
                  <MenuItem key={region.region} value={region.region}>
                    {region.region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Filtre Province */}
          <Grid item>
            <FormControl
              sx={{ m: 1, minWidth: 200 }}
              disabled={selectedRegion === "Toutes les régions"}
            >
              <InputLabel>Province</InputLabel>
              <Select
                value={selectedProvince}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  setSelectedActif("");
                }}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Sélectionnez une province
                </MenuItem>
                {provinces.map((province) => (
                  <MenuItem key={province.province} value={province.province}>
                    {province.province}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Filtre Actif */}
          <Grid item>
            <FormControl
              sx={{ m: 1, minWidth: 200 }}
              disabled={!selectedProvince}
            >
              <InputLabel>Unité</InputLabel>
              <Select
                value={selectedActif}
                onChange={(e) => setSelectedActif(e.target.value)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Sélectionnez une unité
                </MenuItem>
                {actifs.map((unite) => (
                  <MenuItem key={unite.unite} value={unite.unite}>
                    {unite.unite}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Filtre Comparaison */}
          <Grid item>
            <FormControl sx={{ m: 1, minWidth: 200 }}>
              <InputLabel>Comparaison</InputLabel>
              <Select
                value={selectedComparison}
                onChange={(e) => setSelectedComparison(e.target.value)}
              >
                <MenuItem value="">Aucune comparaison</MenuItem>
                <MenuItem value="S_vs_S-1">Semaine en cours vs S-1</MenuItem>
                <MenuItem value="M_vs_M-1">Mois en cours vs M-1</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          color="#880B25"
          className=" uppercase"
        >
          Performance non medical
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}></Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <FluxPatients
                    selectedRegion={selectedRegion}
                    selectedProvince={selectedProvince}
                    selectedActif={selectedActif}
                    selectedComparison={selectedComparison}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <TeleExpertise
                    selectedRegion={selectedRegion}
                    selectedProvince={selectedProvince}
                    selectedActif={selectedActif}
                    selectedComparison={selectedComparison}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TauxDeCompletude
                    selectedRegion={selectedRegion}
                    selectedProvince={selectedProvince}
                    selectedActif={selectedActif}
                    selectedComparison={selectedComparison}
                    apiUrl="http://localhost:3000/api/v1/tauxDeCompletudeMedical"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TauxDeCompletudeAdministratif
                    selectedRegion={selectedRegion}
                    selectedProvince={selectedProvince}
                    selectedActif={selectedActif}
                    selectedComparison={selectedComparison}
                    apiUrl="http://localhost:3000/api/v1/tauxDeCompletudeAdministratif"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TauxDeCompletudeDeDossierComplet
                    selectedRegion={selectedRegion} // Décommentez cette ligne
                    selectedProvince={selectedProvince}
                    selectedActif={selectedActif}
                    selectedComparison={selectedComparison}
                    apiUrl="http://localhost:3000/api/v1/tauxDeCompletudeDeDossierComplet"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TauxDeCompletudeDesPrescriptions
                    selectedRegion={selectedRegion} // Décommentez cette ligne
                    selectedProvince={selectedProvince}
                    selectedActif={selectedActif}
                    selectedComparison={selectedComparison}
                    apiUrl="http://localhost:3000/api/v1/TauxDeCompletudeDesPrescriptions"
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <TauxDeSaisie
                    selectedRegion={selectedRegion} // Décommentez cette ligne
                    selectedProvince={selectedProvince}
                    selectedActif={selectedActif}
                    selectedComparison={selectedComparison}
                    apiUrl="http://localhost:3000/api/v1/TauxDeSaisie"
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Index;
