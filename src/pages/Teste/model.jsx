import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import React from "react";

const Model = ({ open, onClose }) => {
  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>Ajouter un Stock</DialogTitle>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Model;
