import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { faker } from "@faker-js/faker";
import { Button, Menu, MenuItem } from "@mui/material"; // Importation de MUI pour le Menu

function AlerteDown() {
  const [data, setData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = {
        id: faker.string.uuid(),
        dateheure: new Date().toLocaleString(),
        Serial: faker.word.noun(),
        temperature: faker.number.int({ min: -2, max: 6 }),
        reference: faker.string.alphanumeric(10), // Référence aléatoire
        nom: faker.person.fullName(), // Nom complet aléatoire
        marque: faker.company.name(), // Nom de marque aléatoire
        province: faker.location.city(), // Province aléatoire
        gravite: faker.helpers.arrayElement(["Basse", "Moyenne", "Haute"]), // Gravité aléatoire
      };

      setData((prevData) => [...prevData, newData]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Fonction pour ouvrir le menu déroulant
  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(id); // Stocker l'ID de la ligne sélectionnée
  };

  // Fonction pour gérer la sélection dans la liste déroulante
  const handleMenuItemClick = (action) => {
    const actionTimestamp = new Date().toLocaleString(); // Capturer la date et l'heure de l'action
    console.log(
      `Action sélectionnée pour la ligne ${selectedRowId}: ${action} à ${actionTimestamp}`
    );
    handleDelete(selectedRowId); // Supprimer la ligne après sélection
    handleClose(); // Fermer le menu
  };

  // Fonction pour fermer le menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Fonction pour supprimer une ligne par son ID
  const handleDelete = (id) => {
    setData((prevData) => prevData.filter((row) => row.id !== id));
  };

  // Filtrer les données pour n'afficher que celles avec température entre 50 et 100
  const filteredData = data.filter(
    (row) => row.temperature >= -2 && row.temperature <= 2
  );

  // Définition des colonnes
  const columns = [
    { field: "id", headerName: "ID", flex: 1, minWidth: 100 }, // Utiliser flex pour s'adapter à l'écran
    { field: "dateheure", headerName: "date/heure", flex: 1, minWidth: 180 },
    { field: "Serial", headerName: "Serial", flex: 1, minWidth: 130 },
    {
      field: "temperature",
      headerName: "Température (°C)",
      flex: 1,
      minWidth: 150,
    },
    { field: "reference", headerName: "Référence", flex: 1, minWidth: 150 },
    { field: "nom", headerName: "Nom", flex: 1, minWidth: 150 },
    { field: "marque", headerName: "Marque", flex: 1, minWidth: 150 },
    { field: "province", headerName: "Province", flex: 1, minWidth: 130 },
    { field: "gravite", headerName: "Gravité", flex: 1, minWidth: 130 },
    {
      field: "action", // Colonne "Action"
      headerName: "Action",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="secondary"
            onClick={(event) => handleMenuClick(event, params.row.id)} // Appel pour ouvrir le menu
          >
            Clôturer
          </Button>
        </>
      ),
    },
  ];

  return (
    <div
      className="pt-8"
      style={{
        display: "flex",
        justifyContent: "center", // Centrer horizontalement
        alignItems: "center", // Centrer verticalement
        width: "100%", // Prendre 100% de la largeur
      }}
    >
      <div style={{ height: "100vh", width: "100%" }}>
        {" "}
        {/* Prend toute la hauteur et largeur */}
        <DataGrid
          rows={filteredData} // Affiche uniquement les lignes filtrées
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          autoHeight // Permet de s'adapter automatiquement à la hauteur
        />
      </div>

      {/* Menu déroulant pour l'action de clôture */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleMenuItemClick("Ouverture de porte")}>
          Ouverture de porte
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("Dégivrage")}>
          Dégivrage
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("Coupure d'électricité")}>
          Coupure d'électricité
        </MenuItem>
      </Menu>
    </div>
  );
}

export default AlerteDown;
