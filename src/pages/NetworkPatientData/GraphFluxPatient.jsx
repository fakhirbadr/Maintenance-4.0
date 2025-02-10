import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StackedAreas from "./StackedAreas"; // Importation du graphique

const GraphFluxPatient = ({ open, handleClose, data }) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Graphique Flux Patient
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ width: "100%", height: "100%" }}>
        <StackedAreas data={data} />
      </DialogContent>
    </Dialog>
  );
};

export default GraphFluxPatient;
