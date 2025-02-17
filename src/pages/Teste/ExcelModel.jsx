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
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convertir en tableau 2D

        if (jsonData.length === 0) {
          alert("Le fichier est vide ou mal formaté.");
          return;
        }

        // Récupérer les en-têtes (première ligne du fichier)
        const headers = jsonData[0];
        const fullData = jsonData
          .slice(1)
          .map((row) =>
            Object.fromEntries(headers.map((key, i) => [key, row[i]]))
          );

        // Vérifier s'il y a au moins 5 colonnes
        if (headers.length < 5) {
          alert("Le fichier ne contient pas assez de colonnes.");
          return;
        }

        // Extraire la 5ᵉ colonne uniquement
        const column5Key = headers[4]; // Nom de la colonne
        const column5Data = fullData.map((row) => ({
          [column5Key]: row[column5Key],
        }));

        // Envoyer toutes les données à l'API principale
        await axios.post(
          "http://localhost:3000/api/v1/ummcperformance",
          fullData
        );
        console.log("Toutes les données envoyées avec succès.");

        // Envoyer uniquement la 5ᵉ colonne à une autre API
        await axios.post(
          "http://localhost:3000/api/v1/anotherEndpoint",
          column5Data
        );
        console.log("Données de la 5ᵉ colonne envoyées avec succès.");

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
