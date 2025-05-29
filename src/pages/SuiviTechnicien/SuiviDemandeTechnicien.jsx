import React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TicketMaintenance from "./TicketMaintenance";
import TicketDemandes from "./TikcetDemandes";
import TicketVehicule from "./TicketVehicule";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const SuiviDemandeTechnicien = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="suivi tabs">
          <Tab label="Ticket intervention 🛠️" {...a11yProps(0)} />
          <Tab label="Ticket commandes 📦" {...a11yProps(1)} />
          <Tab label="Ticket véhicule 🛻" {...a11yProps(2)}  />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <TicketMaintenance />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <TicketDemandes />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <TicketVehicule/>
      </CustomTabPanel>
    </Box>
  );
};

export default SuiviDemandeTechnicien;
