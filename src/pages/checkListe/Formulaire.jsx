import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  Box,
  Switch,
  Typography,
  FormControlLabel,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

// Divided categories of items
const categories = {
  electrical: [
    "Ecran tactile 32 pouces ( BOX 1 )",
    "Ecran tactile 32 pouces ( BOX 2 )",
    "Mini-ordinateur ( BOX 1 )",
    "Mini-ordinateur ( BOX 2 )",
    "Ordinateur portable ( BOX 1 )",
    "Ordinateur portable ( BOX 2 )",
    "Tablette",
    "Haut-parleur multimédia ( BOX 1 )",
    "Haut-parleur multimédia ( BOX 2 )",
    "Caméra web ( BOX 1 )",
    "Caméra web ( BOX 2 )",
    "Interrupteur ( BOX 1 )",
    "Interrupteur ( BOX 2 )",
    "Climatiseur ( BOX 1 )",
    "Climatiseur ( BOX 2 )",
    "Chauffe-eau électrique",
    "Réfrigérateur",
    "Switch",
    "Caméra de vidéosurveillance ( BOX 1 )",
    "Caméra de vidéosurveillance ( BOX 2 )",
    "Routeur 4G",
    "NVR",
    "Clavier Logitech ( BOX 1 )",
    "Clavier Logitech ( BOX 2 )",
    "Prise réseau RJ45 ( BOX 1 )",
    "Prise réseau RJ45 ( BOX 2 )",
    "Rallonge",
  ],
  medical: [
    "Boitier Mediot ( BOX 1 )",
    "Boitier Mediot ( BOX 2 )",
    "Doclick",
    "Hub USB alimenté ( BOX 1 )",
    "Hub USB alimenté ( BOX 2 )",
    "Tensiomètre ( BOX 1 )",
    "Tensiomètre ( BOX 2 )",
    "Oxymètre ( BOX 1 )",
    "Oxymètre ( BOX 2 )",
    "ECG ( BOX 1 )",
    "ECG ( BOX 2 )",
    "Irisscope ( BOX 1 )",
    "Irisscope ( BOX 2 )",
    "Dermoscope ( BOX 1 )",
    "Dermoscope ( BOX 2 )",
    "Echographe",
    "Otoscope ( BOX 1 )",
    "Otoscope ( BOX 2 )",
    "Caméra mobile ( BOX 1 )",
    "Caméra mobile ( BOX 2 )",
    "Stéthoscope ( BOX 1 )",
    "Stéthoscope ( BOX 2 )",
    "Glucomètre ( BOX 1 )",
    "Glucomètre ( BOX 2 )",
    "Thermomètre ( BOX 1 )",
    "Thermomètre ( BOX 2 )",
    "Balance ( BOX 1 )",
    "Balance ( BOX 2 )",
    "Toise ( BOX 1 )",
    "Toise ( BOX 2 )",
    "Fauteuil médical ( BOX 1 )",
    "Fauteuil médical ( BOX 2 )",
  ],
  cabling: [
    "Câble HDMI ( BOX 1 )",
    "Câble HDMI ( BOX 2 )",
    "Câble UTP (Ethernet ) ( BOX 1 )",
    "Câble UTP (Ethernet) ( BOX 2 )",
    "Câble tactile ( BOX 1 )",
    "Câble tactile ( BOX 2 )",
    "Câble USB ( BOX 1 )",
    "Câble USB ( BOX 2 )",
    "Câble jack Mâle-Mâle ( BOX 1 )",
    "Câble jack Mâle-Mâle ( BOX 2 )",
  ],
  stock_management: [
    "Chariot métallique ( BOX 1 )",
    "Chariot métallique ( BOX 2 )",
    "Armoire",
    "Ciseau ( BOX 1 )",
    "Ciseau ( BOX 2 )",
    "Haricot ( BOX 1 )",
    "Haricot ( BOX 2 )",
    "Escabeau ( BOX 1 )",
    "Escabeau ( BOX 2 )",
    "Table ( BOX 1 )",
    "Table ( BOX 2 )",
    "Tabouret ( BOX 1 )",
    "Tabouret ( BOX 2 )",
    "Poubelle jaune ( BOX 1 )",
    "Poubelle jaune ( BOX 2 )",
    "Poubelle grise ( BOX 1 )",
    "Poubelle grise ( BOX 2 )",
    "Poubelle 120 L ",
    "Portrait",
    "Canapé",
  ],
  installation_material: [
    "Pergola montée en 2 parties ( BOX 1 )",
    "Pergola montée en 2 parties ( BOX 2 )",
    "Bâche avec structure",
    "Bâche beige",
    "banc",
    "Pot",
    "Gazon artificielle",
    "Extincteur CO2",
    "Extincteur liquide",
    "Plot",
    "Plaque d'Etain",
    "Morceau d'Alucobond",
    "Groupe électrogène",
    "Piquet terre",
    "Projecteur",
  ],
};

