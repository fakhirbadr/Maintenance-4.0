import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Box,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Autocomplete,
} from "@mui/material";
import axios from "axios";

const steps = [
  "Informations Générales",
  "Données Chiffrées",
  "Dépistages & Consultations",
  "Démographie & Urgences",
  "Pathologies Fréquentes",
];

const fieldLabels = {
  totalPriseEnCharge: "Total Prise En Charge",
  effectifTotalOperationnel: "Effectif Total Opérationnel",
  totalUMMCInstallees: "Total UMMC Installées",
  Consultation: "Consultation Médecine Générale",
  Teleexpertises: "Téléexpertises",
  Referencement: "Référencement",
  DepistageDiabete: "Dépistage Diabète",
  DepistageHTA: "Dépistage HTA",
  DepistageCancerDuSein: "Dépistage Cancer du Sein",
  DepistageDuCancerDuCol: "Dépistage Cancer du Col",
  TestCovid19Positif: "Tests COVID-19 Positifs",
  TestCovid19Negatif: "Tests COVID-19 Négatifs",
  CasDeRougeole: "Cas de Rougeole",
  SuiviDeGrossesse: "Suivi de Grossesse",
  GrossesseARisque: "Grossesses à Risque",
  PathologieFrequente1: "Pathologie 1",
  PathologieFrequente2: "Pathologie 2",
  PathologieFrequente3: "Pathologie 3",
  PathologieFrequente4: "Pathologie 4",
  PathologieFrequente5: "Pathologie 5",
};

