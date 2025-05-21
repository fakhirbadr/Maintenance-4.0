import React from "react";
import Location from "../../components/Location";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CommandesRejetees from "./CommandesRejetees";
import MaintenanceRejetees from "./MaintenanceRejetees";

const DemandeRejat = () => {
  const theme = useTheme();
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const textColor =
    theme.palette.mode === "dark" ? "text-orange-500" : "text-blue-500";

  return (
    <div>
      <h1
        className={`mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl uppercase ${textColor}`}
      >
        Audit des commandes rejetées
      </h1>

      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="Audit Tabs">
              <Tab label="Commandes Rejetées" value="1" />
              <Tab label="Maintenance Rejetées" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            {/* ➔ Place ici ton contenu pour les commandes rejetées */}
            <CommandesRejetees />
          </TabPanel>
          <TabPanel value="2">
            {/* ➔ Place ici ton analyse */}
            <MaintenanceRejetees />
          </TabPanel>
          <TabPanel value="3">
            {/* ➔ Place ici ton historique */}
            <p>Historique des audits passés.</p>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};

export default DemandeRejat;
