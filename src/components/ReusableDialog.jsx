import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

const ReusableDialog = ({ open, onClose, title, content, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="text-4xl font-extrabold dark:text-white justify-center flex pb-4">
        {title}
      </DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={onConfirm} color="primary">
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReusableDialog;
