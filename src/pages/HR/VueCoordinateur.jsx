import { Grid, Paper } from "@mui/material";
import React from "react";

const VueCoordinateur = () => {
  return (
    <div style={{ height: "70vh", width: "100%", overflow: "hidden" }}>
      <Grid container spacing={2} sx={{ height: "100%", padding: 1 }}>
        {/* Partie gauche */}
        <Grid item xs={8}>
          <Paper
            sx={{
              height: "100%",
              backgroundColor: "#d1e7dd", // Vert clair
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 1,
            }}
          >
            <div>xxx</div>
          </Paper>
        </Grid>

        {/* Partie droite */}
        <Grid item xs={4}>
          <Paper
            sx={{
              height: "100%",
              backgroundColor: "#f8d7da", // Rouge clair
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 1,
            }}
          >
            <h2>Partie Droite</h2>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default VueCoordinateur;
