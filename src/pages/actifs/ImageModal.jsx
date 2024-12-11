import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ImageModal = ({ open, onClose, image }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogActions>
        <IconButton onClick={onClose} color="primary" aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogActions>
      <DialogContent dividers>
        <img
          src={image}
          alt="Selected"
          style={{ width: "100%", height: "auto" }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
