import * as XLSX from "xlsx"; // Importation de la bibliothèque xlsx
import { Button } from "@mui/material"; // Utilisation de MUI pour le bouton

// Composant réutilisable pour l'exportation Excel
const ExcelExporter = ({ data, filename }) => {
  // Fonction pour gérer l'exportation
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data); // Conversion des données JSON en feuille de calcul
    const workbook = XLSX.utils.book_new(); // Création d'un nouveau classeur Excel
    XLSX.utils.book_append_sheet(workbook, worksheet, "Feuille 1"); // Ajout de la feuille dans le classeur
    XLSX.writeFile(workbook, `${filename}.xlsx`); // Téléchargement du fichier Excel
  };

  return (
    // Bouton pour déclencher l'exportation
    <Button variant="outlined" onClick={handleDownloadExcel}>
      Télécharger Excel
    </Button>
  );
};

export default ExcelExporter;
