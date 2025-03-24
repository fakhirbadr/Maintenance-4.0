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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
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
    "Plaque d’Etain",
    "Morceau d’Alucobond",
    "Groupe électrogène",
    "Piquet terre",
    "Projecteur",
  ],
};

const Formulaire = () => {
  const [actifsData, setActifsData] = useState({});
  const [dynamicActifs, setDynamicActifs] = useState([]);
  const [selectedUnite, setSelectedUnite] = useState("");
  const [technicien, setTechnicien] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [selectedActif, setSelectedActif] = useState("");
  const [openDialog, setOpenDialog] = React.useState(false);

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
  const handleSelectChange = (event) => {
    setSelectedActif(event.target.value);
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

  const handleSubmit = async () => {
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

        // Affiche un message de succès
        setOpenDialog(true);

        // Recharge la page
        // window.location.reload();
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
    "Équipements médicaux",
    "Alimentation électrique",
    "Câblage",
    "Gestion de stock et déchets",
    "Matériel d'installation",
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
            type="button" // Type "button" pour éviter la soumission automatique du formulaire
            variant="contained"
            color="primary"
            onClick={async () => {
              if (activeStep === steps.length - 1) {
                // Si c'est la dernière étape, appelle handleSubmit
                await handleSubmit();
              } else {
                // Sinon, passe simplement à l'étape suivante
                setActiveStep((prevStep) => prevStep + 1);
              }
            }}
          >
            {activeStep === steps.length - 1 ? "Soumettre" : "Suivant"}
          </Button>
        </Box>
      </form>
      <Dialog
        open={openDialog}
        onClose={() => window.location.reload()}
        PaperProps={{
          style: {
            borderRadius: "16px",
            padding: "20px",
            backgroundColor: "#2d3748",
            backgroundImage:
              "linear-gradient(145deg, rgba(45, 55, 72, 0.9), rgba(74, 85, 104, 0.9))",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <DialogTitle
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "#f7fafc",
            textAlign: "center",
            padding: "16px 24px 8px",
          }}
        >
          Merci, cher collaborateur ! ✨
        </DialogTitle>

        <DialogContent style={{ padding: "16px 24px" }}>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#e2e8f0",
              textAlign: "center",
              lineHeight: "1.6",
              margin: 0,
              opacity: 0.9,
            }}
          >
            Votre engagement nous aide à améliorer notre activité.
          </p>
        </DialogContent>

        <DialogActions
          style={{
            padding: "16px 24px",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={() => window.location.reload()}
            variant="contained"
            color="primary"
            autoFocus
            style={{
              padding: "8px 24px",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "500",
              textTransform: "none",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
              minWidth: "120px",
              backgroundColor: "#4299e1",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#3182ce",
              },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Formulaire;
