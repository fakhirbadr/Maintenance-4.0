import React, { useState } from "react";
import Location from "../../components/Location";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import RapportIntervention from "./Intervention_Rapports/RapportIntervention";
import RapportCapteur from "./Rapport_Capteur/RapportCapteur";
import RapportLivraison from "./Rapport_Livraison/RapportLivraison";

import { useNavigate } from "react-router-dom"; // For navigation

const Rapports = () => {
  const [selectedTable, setSelectedTable] = useState("table1");

  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
  };
  return (
    <>
      <Location />
      <div className="flex justify-center">
        <FormControl>
          <RadioGroup
            defaultValue={selectedTable}
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            onChange={handleTableChange}
          >
            <FormControlLabel
              value="table1"
              control={<Radio />}
              label="Interventions"
            />
            <FormControlLabel
              value="table2"
              control={<Radio />}
              label="surveillance"
            />
            <FormControlLabel
              value="table3"
              control={<Radio />}
              label="Livraisons"
            />
          </RadioGroup>
        </FormControl>
      </div>

      {selectedTable === "table1" && (
        <div>
          <RapportIntervention />
        </div>
      )}
      {selectedTable === "table2" && (
        <div>
          <RapportCapteur />
        </div>
      )}
      {selectedTable === "table3" && (
        <div>
          <RapportLivraison />
        </div>
      )}
    </>
  );
};

export default Rapports;
