import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  Autocomplete,
  Box,
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
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

import ExcelModel from "./ExcelModel";
import TauxDeCompletude from "./nonMedical/TauxDeCompletude/TauxDeCompletude";
import Index from "./nonMedical/Index";

const actions = [{ icon: <ShareIcon />, name: "Share" }];
// Liste des régions et provinces
const regionsWithProvinces = [
  {
    label: "Tanger-Tétouan-Al Hoceïma",
    provinces: ["Tanger", "Tétouan", "Al Hoceïma", "Chefchaouen", "Larache"],
  },
  {
    label: "L'Oriental",
    provinces: ["Oujda", "Nador", "Berkane", "Taourirt", "Jerada"],
  },
  {
    label: "Fès-Meknès",
    provinces: ["Fès", "Meknès", "Ifrane", "Sefrou", "Taza"],
  },
  {
    label: "Rabat-Salé-Kénitra",
    provinces: ["Rabat", "Salé", "Kénitra", "Skhirat-Témara"],
  },
  {
    label: "Béni Mellal-Khénifra",
    provinces: ["Béni Mellal", "Khouribga", "Fquih Ben Salah"],
  },
  {
    label: "Casablanca-Settat",
    provinces: ["Casablanca", "Settat", "Mohammedia", "El Jadida"],
  },
  {
    label: "Marrakech-Safi",
    provinces: ["Marrakech", "Essaouira", "Safi", "Chichaoua"],
  },
  {
    label: "Drâa-Tafilalet",
    provinces: ["Errachidia", "Ouarzazate", "Midelt", "Tinghir"],
  },
  {
    label: "Souss-Massa",
    provinces: ["Agadir", "Taroudant", "Tiznit", "Inezgane"],
  },
  {
    label: "Guelmim-Oued Noun",
    provinces: ["Guelmim", "Assa-Zag", "Tan-Tan"],
  },
  {
    label: "Laâyoune-Sakia El Hamra",
    provinces: ["Laâyoune", "Boujdour", "Tarfaya"],
  },
  {
    label: "Dakhla-Oued Ed-Dahab",
    provinces: ["Dakhla", "Aousserd"],
  },
];
const Test = () => {
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
  const [value, setValue] = React.useState(0); // Définir 0 comme valeur initiale
  const [region, setRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState(null); // Move here
  const [endDate, setEndDate] = useState(null); // Move here
  const [totalPriseEnCharge, setTotalPriseEnCharge] = useState(0);
  const [totalEffectifOperationnel, setTotalEffectifOperationnel] = useState(0);
  const [totalUMMCInstallees, setTotalUMMCInstallees] = useState(0);
  const [data, setData] = useState("");

  const [openModelExcel, setOpenModelExcel] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");

  // Handle opening the modal
  const handleOpenModal = (actionName) => {
    setSelectedAction(actionName);
    setOpenModelExcel(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setOpenModelExcel(false);
    setSelectedAction("");
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/v1/ummcperformance`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        const data = await response.json();
        setData(data);
        console.log(data);

        const totalUMMCInstallees = data.reduce((acc, item) => {
          return (
            acc +
            (isNaN(item.totalUMMCInstallees) ? 0 : item.totalUMMCInstallees)
          );
        }, 0);

        // Mettre à jour les états
        setTotalPriseEnCharge(data.totalPriseEnCharge);
        setTotalEffectifOperationnel(
          data.data.reduce(
            (acc, item) => acc + (item.effectifTotalOperationnel || 0),
            0
          )
        );
        setTotalUMMCInstallees(
          data.data.reduce(
            (acc, item) => acc + (item.totalUMMCInstallees || 0),
            0
          )
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const provinces = selectedRegion?.provinces || [];

  return (
    <div className="bg-[#F2E5D7] min-h-screen overflow-y-auto">
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

      {/* Modal Component */}
      <ExcelModel
        open={openModelExcel}
        handleCloseModal={handleCloseModal}
        selectedAction={selectedAction}
      />

      {/* Header */}
      <div className="flex justify-between px-9 py-5">
        <div className="mb-4  text-3xl font-extrabold leading-none tracking-tight md:text-4xl uppercase text-[#880B25]">
          Indicateurs de Performance des UMMC (disponible bientôt ❇️)
        </div>
        <div>
          <img
            src="../../../public/SCX asset management (1).png"
            alt="SCX Asset Management"
            style={{ height: "40px" }}
          />
        </div>
      </div>

      {/* Tabs */}
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

      {/* Content for each tab */}
      <div className="px-6 py-4">
        {value === 0 && (
          <div>
            <Typography
              variant="h4"
              component="h2"
              className="uppercase pb-6"
              sx={{ fontWeight: "bold", color: "#880B25" }}
            >
              performance medical
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 3,
                paddingY: 2,

                justifyContent: "center",
              }}
            >
              {/* Liste déroulante des régions */}
              <Autocomplete
                options={regionsWithProvinces}
                getOptionLabel={(option) => option.label}
                onChange={(event, newValue) => {
                  setSelectedRegion(newValue);
                  setSelectedProvince(null); // Réinitialiser la province
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Sélectionner une région" />
                )}
                sx={{ width: 300 }}
              />

              {/* Liste déroulante des provinces */}
              <Autocomplete
                options={provinces}
                getOptionLabel={(option) => option}
                onChange={(event, newValue) => setSelectedProvince(newValue)}
                value={selectedProvince}
                renderInput={(params) => (
                  <TextField {...params} label="Sélectionner une province" />
                )}
                sx={{ width: 300 }}
                disabled={!selectedRegion}
              />
              {/* Sélection de la date de début */}
              <TextField
                label="Date Début"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                sx={{ width: 300 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              {/* Sélection de la date de fin */}
              <TextField
                label="Date Fin"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                sx={{ width: 300 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>

            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="space-between"
              gap={2}
            >
              <Item sx={{ flex: "1 1 30%", backgroundColor: "#fcf2e6" }}>
                <CardInfo
                  title="TOTAL DES PRISES EN CHARGE"
                  value={data.totalPriseEnCharge}
                  icon={PersonAddAltOutlinedIcon}
                />
              </Item>
              <Item sx={{ flex: "1 1 30%", backgroundColor: "#fcf2e6" }}>
                <CardInfo
                  title="EFFECTIF TOTAL OPERATIONNEL"
                  value={
                    isNaN(totalEffectifOperationnel)
                      ? 0
                      : totalEffectifOperationnel
                  }
                  icon={Groups3OutlinedIcon}
                />
              </Item>
              <Item sx={{ flex: "1 1 30%", backgroundColor: "#fcf2e6" }}>
                {" "}
                <CardInfo
                  title="TOTAL DES UMMC INSTALLÉES"
                  value={isNaN(totalUMMCInstallees) ? 0 : totalUMMCInstallees}
                  icon={AddHomeWorkRoundedIcon}
                />
              </Item>
              <Item sx={{ flex: "1 1 30%", backgroundColor: "#fcf2e6" }}>
                <TrancheAge />
              </Item>
              <Item sx={{ flex: "1 1 30%", backgroundColor: "#fcf2e6" }}>
                <Pathologie />
              </Item>
              <Item
                sx={{
                  flex: "1 1 30%",

                  backgroundColor: "#fcf2e6",
                }}
              >
                {" "}
                <RepartitionParServices />
              </Item>
              <Item
                sx={{
                  flex: "1 1 30%",

                  backgroundColor: "#fcf2e6",
                }}
              >
                {" "}
                <Specialiste />
              </Item>
              <Item
                sx={{
                  flex: "1 1 30%",

                  backgroundColor: "#fcf2e6",
                }}
              >
                {" "}
                <TauxTeleExpertise />
              </Item>
            </Box>
          </div>
        )}
        {value === 1 && <Index />}
      </div>
    </div>
  );
};

export default Test;
