import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';

const ExportToExcelButton = ({ data, filename, loading, disabled }) => {

  const handleExport = () => {
    // Vérification de sécurité au cas où les données seraient vides ou non valides
    if (!data || data.length === 0) {
      console.log("Aucune donnée à exporter.");
      return;
    }

    // Le 'data' reçu en props est déjà parfaitement formaté par le composant parent.
    // Nous l'utilisons directement sans aucune transformation.
    const worksheet = XLSX.utils.json_to_sheet(data);

    // --- Amélioration : Ajustement automatique de la largeur des colonnes ---
    const columnWidths = Object.keys(data[0]).map(key => {
      // On prend la largeur du titre de la colonne comme base
      let maxLength = key.length;
      // On parcourt chaque ligne pour trouver la valeur la plus longue dans cette colonne
      data.forEach(row => {
        const value = row[key] ? String(row[key]) : '';
        if (value.length > maxLength) {
          maxLength = value.length;
        }
      });
      // On ajoute une petite marge
      return { wch: maxLength + 2 };
    });
    worksheet['!cols'] = columnWidths;
    // --- Fin de l'amélioration ---

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pointages');
    
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };
  
  return (
    <Button
      onClick={handleExport}
      color="secondary"
      variant="contained"
      startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <DownloadIcon />}
      disabled={loading || disabled} // Utilisation de la prop disabled
      fullWidth
      sx={{
        backgroundColor: 'secondary.main',
        '&:hover': {
          backgroundColor: 'secondary.dark',
        },
      }}
    >
      Exporter en Excel
    </Button>
  );
};

export default ExportToExcelButton;