const DialogMedcin = ({ open, handleClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeStep, setActiveStep] = useState(0);

  const [names, setNames] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    region: "",
    province: "",
    unite: "",
    totalPriseEnCharge: "",
    effectifTotalOperationnel: "",
    totalUMMCInstallees: "",
    Consultation: "",
    Teleexpertises: "",
    Referencement: "",
    Evacuation: "",
    DepistageDiabete: "",
    DepistageHTA: "",
    ageGroup0to6: "",
    ageGroup7to14: "",
    ageGroup15to24: "",
    ageGroup25to64: "",
    ageGroup65to100: "",

    soins: "",
    Vaccination: "",
    DepistageCancerDuSein: "",
    DepistageDuCancerDuCol: "",
    TestCovid19Positif: "",
    TestCovid19Negatif: "",
    CasDeRougeole: "",
    Oreillon: "",
    SuiviDeGrossesse: "",
    GrossesseARisque: "",
    Femme: "",
    Homme: "",
    Transfert: "",
    Urgence: "",
    PathologieFrequente1: "",
    PathologieFrequente2: "",
    PathologieFrequente3: "",
    PathologieFrequente4: "",
    PathologieFrequente5: "",
  });

  // Liste des pathologies pour l'autocomplétion
  const pathologiesList = [
    "Acné",
    "Algie Pelvienne",
    "Amygdalite",
    "Amygdalite Aigue",
    "Aménorrhée",
    "Anémie",
    "Angine",
    "Angines",
    "Arthralgie",
    "Arthralgies",
    "Arthrose",
    "Asthénie",
    "BAV",
    "Bronchite",
    "Bronchite aiguë",
    "Candidose",
    "Cataracte",
    "Céphalée",
    "Chalazion",
    "Colique néphrétique",
    "Colopathie fonctionnelle",
    "Conjonctivite",
    "Conjonctivite allergique",
    "Conjonctivite bactérienne",
    "Conjonctivite virale",
    "Constipation Chronique",
    "Cycle irrégulier",
    "Dacryocystite",
    "Détresse respiratoire",
    "Dermite",
    "Dermatite atopique",
    "Diabète",
    "Diarrhée",
    "Douleur abdominale",
    "Douleur articulaire",
    "Douleur lombaire",
    "Dyspnée",
    "Dyspepsie",
    "Eczéma",
    "Engelure",
    "Enurésie nocturne",
    "Epigastralgie",
    "Eruption cutanée",
    "Eventration",
    "Fièvre",
    "Fibrome utérin",
    "Gale",
    "Gastro-entérite",
    "Gonalgie",
    "Gonarthrose",
    "Grippe",
    "GFA",
    "GHMN",
    "Hernie discale",
    "Hernie inguinale",
    "Herpès génital",
    "HTA",
    "Hypospadias",
    "Hypothyroïdie",
    "Infection urinaire",
    "Irritation cutanée",
    "IRABC",
    "La gale",
    "Leucorrhée",
    "Leucoencéphalopathie hypertensive",
    "Lombago",
    "Lombalgie",
    "Lombosciatalgie",
    "Ménopause",
    "Ménométrorragie",
    "Myopathie",
    "OMA",
    "Oreillons",
    "Otite",
    "Otorrhée",
    "Ovaire polykystique",
    "Oxyurose",
    "Palpitations",
    "Pelade",
    "Pharyngite",
    "Pneumonie",
    "Pollakiurie",
    "Prurigo",
    "Prurigo aigu",
    "Psoriasis",
    "Ptérygion",
    "RGO",
    "Rhinite",
    "Rhinopharyngite",
    "Rhumatisme",
    "Rougeole",
    "SCA avec ST+",
    "Sd bronchique",
    "Sd de l’intestin irritable",
    "Sd grippal",
    "Sd irritatif",
    "Sécheresse oculaire",
    "Sinusite",
    "Soins",
    "Suivi de grossesse",
    "Suivi diabète",
    "Suivi HTA",
    "Tendinite",
    "Thyroïdite",
    "Toux",
    "Toux sèche",
    "Urticaire",
    "Vertige",
  ];

  const [ageError, setAgeError] = useState("");

  const handleSelectChange = (e) => {
    const selectedName = e.target.value;
    const selectedActif = names.find((actif) => actif.name === selectedName);

    if (selectedActif) {
      setFormData((prev) => ({
        ...prev,
        name: selectedName,
        province: selectedActif.province,
        region: selectedActif.region,
      }));
    }
  };

  const handlePathologyChange = (index, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [`PathologieFrequente${index + 1}`]: value,
    }));
  };

  const handleNext = () => {
    if (activeStep === 3) {
      // Vérifier la somme des tranches d'âge
      const totalAge =
        Number(formData.ageGroup0to6 || 0) +
        Number(formData.ageGroup7to14 || 0) +
        Number(formData.ageGroup15to24 || 0) +
        Number(formData.ageGroup25to64 || 0) +
        Number(formData.ageGroup65to100 || 0);

      const totalGender =
        Number(formData.Femme || 0) + Number(formData.Homme || 0);

      if (totalAge !== totalGender) {
        setAgeError(
          "La somme des tranches d'âge doit être égale à la somme des hommes et des femmes."
        );
        return;
      } else {
        setAgeError("");
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  // const handleSubmit = () => {
  //   console.log("Données soumises:", formData);
  //   handleClose();
  //   setActiveStep(0);
  // };

  const handleSubmit = async () => {
    try {
      // Créer une copie de formData
      const dataToSend = { ...formData };

      // Remplacer "name" par "unite"
      dataToSend.unite = dataToSend.name; // Copier la valeur de "name" dans "unite"
      delete dataToSend.name; // Supprimer la clé "name"

      // Envoyer les données modifiées
      const response = await axios.post(
        "http://localhost:3000/api/v1/ummcperformance",
        dataToSend
      );

      console.log("Données soumises avec succès:", response.data);
      handleClose();
      setActiveStep(0);
    } catch (error) {
      console.error("Erreur lors de la soumission des données:", error);
    }
  };

  useEffect(() => {
    const userIds = JSON.parse(localStorage.getItem("userActifs"));
    if (userIds && Array.isArray(userIds)) {
      const fetchedNames = [];
      userIds.forEach(async (id) => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/actifs/${id}`
          );
          if (response.ok) {
            const data = await response.json();
            fetchedNames.push(data);
            if (fetchedNames.length === userIds.length) {
              setNames(fetchedNames);

              // Mise à jour des données initiales
              const firstActif = fetchedNames[0];
              if (firstActif) {
                setFormData((prev) => ({
                  ...prev,
                  name: firstActif.name,
                  province: firstActif.province,
                  region: firstActif.region,
                }));
              }
            }
          } else {
            console.error(`Erreur pour l'ID ${id}: ${response.statusText}`);
          }
        } catch (error) {
          console.error(
            `Erreur lors de la récupération des données pour l'ID ${id}:`,
            error
          );
        }
      });
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Calculer la somme des autres champs
      const total =
        (Number(updatedData.ConsultationMedcineGenerale) || 0) +
        (Number(updatedData.soins) || 0) +
        (Number(updatedData.Teleexpertises) || 0) +
        (Number(updatedData.Vaccination) || 0) +
        (Number(updatedData.Referencement) || 0) +
        (Number(updatedData.Evacuation) || 0);

      return { ...updatedData, totalPriseEnCharge: total };
    });
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Région"
                name="region"
                value={formData.region}
                onChange={handleChange}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Province"
                name="province"
                value={formData.province}
                onChange={handleChange}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mt: 0 }}>
                <InputLabel id="select-label">Nom de l'Actif</InputLabel>
                <Select
                  labelId="select-label"
                  value={formData.name}
                  onChange={handleSelectChange}
                  label="Nom de l'Actif"
                >
                  {names.map((actif) => (
                    <MenuItem key={actif._id} value={actif.name}>
                      {actif.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Consultation Médecine Générale"
                name="Consultation"
                type="number"
                value={formData.Consultation}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Activité de soins infirmiers"
                name="soins"
                type="number"
                value={formData.soins}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléexpertises"
                name="Teleexpertises"
                type="number"
                value={formData.Teleexpertises}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Vaccination"
                name="Vaccination"
                type="number"
                value={formData.Vaccination}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Référencement"
                name="Referencement"
                type="number"
                value={formData.Referencement}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Évacuation"
                name="Evacuation"
                type="number"
                value={formData.Evacuation}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label="Total Prise en Charge"
                name="totalPriseEnCharge"
                type="number"
                value={formData.totalPriseEnCharge}
                onChange={handleChange}
                variant="outlined"
                disabled
                InputProps={{
                  sx: {
                    fontWeight: "bold",
                    color: "blue",
                    textAlign: "center",
                  },
                  inputProps: {
                    style: { textAlign: "center" },
                  },
                }}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={2}>
            {[
              "DepistageDiabete",
              "DepistageHTA",
              "DepistageCancerDuSein",
              "DepistageDuCancerDuCol",
              "TestCovid19Positif",
              "TestCovid19Negatif",
              "CasDeRougeole",
              "Oreillon",
              "SuiviDeGrossesse",
              "GrossesseARisque",
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField
                  fullWidth
                  label={fieldLabels[field] || field}
                  name={field}
                  type="number"
                  value={formData[field]}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
            ))}
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={2}>
            {[
              "ageGroup0to6",
              "ageGroup7to14",
              "ageGroup15to24",
              "ageGroup25to64",
              "ageGroup65to100",
              "Femme",
              "Homme",
              "Transfert",
              "Urgence",
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField
                  fullWidth
                  label={
                    field.startsWith("ageGroup")
                      ? `Tranche d'âge ${field
                          .replace("ageGroup", "")
                          .replace("to", "-")}`
                      : field === "Femme" || field === "Homme"
                      ? `${field}s`
                      : field
                  }
                  name={field}
                  type="number"
                  value={formData[field]}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
            ))}
            {ageError && (
              <Grid item xs={12}>
                <Typography color="error" variant="body2">
                  {ageError}
                </Typography>
              </Grid>
            )}
          </Grid>
        );

      case 4:
        return (
          <Grid container spacing={2}>
            {[1, 2, 3, 4, 5].map((num, index) => (
              <Grid item xs={12} sm={6} key={num}>
                <Autocomplete
                  freeSolo
                  options={pathologiesList}
                  value={formData[`PathologieFrequente${num}`]}
                  onChange={(event, newValue) =>
                    handlePathologyChange(index, newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label={`Pathologie Fréquente ${num}`}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
            ))}
          </Grid>
        );

      default:
        return <div>Étape non reconnue</div>;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      fullScreen={isMobile}
      sx={{ "& .MuiDialog-paper": { minHeight: isMobile ? "100vh" : "80vh" } }}
    >
      <DialogTitle
        sx={{
          bgcolor: theme.palette.primary.main,
          color: "white",
          py: 2,
          px: 3,
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          flexDirection={isMobile ? "column" : "row"}
        >
          <Box component="h2" sx={{ fontSize: "1.2rem", mb: isMobile ? 1 : 0 }}>
            Nouvelle Entrée Médicale
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{ width: isMobile ? "100%" : "70%", mt: isMobile ? 2 : 0 }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    "& .MuiStepLabel-label": {
                      color: "white!important",
                      fontSize: "0.7rem",
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 4, px: 3 }}>
        <Box sx={{ mt: 2 }}>{getStepContent(activeStep)}</Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={activeStep === 0 ? handleClose : handleBack}
          color="secondary"
          variant="outlined"
          size={isMobile ? "small" : "medium"}
        >
          {activeStep === 0 ? "Annuler" : "Retour"}
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
          color="primary"
          variant="contained"
          size={isMobile ? "small" : "medium"}
          sx={{ ml: 1 }}
        >
          {activeStep === steps.length - 1 ? "Sauvegarder" : "Suivant"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogMedcin;
