import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import * as XLSX from "xlsx";
import axios from "axios";

const ExcelModel = ({ open, handleCloseModal, selectedAction }) => {
  const [file, setFile] = useState(null);

  // Fonction pour gérer le changement de fichier
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Fonction pour traiter le fichier et envoyer les données
  const handleUpload = async () => {
    if (!file) {
      alert("Veuillez sélectionner un fichier.");
      return;
    }

    try {
      // Lire le fichier Excel
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Supposons que les données sont dans la première feuille
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Envoyer les données à l'API
        const response = await axios.post(
          "http://localhost:3000/api/v1/ummcperformance",
          jsonData
        );
        console.log("Données envoyées avec succès :", response.data);
        alert("Les données ont été envoyées avec succès.");
        handleCloseModal();
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Erreur lors de l'envoi des données :", error);
      alert("Une erreur est survenue lors de l'envoi des données.");
    }
  };

  return (
    <>
      {/* Modal Dialog */}
      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Mettre à jour les données</DialogTitle>
        <DialogContent>
          <p>Importez un fichier Excel pour l'action : {selectedAction}.</p>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            style={{ marginTop: "16px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Annuler
          </Button>
          <Button onClick={handleUpload} color="secondary">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExcelModel;