const FormulaireSimplifie = () => {
  const [dynamicActifs, setDynamicActifs] = useState([]);
  const [actifsData, setActifsData] = useState({});
  const [selectedUnite, setSelectedUnite] = useState("");
  const [technicien, setTechnicien] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const userIds = JSON.parse(localStorage.getItem("userActifs"));
    if (userIds && Array.isArray(userIds)) {
      const fetchData = async () => {
        const fetchedActifs = [];
        for (const id of userIds) {
          try {
            const response = await fetch(`${apiUrl}/api/actifs/${id}`);
            if (response.ok) {
              const data = await response.json();
              fetchedActifs.push(data);
            }
          } catch (error) {
            console.error("Error fetching data", error);
          }
        }
        setDynamicActifs(fetchedActifs);
      };
      fetchData();
    }
  }, []);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      if (userInfo.nomComplet) {
        setTechnicien(userInfo.nomComplet);
      }
    }
  }, []);

  const handleInputChange = (event, actif) => {
    const { name, value } = event.target;
    setActifsData((prevState) => ({
      ...prevState,
      [actif]: {
        ...prevState[actif],
        [name]: value,
      },
    }));
  };

  const handleSwitchChange = (event, actif) => {
    const { checked } = event.target;
    setActifsData((prevState) => ({
      ...prevState,
      [actif]: {
        ...prevState[actif],
        fonctionnel: checked, // Gardez la valeur booléenne
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      // Préparer les données d'équipement
      const equipmentData = {};

      // Parcourir toutes les catégories et tous les items
      Object.keys(categories).forEach((category) => {
        categories[category].forEach((item) => {
          // Récupérer les données de l'item ou utiliser les valeurs par défaut
          const itemData = actifsData[item] || {
            quantite: 1,
            fonctionnel: true,
          };

          // Convertir la valeur fonctionnel en "Oui"/"Non"
          equipmentData[item] = {
            quantite: itemData.quantite || 1,
            fonctionnel:
              itemData.fonctionnel === true || itemData.fonctionnel === "Oui"
                ? "Oui"
                : "Non",
          };
        });
      });

      const requestData = {
        selectedUnite,
        technicien,
        date: new Date().toISOString(),
        equipment: equipmentData,
      };

      console.log("Données envoyées:", requestData); // Pour débogage

      const response = await fetch(
        `${apiUrl}/api/v1/inventaire/actifsInventaire`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        setOpenDialog(true);
      } else {
        const errorData = await response.json();
        console.error("Erreur du serveur:", errorData);
        alert(
          `Erreur lors de la soumission: ${
            errorData.message || response.statusText
          }`
        );
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      alert("Une erreur est survenue lors de l'envoi du formulaire");
    }
  };

  // Initialize default values for each item
  const getDefaultValue = (item) => {
    return {
      quantite: actifsData[item]?.quantite || 1,
      fonctionnel:
        actifsData[item]?.fonctionnel !== undefined
          ? actifsData[item].fonctionnel
          : true, // true par défaut
    };
  };

  return (
    <Box p={2} maxWidth={800} mx="auto">
      <Typography variant="h5" align="center" gutterBottom>
        Formulaire d'Inventaire
      </Typography>

      <Box mb={3}>
        <TextField
          select
          label="Unité"
          variant="outlined"
          fullWidth
          value={selectedUnite}
          onChange={(e) => setSelectedUnite(e.target.value)}
          margin="normal"
          required
        >
          {dynamicActifs.map((actif) => (
            <MenuItem key={actif.id} value={actif.name}>
              {actif.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Technicien"
          variant="outlined"
          value={technicien}
          fullWidth
          disabled
          margin="normal"
        />

        <TextField
          label="Date et heure"
          variant="outlined"
          value={new Date().toLocaleString()}
          fullWidth
          disabled
          margin="normal"
        />
      </Box>

      {Object.keys(categories).map((category) => (
        <Accordion key={category}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              {category === "electrical" && "Alimentation électrique"}
              {category === "medical" && "Équipements médicaux"}
              {category === "cabling" && "Câblage"}
              {category === "stock_management" && "Gestion de stock et déchets"}
              {category === "installation_material" &&
                "Matériel d'installation"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {categories[category].map((item) => {
              const defaultValue = getDefaultValue(item);
              return (
                <Box
                  key={item}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                  p={1}
                  sx={{
                    borderBottom: "1px solid #eee",
                    "&:last-child": { borderBottom: "none" },
                  }}
                >
                  <Typography sx={{ flex: 1 }}>{item}</Typography>
                  <TextField
                    label="Quantité"
                    variant="outlined"
                    name="quantite"
                    type="number"
                    size="small"
                    value={defaultValue.quantite}
                    onChange={(e) => handleInputChange(e, item)}
                    sx={{ width: "100px", mx: 2 }}
                    inputProps={{ min: 1 }}
                  />
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      État:
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            defaultValue.fonctionnel === true ||
                            defaultValue.fonctionnel === "Oui"
                          }
                          onChange={(e) => handleSwitchChange(e, item)}
                          color="primary"
                        />
                      }
                      label={
                        defaultValue.fonctionnel === "Oui"
                          ? "Fonctionnel"
                          : "Défectueux"
                      }
                      labelPlacement="start"
                    />
                  </Box>
                </Box>
              );
            })}
          </AccordionDetails>
        </Accordion>
      ))}

      <Box mt={3} textAlign="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          size="large"
          sx={{ width: "200px" }}
        >
          Soumettre
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={() => window.location.reload()}>
        <DialogTitle>Merci pour votre contribution !</DialogTitle>
        <DialogContent>
          <Typography>
            Votre engagement nous aide à améliorer notre activité.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => window.location.reload()}
            variant="contained"
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormulaireSimplifie;
