import React, { useEffect, useState } from "react";
import Location from "../../components/Location";
import { Badge, Button, Collapse, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import axios from "axios";
import * as XLSX from "xlsx"; // Import de la bibliothèque xlsx

// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const Alerte = () => {
  const [ticketData, setTicketData] = useState([]);
  const [fournitureData, setFournitureData] = useState([]);
  const [showAllTickets, setShowAllTickets] = useState(false);
  const [showAllFourniture, setShowAllFourniture] = useState(false);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }));

  // Fonction pour calculer le temps écoulé
  const calculateElapsedTime = (dateCreation) => {
    const creationDate = new Date(dateCreation);
    const now = new Date();
    const diffInMilliseconds = now - creationDate;

    // Calculer les jours, heures et minutes
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const days = Math.floor(diffInMinutes / (60 * 24));
    const hours = Math.floor((diffInMinutes % (60 * 24)) / 60);
    const minutes = diffInMinutes % 60;

    return `${days}j ${hours}h ${minutes}m`;
  };

  // Calculer les alertes selon le rôle de l'utilisateur
  const filterDataByRole = (data, role) => {
    const timeThreshold = role === "superviseur" ? 4320 : 4320; // 1 minute pour superviseur, 2 minutes pour admin
    return data.filter((item) => {
      const creationDate = new Date(item.createdAt || item.dateCreation);
      const now = new Date();
      const diffInMilliseconds = now - creationDate;
      const diffInMinutes = diffInMilliseconds / (1000 * 60); // Convertir en minutes
      return diffInMinutes > timeThreshold; // Filtrer selon le seuil de temps
    });
  };

  useEffect(() => {
    // Récupérer le rôle de l'utilisateur depuis localStorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userRole = userInfo?.role || "admin"; // Par défaut, "admin" si pas trouvé

    const fetchTicketData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/ticketMaintenance?isClosed=false&isDeleted=false`
        );
        const fetchedData = response.data;

        // Filtrer les tickets en fonction du rôle
        const filteredData = filterDataByRole(fetchedData, userRole);
        setTicketData(filteredData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    const fetchFournitureData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/fournitureRoutes?isClosed=false&isDeleted=false`
        );
        const fetchedData = response.data.fournitures;

        // Filtrer les données de fourniture en fonction du rôle
        const filteredFournitureData = filterDataByRole(fetchedData, userRole);
        setFournitureData(filteredFournitureData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchTicketData();
    fetchFournitureData();
  }, []);

  // Fonction pour exporter les données en Excel
  // Fonction pour exporter les données en Excel avec un en-tête coloré
  const exportToExcel = (data, fileName) => {
    const filteredData = data.map((item) => {
      const elapsedTime = calculateElapsedTime(item.dateCreation);
      return {
        name: item.name,
        region: item.region,
        province: item.province,
        besoin: item.besoin,
        quantite: item.quantite,
        technicien: item.technicien,
        commentaire: item.commentaire,
        status: item.status,
        dateCreation: item.dateCreation,
        tempsEcoule: elapsedTime,
      };
    });

    // Créer une feuille Excel
    const worksheet = XLSX.utils.json_to_sheet(filteredData, {
      skipHeader: true,
    }); // Ne pas ajouter d'en-tête automatique

    // Ajouter un en-tête personnalisé
    const header = [
      "Nom",
      "Région",
      "Province",
      "Besoin",
      "Quantité",
      "Technicien",
      "Commentaire",
      "Statut",
      "Date Création",
      "Temps Écoulé",
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: "A1" });

    // Appliquer le style à l'en-tête
    const headerStyle = {
      fill: {
        patternType: "solid",
        fgColor: { rgb: "0000FF" }, // Fond bleu
      },
      font: {
        color: { rgb: "FFFFFF" }, // Texte blanc
        bold: true, // Texte en gras
      },
      alignment: {
        horizontal: "center", // Centrer le texte
      },
    };

    // Appliquer le style à chaque cellule de l'en-tête
    for (let C = 0; C < header.length; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C }); // Ligne 0, colonne C
      if (!worksheet[cellAddress]) worksheet[cellAddress] = {};
      worksheet[cellAddress].s = headerStyle;
    }

    // Ajuster la largeur des colonnes
    const colWidths = header.map((h) => ({ wch: h.length + 5 })); // Ajuster la largeur en fonction de la longueur du texte
    worksheet["!cols"] = colWidths;

    // Créer un nouveau classeur et ajouter la feuille
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Données");

    // Exporter le fichier Excel
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <div>
      <div className="mr-auto">
        <Location />
      </div>

      <div>
        <Grid container spacing={2}>
          {/* Première colonne - Tickets */}
          <Grid item xs={12} sm={6}>
            <Item>
              <h1 className="text-4xl font-bold mb-4">
                <span className="text-yellow-500 uppercase text-4xl font-bold mb-4">
                  Alertes
                </span>{" "}
                Tickets Maintenances{" "}
                <Badge
                  badgeContent={ticketData.length}
                  color="error"
                  sx={{ ml: 3 }}
                />
              </h1>
              <div className="w-full">
                {ticketData.slice(0, 5).map((ticket, index) => (
                  <div key={ticket._id || index} className="mb-2">
                    <div className="relative h-full">
                      <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-indigo-500 rounded-lg"></span>
                      <div className="relative h-full p-3 bg-white border-2 border-indigo-500 rounded-lg">
                        <div className="flex items-center -mt-1">
                          <h3 className="my-1 ml-3 text-sm font-bold text-gray-800">
                            {ticket.site} / {ticket.region} / {ticket.province}
                          </h3>
                        </div>
                        <p className=" mb-1 text-xs font-medium text-indigo-500 uppercase">
                          {ticket.categorie || "Catégorie non spécifiée"} |{" "}
                          {ticket.equipement_deficitaire ||
                            "Équipement défectueux non spécifié"}
                        </p>
                        <p className="mb-2 text-sm text-gray-600">
                          Technicien : {ticket.technicien} / Temps écoulé :{" "}
                          {calculateElapsedTime(ticket.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={() => setShowAllTickets(!showAllTickets)}
                  variant="outlined"
                  color="primary"
                  fullWidth
                >
                  {showAllTickets ? "Voir moins" : "Voir plus"}
                </Button>
                <Collapse in={showAllTickets}>
                  {ticketData.slice(5).map((ticket, index) => (
                    <div key={ticket._id || index} className="mb-2">
                      <div className="relative h-full">
                        <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-indigo-500 rounded-lg"></span>
                        <div className="relative h-full p-3 bg-white border-2 border-indigo-500 rounded-lg">
                          <div className="flex items-center -mt-1">
                            <h3 className="my-1 ml-3 text-sm font-bold text-gray-800">
                              {ticket.site} / {ticket.region} /{" "}
                              {ticket.province}
                            </h3>
                          </div>
                          <p className="mb-1 text-xs font-medium text-indigo-500 uppercase">
                            {ticket.categorie || "Catégorie non spécifiée"} |{" "}
                            {ticket.equipement_deficitaire ||
                              "Équipement défectueux non spécifié"}
                          </p>
                          <p className="mb-2 text-sm text-gray-600">
                            Technicien : {ticket.technicien} / Temps écoulé :{" "}
                            {calculateElapsedTime(ticket.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </Collapse>
              </div>
            </Item>
          </Grid>

          {/* Deuxième colonne - Fourniture Routes */}
          <Grid item xs={12} sm={6}>
            <Item>
              <h1 className="text-4xl font-bold mb-4">
                <span className="text-yellow-500 uppercase text-4xl font-bold mb-4">
                  Alertes
                </span>{" "}
                Tickets commandes{" "}
                <Badge
                  badgeContent={fournitureData.length}
                  color="error"
                  sx={{ ml: 3 }}
                />
              </h1>
              <div className="w-full">
                {fournitureData.slice(0, 5).map((route, index) => (
                  <div key={route._id || index} className="mb-2">
                    <div className="relative h-full">
                      <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-green-500 rounded-lg"></span>
                      <div className="relative h-full p-3 bg-white border-2 border-green-500 rounded-lg">
                        <div className="flex items-center -mt-1">
                          <h3 className="my-1 ml-3 text-sm font-bold text-gray-800">
                            {route.name} / {route.region} / {route.province}
                          </h3>
                        </div>
                        <p className="mb-1 text-xs font-medium text-green-500 uppercase">
                          {route.categorie || "Catégorie non spécifiée"} |{" "}
                          {route.besoin || "Équipement défectueux non spécifié"}
                        </p>
                        <p className="mb-2 text-sm text-gray-600">
                          {route.technicien} / Temps écoulé :{" "}
                          {calculateElapsedTime(route.dateCreation)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={() => setShowAllFourniture(!showAllFourniture)}
                  variant="outlined"
                  color="primary"
                  fullWidth
                >
                  {showAllFourniture ? "Voir moins" : "Voir plus"}
                </Button>
                <Collapse in={showAllFourniture}>
                  {fournitureData.slice(5).map((route, index) => (
                    <div key={route._id || index} className="mb-2">
                      <div className="relative h-full">
                        <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-green-500 rounded-lg"></span>
                        <div className="relative h-full p-3 bg-white border-2 border-green-500 rounded-lg">
                          <div className="flex items-center -mt-1">
                            <h3 className="my-1 ml-3 text-sm font-bold text-gray-800">
                              {route.name} / {route.region} / {route.province}
                            </h3>
                          </div>
                          <p className="mb-1 text-xs font-medium text-green-500 uppercase">
                            {route.categorie || "Catégorie non spécifiée"} |{" "}
                            {route.besoin ||
                              "Équipement défectueux non spécifié"}
                          </p>
                          <p className="mb-2 text-sm text-gray-600">
                            Technicien : {route.technicien} / Temps écoulé :{" "}
                            {calculateElapsedTime(route.dateCreation)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </Collapse>
                {/* Bouton pour exporter en Excel */}
                <Button
                  onClick={() => exportToExcel(fournitureData, "commandes")}
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{ marginTop: "10px" }}
                >
                  Exporter en Excel
                </Button>
              </div>
            </Item>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Alerte;
