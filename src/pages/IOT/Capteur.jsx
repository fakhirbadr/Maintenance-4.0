import Radio from "@mui/material/Radio";
import Location from "../../components/Location";
import Table from "./AlerteUp";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
} from "@mui/material";
import { useState } from "react";
import AlerteDown from "./AlerteDown";
import OffLines from "./OffLines";

const Capteur = () => {
  const [selectedTable, setSelectedTable] = useState("table1");

  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
  };

  return (
    <div>
      <div>
        <Location />
      </div>
      <div className=" ">
        <div className="flex gap-4 w-full justify-center items-center ">
          <FormControl>
            <RadioGroup
              defaultValue={selectedTable}
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              onChange={handleTableChange}
            >
              <FormControlLabel value="table1" control={<Radio />} label="UP" />
              <FormControlLabel
                value="table2"
                control={<Radio />}
                label="DOWN"
              />
              <FormControlLabel
                value="table3"
                control={<Radio />}
                label="OFFLINE"
              />
            </RadioGroup>
          </FormControl>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outlined">Télécharger Excel</Button>
        </div>

        {selectedTable === "table1" && (
          <div>
            <Table />
          </div>
        )}
        {selectedTable === "table2" && (
          <div>
            <AlerteDown />
          </div>
        )}
        {selectedTable === "table3" && (
          <div>
            <OffLines />
          </div>
        )}
      </div>
    </div>
  );
};

export default Capteur;
