import {
  Card,
  Grid,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import React, { useState } from "react";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";

const InactiveUnitTracker = () => {
  const raisons = ["Intempéries", "Véhicule en panne"]; // Liste des raisons
  const [selectedActif, setSelectedActif] = useState("");

  const handleSelectChange = (event) => {
    setSelectedActif(event.target.value); // Utiliser le nom de l'actif
  };
  return (
    <div>
      <Grid item xs={12} md={4} display="flex">
        <Card
          sx={{
            p: 3,
            boxShadow: 3,
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <EventBusyOutlinedIcon fontSize="large" color="error" />
            <Typography variant="h5" fontWeight="bold">
              UMMC inactive
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" gap={2}>
            {/* Inputs "De" et "À" sur la même ligne */}
            <Box display="flex" gap={2}>
              <TextField
                type="time"
                label="De"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                defaultValue="09:00"
                fullWidth
              />
              <TextField
                type="time"
                label="À"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                defaultValue="16:00"
                fullWidth
              />
            </Box>

            {/* Inputs "Le" et "Raison" sur la même ligne */}
            <Box display="flex" gap={2}>
              <TextField
                type="date"
                label="Le"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField select label="Raison" variant="outlined" fullWidth>
                {raisons.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="center"
              alignItems="center"
              gap={2}
            >
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Choisir un Actif</InputLabel>
                <Select
                  value={selectedActif} // Utilisez selectedActif (nom de l'actif)
                  onChange={handleSelectChange}
                  label="Choisir un Actif"
                >
                  {dynamicActifs.map((actif) => (
                    <MenuItem key={actif._id} value={actif.name}>
                      {" "}
                      {/* Utilisez le nom ici */}
                      {actif.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Button>ENVOYER</Button>
          </Box>
        </Card>
      </Grid>
    </div>
  );
};

export default InactiveUnitTracker;
