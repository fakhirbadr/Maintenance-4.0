import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import * as XLSX from "xlsx";
import axios from "axios";

const ExcelModel = ({ open, handleCloseModal, selectedAction }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Fonction pour convertir les dates Excel en format JavaScript (string "YYYY-MM-DD")
  const excelDateToJSDate = (excelDate) => {
    // Si la date est déjà au bon format "YYYY-MM-DD"
    if (
      typeof excelDate === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(excelDate)
    ) {
      return excelDate;
    }

    // Si c'est un nombre (date Excel sérialisée)
    if (typeof excelDate === "number") {
      const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
      return jsDate.toISOString().split("T")[0];
    }

    // Si c'est une chaîne au format "DD/MM/YYYY"
    if (
      typeof excelDate === "string" &&
      /^\d{2}\/\d{2}\/\d{4}$/.test(excelDate)
    ) {
      const [day, month, year] = excelDate.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    // Si c'est un objet Date
    if (excelDate instanceof Date) {
      return excelDate.toISOString().split("T")[0];
    }

    console.error("Format de date non pris en charge :", excelDate);
    return null;
  };

  // Fonction pour gérer l'upload du fichier
  const handleUpload = async () => {
    if (!file) {
      alert("Veuillez sélectionner un fichier.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Conversion avec raw: false pour obtenir les dates formatées en string
        const jsonData = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          raw: false, // Important pour les dates formatées dans Excel
        });

        if (jsonData.length === 0) {
          alert("Le fichier est vide ou mal formaté.");
          return;
        }

        const headers = jsonData[0].map((h) => h.trim());
        const dateColumnIndex = headers.findIndex(
          (h) => h.toLowerCase() === "date"
        );

        // Traitement des données
        const fullData = jsonData
          .slice(1)
          .map((row) => {
            if (row.length !== headers.length) return null;

            const rowData = {};
            headers.forEach((header, index) => {
              let value = row[index] || "";

              // Conversion spécifique pour les dates
              if (index === dateColumnIndex) {
                value = excelDateToJSDate(value) || "";
              }

              rowData[header] = value;
            });

            return rowData;
          })
          .filter((row) => row !== null);

        // Vérification finale des dates
        const validatedData = fullData
          .map((row) => {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date)) {
              console.error("Date invalide après conversion :", row.date);
              return null;
            }
            return row;
          })
          .filter((row) => row !== null);

        if (validatedData.length === 0) {
          alert("Aucune donnée valide après conversion des dates.");
          return;
        }

        // Log des données validées
        console.log(
          "Données validées :",
          JSON.stringify(validatedData, null, 2)
        );

        try {
          // Envoi des données principales
          console.log(
            "Envoi des données principales à /api/v1/ummcperformance..."
          );
          await axios.post(
            "http://localhost:3000/api/v1/ummcperformance",
            validatedData
          );
          console.log("Données principales envoyées avec succès.");

          // Préparation des données pour TauxDeSaisie
          const tauxDeSaisieData = validatedData.map((row) => ({
            date: row.date,
            region: row.region,
            province: row.province,
            unite: row.unite,
            TauxDeSaisie: row.TauxDeSaisie,
          }));
          console.log(
            "Données TauxDeSaisie :",
            JSON.stringify(tauxDeSaisieData, null, 2)
          );

          // Envoi des données TauxDeSaisie
          console.log("Envoi des données TauxDeSaisie...");
          await axios.post(
            "http://localhost:3000/api/v1/TauxDeSaisie",
            tauxDeSaisieData
          );
          console.log("Données TauxDeSaisie envoyées avec succès.");

          // Préparation des données pour tauxDeCompletudeMedical
          const tauxDeCompletudeMedicalData = validatedData.map((row) => ({
            date: row.date,
            region: row.region,
            province: row.province,
            unite: row.unite,
            tauxCompletudeMedical: row.tauxCompletudeMedical,
          }));
          console.log(
            "Données tauxDeCompletudeMedical :",
            JSON.stringify(tauxDeCompletudeMedicalData, null, 2)
          );

          // Envoi des données tauxDeCompletudeMedical
          console.log("Envoi des données tauxDeCompletudeMedical...");
          await axios.post(
            "http://localhost:3000/api/v1/tauxDeCompletudeMedical",
            tauxDeCompletudeMedicalData
          );
          console.log("Données tauxDeCompletudeMedical envoyées avec succès.");

          // Préparation des données pour tauxDeCompletudeAdministratif
          const tauxCompletudeAdministratifData = validatedData.map((row) => ({
            date: row.date,
            region: row.region,
            province: row.province,
            unite: row.unite,
            tauxCompletudeAdministratif: row.tauxCompletudeAdministratif,
          }));
          console.log(
            "Données tauxDeCompletudeAdministratif :",
            JSON.stringify(tauxCompletudeAdministratifData, null, 2)
          );

          // Envoi des données tauxDeCompletudeAdministratif
          console.log("Envoi des données tauxDeCompletudeAdministratif...");
          await axios.post(
            "http://localhost:3000/api/v1/tauxDeCompletudeAdministratif",
            tauxCompletudeAdministratifData
          );
          console.log(
            "Données tauxDeCompletudeAdministratif envoyées avec succès."
          );

          // Préparation des données pour tauxDeCompletudeDeDossierComplet
          const tauxDeCompletudeDeDossierCompletData = validatedData.map(
            (row) => ({
              date: row.date,
              region: row.region,
              province: row.province,
              unite: row.unite,
              TauxDeCompletudeDeDossierComplet:
                row.TauxDeCompletudeDeDossierComplet,
            })
          );
          console.log(
            "Données tauxDeCompletudeDeDossierComplet :",
            JSON.stringify(tauxDeCompletudeDeDossierCompletData, null, 2)
          );

          // Envoi des données tauxDeCompletudeDeDossierComplet
          console.log("Envoi des données tauxDeCompletudeDeDossierComplet...");
          await axios.post(
            "http://localhost:3000/api/v1/tauxDeCompletudeDeDossierComplet",
            tauxDeCompletudeDeDossierCompletData
          );
          console.log(
            "Données tauxDeCompletudeDeDossierComplet envoyées avec succès."
          );

          // Préparation des données pour TauxDeCompletudeDesPrescriptions
          const tauxDeCompletudeDesPrescriptionstData = validatedData.map(
            (row) => ({
              date: row.date,
              region: row.region,
              province: row.province,
              unite: row.unite,
              TauxDeCompletudeDesPrescriptions:
                row.TauxDeCompletudeDesPrescriptions,
            })
          );
          console.log(
            "Données TauxDeCompletudeDesPrescriptions :",
            JSON.stringify(tauxDeCompletudeDesPrescriptionstData, null, 2)
          );

          // Envoi des données TauxDeCompletudeDesPrescriptions
          console.log("Envoi des données TauxDeCompletudeDesPrescriptions...");
          await axios.post(
            "http://localhost:3000/api/v1/TauxDeCompletudeDesPrescriptions",
            tauxDeCompletudeDesPrescriptionstData
          );
          console.log(
            "Données TauxDeCompletudeDesPrescriptions envoyées avec succès."
          );

          // Préparation des données pour tauxSpecialite
          const tauxSpecialiteData = validatedData.map((row) => ({
            date: row.datee,
            region: row.regionn,
            province: row.provincee,
            unite: row.unitee,
            specialite: row.specialite,
            plateau: row.plateau,
            NomdDuMedecinSpecialiste: row.NomdDuMedecinSpecialiste,
          }));
          console.log(
            "Données tauxSpecialite :",
            JSON.stringify(tauxSpecialiteData, null, 2)
          );

          // Envoi des données tauxSpecialite
          console.log("Envoi des données tauxSpecialite...");
          await axios.post(
            "http://localhost:3000/api/v1/tauxSpecialite",
            tauxSpecialiteData
          );
          console.log("Données tauxSpecialite envoyées avec succès.");

          // Préparation des données pour Pathologies
          const pathologiesData = validatedData.map((row) => ({
            date: row.date,
            region: row.region,
            province: row.province,
            unite: row.unite,
            HTA: row.HTA,
            SuiviDeGrossesse: row.SuiviDeGrossesse,
            Lombalgies: row.Lombalgies,
            Arthrose: row.Arthrose,
            RGO: row.RGO,
            Amygdalite: row.Amygdalite,
            Goitre: row.Goitre,
            Pharyngite: row.Pharyngite,
            Bronchite: row.Bronchite,
            Conjonctivite: row.Conjonctivite,
            Grippe: row.Grippe,
            Dysthyroidie: row.Dysthyroidie,
            Angines: row.Angines,
          }));
          console.log(
            "Données Pathologies :",
            JSON.stringify(pathologiesData, null, 2)
          );

          // Envoi des données Pathologies
          console.log("Envoi des données Pathologies...");
          await axios.post(
            "http://localhost:3000/api/v1/pathologies",
            pathologiesData
          );
          console.log("Données Pathologies envoyées avec succès.");

          alert("Données importées avec succès !");
          handleCloseModal();
        } catch (error) {
          console.error(
            "Erreur d'envoi :",
            error.response?.data || error.message
          );
          alert(
            "Échec de l'importation : " +
              (error.response?.data?.message || error.message)
          );
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Erreur de lecture :", error);
      alert("Erreur lors de la lecture du fichier");
    }
  };

  return (
    <Dialog open={open} onClose={handleCloseModal}>
      <DialogTitle>Mise à jour des données</DialogTitle>
      <DialogContent>
        <p style={{ margin: "16px 0" }}>
          Sélectionnez un fichier Excel (.xlsx, .xls) pour l'action :{" "}
          <strong>{selectedAction}</strong>
        </p>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            width: "100%",
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="primary" variant="outlined">
          Annuler
        </Button>
        <Button
          onClick={handleUpload}
          color="primary"
          variant="contained"
          disabled={!file}
        >
          Importer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExcelModel;
