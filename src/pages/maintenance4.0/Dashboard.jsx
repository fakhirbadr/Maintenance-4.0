import React from "react";
import Location from "../../components/Location";
import ClotureNonCloture from "./Graph1/ClotureNonCloture";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

const Dashboard = () => {
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
  return (
    <>
      <Location />
      <hr className="w-3/4 pb-4" />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={3} lg={3}>
            <div>
              <ClotureNonCloture />
            </div>
          </Grid>
          <Grid item xs={3} lg={3}>
            <div>
              <ClotureNonCloture />
            </div>
          </Grid>
          <Grid item xs={3} lg={3}>
            <div>
              <ClotureNonCloture />
            </div>
          </Grid>
          <Grid item xs={3} lg={3}>
            <div>
              <ClotureNonCloture />
            </div>
          </Grid>
          <Grid item xs={4}>
            <Item>xs=4</Item>
          </Grid>
          <Grid item xs={4}>
            <Item>xs=4</Item>
          </Grid>
          <Grid item xs={8}>
            <Item>xs=8</Item>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Dashboard;
