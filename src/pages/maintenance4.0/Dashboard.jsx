import React from "react";
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

const Dashboard = () => {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    ...theme.applyStyles("dark", {
      backgroundColor: "#1E1E1E",
    }),
  }));
  return (
    <>
      <Location />
      <hr className="w-3/4 pb-4" />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={4}>
            <div>
              <ClotureNonCloture />
            </div>
          </Grid>
          <Grid item xs={12} lg={4}>
            <div>
              <BesoinTaux />
            </div>
          </Grid>
          <Grid item xs={12} lg={4}>
            <div>
              <BesoinVehicule />
            </div>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Item sx={{ backgroundColor: "#1E1E1E" }}>
              <CategorieMaintenance />
            </Item>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Item>
              <Mttr />
            </Item>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Item>
              <Tr />
            </Item>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Dashboard;
