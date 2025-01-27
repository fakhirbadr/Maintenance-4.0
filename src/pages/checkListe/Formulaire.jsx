import React, { useEffect, useState } from "react";
import {
  FormControlLabel,
  Checkbox,
  FormGroup,
  Button,
  TextField,
  Box,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

// Divided categories of items
const categories = {
  medical: [
    "BALANCE",
    "BOITIER MEDIOT",
    "BRASSARD TENSIOMETRE",
    "CONCENTRATEUR OXYGENE",
    "DÉBITMÈTRES D'OXYGÈNE",
    "DIVAN D'EXAMEN",
    "DOCLICK",
    "DRAP D'EXAMEN",
    "ECG 12 Deriviations",
    "LUNETTE OXYGÈNE",
    "NÉBULISEUR",
    "OTOSCOPE CONNECTÉ",
    "OTOSCOPE MANUEL",
    "OXYMÈTRE CONNECTÉ",
    "OXYMÈTRE MANUEL",
    "PÈSE BÉBÉ",
    "STÉTHOSCOPE MANUEL",
    "TENSIOMETRE CONNECTE",
    "TENSIOMETRE DIGITALE",
    "TENSIOMETRE MANUEL",
    "THERMOMÈTRE",
  ],
  electrical: [
    "BATTERIE GROUPE ELECTROGENE",
    "CABLE LIAISON GROUPE ELECTROGENE",
    "GROUPE ELECTROGENE",
    "ONDULEUR",
    "RALLONGE 10M",
    "RALLONGE 4M",
    "TÉLÉRUPTEUR",
    "ADAPTATEUR DISPLAY/HDMI",
    "CÂBLE HDMI 10M",
    "CABLE TENSIOMETRE",
    "CÂBLE USB 10M MALE/FEMELLE",
  ],
  tools: [
    "CAISSE OUTILLAGE TECHNICIEN",
    "CAMERA SURVEILLANCE",
    "CANON POUR LA PORTE D’UNITÉ",
    "EXTINCTEUR",
    "Fluxible mélangeur 1/2f pour lavabo",
    "GAZON ARTIFICIEL",
    "MARTEAU REFLEXE",
    "MECANISME CHASSE D'EAU (TOILETTE)",
    "MÉLANGEUR",
    "MINI-REFRIGERATEUR",
  ],
  accessories: [
    "CLAVIER",
    "CLAVIER PC PROTABLE",
    "CLE WIFI 5 G",
    "CONNECTEUR RJ45",
    "DISQUE DUR PC PORTABLE",
    "ÉCRAN",
    "MIC JABRA",
    "MINI PC",
    "ROUTEUR WIFI",
    "SWITCH",
  ],
};

const Formulaire = () => {
  const [actifsData, setActifsData] = useState({});
  const [dynamicActifs, setDynamicActifs] = useState([]);
  const [selectedUnite, setSelectedUnite] = useState("");
  const [technicien, setTechnicien] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const userIds = JSON.parse(localStorage.getItem("userActifs"));
    if (userIds && Array.isArray(userIds)) {
      const fetchedActifs = [];
      userIds.forEach(async (id) => {
        try {
          const response = await fetch(`${apiUrl}/api/actifs/${id}`);
          if (response.ok) {
            const data = await response.json();
            fetchedActifs.push(data);
            if (fetchedActifs.length === userIds.length) {
              setDynamicActifs(fetchedActifs);
            }
          }
        } catch (error) {
          console.error("Error fetching data", error);
        }
      });
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

    // Initialisation sécurisée de l'objet actif
    setActifsData((prevState) => ({
      ...prevState,
      [actif]: {
        ...prevState[actif],
        [name]: value || "", // Valeur par défaut pour éviter les erreurs
      },
    }));
  };

  const handleCheckboxChange = (event, actif) => {
    const { name } = event.target;

    // Initialisation sécurisée de l'objet actif
    setActifsData((prevState) => ({
      ...prevState,
      [actif]: {
        ...prevState[actif],
        fonctionnel:
          name === "fonctionnel"
            ? prevState[actif]?.fonctionnel === "Oui"
              ? "Non"
              : "Oui"
            : prevState[actif]?.fonctionnel || "Non",
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const requestData = {
        selectedUnite,
        technicien,
        date: new Date().toISOString(),
        equipment: actifsData,
      };

      const response = await fetch(
        `${apiUrl}/api/v1/inventaire/actifsInventaire`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Réponse de l'API :", data);
      } else {
        const errorData = await response.json();
        alert(
          `Erreur lors de la soumission: ${
            errorData.message || response.statusText
          }`
        );
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      alert("Une erreur s'est produite lors de la soumission du formulaire.");
    }
  };

  const steps = [
    "Équipement Médical",
    "Équipement Électrique",
    "Outils",
    "Accessoires",
  ];

  return (
    <div>
      <Stepper className="pb-9" activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form style={{ width: "80%", margin: "0 auto" }} onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 3,
            gap: 2,
          }}
        >
          <TextField
            select
            label="Sélectionnez une unité"
            variant="outlined"
            required
            fullWidth
            value={selectedUnite}
            onChange={(e) => setSelectedUnite(e.target.value)}
            sx={{ flex: 1 }}
          >
            {dynamicActifs.map((actif) => (
              <MenuItem key={actif.id} value={actif.name}>
                {actif.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Date et heure d'aujourd'hui"
            variant="outlined"
            type="datetime-local"
            value={new Date().toISOString().slice(0, 16)}
            disabled
            sx={{ flex: 1 }}
          />

          <TextField
            label="Nom du technicien"
            variant="outlined"
            value={technicien}
            disabled
            sx={{ flex: 1 }}
          />
        </Box>

        {Object.keys(categories)[activeStep] &&
          categories[Object.keys(categories)[activeStep]].map((item) => (
            <Box
              key={item}
              sx={{
                marginBottom: 1,
                padding: 1,
                border: "1px solid #ccc",
                borderRadius: "3px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ flex: 1, fontWeight: "bold", textAlign: "center" }}>
                  {item}
                </Box>

                <TextField
                  label="Quantité"
                  variant="outlined"
                  name="quantite"
                  type="number"
                  value={actifsData[item]?.quantite || ""}
                  onChange={(e) => handleInputChange(e, item)}
                  // required
                  sx={{ flex: 2 }}
                />

                <FormGroup
                  row
                  sx={{
                    flex: 3,
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={actifsData[item]?.fonctionnel === "Oui"}
                        onChange={(e) => handleCheckboxChange(e, item)}
                        name="fonctionnel"
                      />
                    }
                    label="Fonctionnel"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={actifsData[item]?.fonctionnel === "Non"}
                        onChange={(e) => handleCheckboxChange(e, item)}
                        name="fonctionnel"
                      />
                    }
                    label="Non fonctionnel"
                  />
                </FormGroup>
              </Box>
            </Box>
          ))}

        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => setActiveStep((prevStep) => prevStep - 1)}
            disabled={activeStep === 0}
          >
            Précédent
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => {
              if (activeStep === steps.length - 1) {
                handleSubmit();
              } else {
                setActiveStep((prevStep) => prevStep + 1);
              }
            }}
          >
            {activeStep === steps.length - 1 ? "Soumettre" : "Suivant"}
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default Formulaire;
