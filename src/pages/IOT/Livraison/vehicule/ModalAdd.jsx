import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";
import VehicleForm from "./VehicleForm"; // Import the new VehicleForm component

const ModalAdd = ({
  modalopen,
  handleModalClose,
  formData,
  handleChange,
  handleSubmit,
  isEditing,
}) => {
  return (
    <div>
      <Dialog open={modalopen} onClose={handleModalClose}>
        <DialogTitle>
          {isEditing ? "Modifier le véhicule" : "Ajouter un nouveau véhicule"}
        </DialogTitle>
        <DialogContent>
          {/* Use the VehicleForm component */}
          <VehicleForm formData={formData} handleChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Annuler</Button>
          <Button onClick={handleSubmit}>
            {isEditing ? "Enregistrer les modifications" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ModalAdd;
