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
import { MenuItem, TextField, Button } from "@mui/material"; 
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TauxDisponibilité from "./Graphe 11/TauxDisponibilité";
import AgeDesBesoin from "./AgeDesBesoin/ageDesBesoin";
import RepartitionParStatus from "./repartitionParStatus/repartitionParStatus";
import GlobalGraph from "./Graph Globale/GlobalGraph";
import Index from "./Tablekpiv2/Index";
import ReportGenerator from "./ReportGenerator"; // Assurez-vous que le chemin est correct

// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

// Configurations d'animation
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Styled component
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

// Client axios
const axiosClient = axios.create({
  baseURL: apiUrl,
});

const Dashboard = () => {
  const [filters, setFilters] = useState({
    region: "",
    province: "",
    actif: "",
    startDate: "",
    endDate: "",
  });
  const [data, setData] = useState({
    regions: [],
    provinces: [],
    filteredActifs: [],
    closedTicketsCount: 0,
    fournituresClosed: 0,
    totalClosed: null,
  });

  const [isGeneratorOpen, setGeneratorOpen] = useState(false);
  const hasFetchedRegionsRef = useRef(false);
  const isLoadingRef = useRef(false);

  const updateHandlers = useMemo(
    () => ({
      handleTicketsClosedUpdate: (value) => {
        setData((prev) => ({ ...prev, closedTicketsCount: value }));
      },
      handleFournituresClosedUpdate: (closedCount) => {
        setData((prev) => ({ ...prev, fournituresClosed: closedCount }));
      },
      handleTotalClosed: (value) => {
        setData((prev) => ({ ...prev, totalClosed: value }));
      },
    }),
    []
  );

  const updateFilter = useCallback((field, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [field]: value };
      if (field === "region") {
        newFilters.province = "";
        newFilters.actif = "";
      } else if (field === "province") {
        newFilters.actif = "";
      }
      return newFilters;
    });
  }, []);

  const handleOpenGenerator = useCallback(() => {
    setGeneratorOpen(true);
  }, []);

  const handleCloseGenerator = useCallback(() => {
    setGeneratorOpen(false);
  }, []);

  const handleRegionChange = useCallback((event) => {
      updateFilter("region", event.target.value);
    },[updateFilter]);
  const handleProvinceChange = useCallback((event) => {
      updateFilter("province", event.target.value);
    },[updateFilter]);
  const handleActifChange = useCallback((event) => {
      updateFilter("actif", event.target.value);
    },[updateFilter]);
  const handleStartDateChange = useCallback((e) => {
      updateFilter("startDate", e.target.value);
    },[updateFilter]);
  const handleEndDateChange = useCallback((e) => {
      updateFilter("endDate", e.target.value);
    },[updateFilter]);

  useEffect(() => {
    if (hasFetchedRegionsRef.current || isLoadingRef.current) return;
    isLoadingRef.current = true;
    axiosClient
      .get("/api/actifs")
      .then((response) => {
        const fetchedRegions = response.data.map((item) => item.region);
        const uniqueRegions = [...new Set(fetchedRegions)];
        setData((prev) => ({ ...prev, regions: uniqueRegions }));
        hasFetchedRegionsRef.current = true;
      })
      .catch((error) => console.error("Erreur lors de la récupération des régions :", error))
      .finally(() => { isLoadingRef.current = false; });
  }, []);

  useEffect(() => {
    if (!filters.region) {
      setData((prev) => ({ ...prev, provinces: [] }));
      return;
    }
    axiosClient
      .get(`/api/actifs`, { params: { region: filters.region } })
      .then((response) => {
        const fetchedProvinces = response.data.map((item) => item.province);
        const uniqueProvinces = [...new Set(fetchedProvinces)];
        setData((prev) => ({ ...prev, provinces: uniqueProvinces }));
      })
      .catch((error) => console.error("Erreur lors de la récupération des provinces :", error));
  }, [filters.region]);

  useEffect(() => {
    if (!filters.province || !filters.region) {
      setData((prev) => ({ ...prev, filteredActifs: [] }));
      return;
    }
    axiosClient
      .get(`/api/actifs`, { params: { region: filters.region, province: filters.province }})
      .then((response) => {
        const fetchedActifs = response.data.map((item) => item.name);
        setData((prev) => ({ ...prev, filteredActifs: fetchedActifs }));
      })
      .catch((error) => console.error("Erreur lors de la récupération des actifs :", error));
  }, [filters.province, filters.region]);

  const selectOptions = useMemo(
    () => ({
      provinceOptions: data.provinces.map((prov) => (<MenuItem key={prov} value={prov}>{prov}</MenuItem>)),
      actifOptions: data.filteredActifs.map((actif) => (<MenuItem key={actif} value={actif}>{actif}</MenuItem>)),
      regionOptions: data.regions.map((region) => (<MenuItem key={region} value={region}>{region}</MenuItem>)),
    }),
    [data.provinces, data.filteredActifs, data.regions]
  );

  const graphProps = useMemo(
    () => ({
      region: filters.region,
      province: filters.province,
      startDate: filters.startDate,
      endDate: filters.endDate,
      actif: filters.actif,
    }),
    [filters.region, filters.province, filters.startDate, filters.endDate, filters.actif]
  );

  const darkItem = useMemo(() => ({ sx: { backgroundColor: "#1E1E1E" } }), []);

  return (
    <>
      <div className="flex items-center p-4 rounded-lg shadow-lg">
        <div className="mr-auto">
          <Location />
        </div>
        <div className="flex justify-center items-center flex-1 space-x-6">
          <span className="text-center text-base text-white bg-gray-800 bg-opacity-60 py-3 px-4 rounded-lg font-medium shadow-md backdrop-blur-lg border border-gray-700">
            Total des interventions :{" "}
            <span className="font-semibold text-orange-400">{data.closedTicketsCount}</span>
          </span>
          <span className="text-center text-base text-white bg-gray-800 bg-opacity-60 py-3 px-4 rounded-lg font-medium shadow-md backdrop-blur-lg border border-gray-700">
            Total des livraisons :{" "}
            <span className="font-semibold text-orange-400">{data.totalClosed}</span>
          </span>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleOpenGenerator}
            sx={{
              backgroundColor: '#F97316',
              '&:hover': {
                backgroundColor: '#EA580C',
              }
            }}
          >
            Générer un Rapport
          </Button>
        </div>
      </div>

      <hr className="w-3/4 border-t-2 border-gray-700 opacity-50 rounded-lg my-4 shadow-md shadow-orange-400/50" />

      <div className="text-black flex items-center justify-center py-2 space-x-4 py-5">
        <TextField label="Filtrer par Région" select value={filters.region} onChange={handleRegionChange} variant="outlined" size="small" sx={{ width: "200px" }}>
          <MenuItem value="">Toutes les Régions</MenuItem>
          {selectOptions.regionOptions}
        </TextField>
        <TextField label="Filtrer par Province" select value={filters.province} onChange={handleProvinceChange} variant="outlined" size="small" sx={{ width: "200px" }} disabled={!filters.region}>
          <MenuItem value="">Toutes les Provinces</MenuItem>
          {selectOptions.provinceOptions}
        </TextField>
        <TextField label="Filtrer par Actif" select value={filters.actif} onChange={handleActifChange} variant="outlined" size="small" sx={{ width: "200px" }} disabled={!filters.province}>
          <MenuItem value="">Tous les Actifs</MenuItem>
          {selectOptions.actifOptions}
        </TextField>
        <div className="space-x-4">
          <TextField label="" type="date" value={filters.startDate} onChange={handleStartDateChange} variant="outlined" size="small" sx={{ width: "200px" }} />
          <TextField label="" type="date" value={filters.endDate} onChange={handleEndDateChange} variant="outlined" size="small" sx={{ width: "200px" }} />
        </div>
      </div>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
            <Grid item xs={12} lg={12}><Index {...graphProps} onTotalClosed={updateHandlers.handleTotalClosed}/></Grid>
            <Grid item xs={12} lg={4}><ClotureNonCloture {...graphProps} onTicketsClosedUpdate={updateHandlers.handleTicketsClosedUpdate} site={filters.actif || undefined}/></Grid>
            <Grid item xs={12} lg={4}><BesoinTaux {...graphProps} onFournituresClosedUpdate={updateHandlers.handleFournituresClosedUpdate}/></Grid>
            <Grid item xs={12} lg={4}><BesoinVehicule /></Grid>
            <Grid item xs={12} lg={4}><Item {...darkItem}><CategorieMaintenance {...graphProps} onTicketsClosedUpdate={updateHandlers.handleTicketsClosedUpdate} site={filters.actif || undefined} /></Item></Grid>
            <Grid item xs={12} lg={4}><Item {...darkItem}><Graphtest {...graphProps} /></Item></Grid>
            <Grid item xs={12} lg={4}><Item {...darkItem}><TauxDisponibilité {...graphProps} /></Item></Grid>
            <Grid item xs={12} lg={8}><Item><TypesBesoin {...graphProps} /></Item></Grid>
            <Grid item xs={12} lg={4}><Item {...darkItem}><CategorieBesoin {...graphProps} /></Item></Grid>
            <Grid item xs={12} lg={4}><Item {...darkItem}><AgeDesBesoin /></Item></Grid>
            <Grid item xs={12} lg={8}><Item {...darkItem}><RepartitionParStatus /></Item></Grid>
        </Grid>
      </Box>

      <ReportGenerator 
        open={isGeneratorOpen}
        onClose={handleCloseGenerator}
        filters={filters}
      />
    </>
  );
};

export default React.memo(Dashboard);