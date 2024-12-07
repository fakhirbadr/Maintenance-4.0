import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { Autocomplete, FormHelperText } from "@mui/material"; // For custom input with options

const ModelMaintenance = ({ open, onClose }) => {
  // State to handle form inputs
  const [name, setName] = useState("");
  const [site, setSite] = useState("");
  const [province, setProvince] = useState("");
  const [technicien, setTechnicien] = useState("");
  const [categorie, setCategorie] = useState("");
  const [description, setDescription] = useState("");
  const [equipement_deficitaire, setEquipementDeficitaire] = useState(""); // New field
  const [urgence, setUrgence] = useState(""); // New field
  const [photos, setPhotos] = useState(""); // New field for photos (URL or file paths)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const sites = [
    "UM ABEDLGHAYA SOUAHEL",
    "UM AIT BOUALI",
    "UM ADASSIL",
    "UM AIT MAJDEN",
    "UM AGHBALA",
    "UM AIT M'HAMED",
    "UM AGUELMAM AZEGZA",
    "UM AGHBALA",
    "UM AIT AYACH",
    "UM BOUTFARDA",
    "UM AIT HANI",
    "UM AGALMAM AZAGZA",
    "UM AIT MAJDEN",
    "UM EL KBAB",
    "UM AIT MHAMED",
    "UM SIDI HSAIN",
    "UM AL KAITOUNE",
    "UM M'GARTO",
    "UM ALLOUGOUM",
    "UM Ouled Hmida Tmassine",
    "UM ALMIS GUIGOU",
    "UM KHMISS KSSIBA",
    "UM AMELLAGOU",
    "UM AMELLAGOU",
    "UM AMIZMIZ",
    "UM MELLAB",
    "UM ARBAA BENI FTAH",
    "UM AIT AYACH",
    "UM ASNI",
    "UM GUIR",
    "UM ASSEBBAB",
    "UM IMI NOULAOUNE",
    "UM BAB BERRED",
    "UM KSAR TOUROUG",
    "UM AIT HANI",
    "UM BNI OUAL",
    "UM HSSIA",
    "UM BOUCHAOUNE",
    "UM IGHIL N'OUMGOUN",
    "UM BOUTIJOUTE",
    "UM FAZOUATA",
    "UM EZZAOUITE",
    "UM TAGHBALT",
    "UM IGHEZREN",
    "UM ALMIS GUIGOU",
    "UM IGHIL NOUMGOUN",
    "UM OUTAT EL HAJ",
    "UM IMI NOULAOUEN",
    "UM SERGHINA",
    "UM OULAD MIMOUN",
    "UM KHMIS KSIBA",
    "UM IGHEZREN",
    "UM MEGARTO",
    "UM TAGHBALT",
    "UM GHAFSSAY",
    "UM MZOUDA",
    "UM RAS EL OUED",
    "UM NZALA AIT IZDEG",
    "UM SIDI YAHYA BNI ZEROUAL",
    "UM OUIRGANE",
    "UM BNI FRASSEN",
    "UM BNI FTAH",
    "UM OULAD GHZYEL",
    "UM BNI BOUFRAH",
    "UM BAB BERRED",
    "UM HAD BNI CHIKER",
    "UM BOUDINAR",
    "UM EL KHERFAN",
    "UM OULED HMIDA TAMASSINE",
    "UM SIDI REDOUANE",
  ];
  // Defective equipment options
  // const equipmentList = [
  //   "CAMERA SURVILLANCE",
  //   "CLIMATISATION",
  //   "RENDEZ-VOUS",
  //   "CONNEXION",
  //   "STETHOSCOPE",
  //   "CABLE HDMI",
  //   "CÂBLE RÉSEAU",
  //   "ORDINATEUR",
  //   "ÉCRAN",
  //   "ECG",
  //   "MIC JABRA",
  //   "GROUPE ÉLECTROGÈNE",
  //   "VISIONSTATION",
  //   "APK ECG",
  //   "TACTILE",
  //   "CAMERA WEB",
  //   "CAMERA MOBILE",
  //   "NVR",
  //   "APK ECHOGRAPHIE",
  //   "BOITIER TELE MEDECINE",
  //   "HUB",
  //   "PARTAGER PERIPHERIQUE",
  //   "SONDE ECHOGRAPHIE",
  //   "OTOSCOPE",
  //   "IRISCOPE",
  //   "DERMATOSCOPE",
  //   "SANITAIRE",
  //   "REFRIGERATEUR",
  //   "SATELLITE",
  //   "TABLET",
  //   "DOCLICK",
  //   "TERMOMETRE",
  //   "CABLE",
  //   "OXEMETRE",
  //   "BOITE ALIMENTATION",
  //   "NAVIGATEUR",
  //   "ELECTRICITE",
  //   "HAUT-PARLEUR JABRA",
  //   "INVERSEUR",
  //   "TENSIOMETRE",
  //   "SATURATION",
  //   "CLAVIER",
  //   "Télérupteur",
  //   "RÉFRIGÉRATEUR",
  // ];
  // const categories = [
  //   "structure batiment",
  //   "dispositif médical",
  //   "matériel informatique",
  // ];
  // Equipment lists based on category
  const equipmentByCategory = {
    "structure batiment": [
      "BANC CHAISE",
      "CACHE GROUPE ELECTROGENE",
      "CHAISE D'ACCEUIL",
      "CITERNE D'EAU EN PLASTIQUE",
      "EXTINCTEUR",
      "fluxible mélangeur 1/2f pour lavabo",
      "GAZON ARTIFICIEL",
      "MARTEAU REFLEXE",
      "MECANISME CHASSE D'EAU (TOILETTE)",
      "MÉLANGEUR",
      "MINI-REFRIGERATEUR",
      "PORTRAIT DU ROI",
      "POUBELLE 10L",
      "POUBELLE 5L",
      "POUBELLE 90L",
      "PROJECTEUR",
      "TABLE",
      "TABOURET",
      "VASES PLANTES ARTIFICIELLES",
    ],
    "dispositif médical": [
      "BALANCE",
      "BOITIER MEDIOT",
      "BRASSARD TENSIOMETRE",
      "CONCENTRATEUR OXYGENE",
      "DÉBITMÈTRES D'OXYGÈNE",
      "DIVAN D'EXAMEN",
      "DOCLICK",
      "DRAP D'EXAMEN",
      "ECG 12 Deriviations",
      "ESCABEAU",
      "LUNETTE OXYGÈNE",
      "NÉBULISEUR",
      "OTOSCOPE CONNECTÉ",
      "OTOSCOPE MANUEL",
      "OXYMÈTRE CONNECTÉ",
      "OXYMÈTRE MANUEL",
      "PÈSE BÉBÉ",
      "POTENCE",
      "RUBAN METRE TAILLE",
      "SONDE D'ÉCHOGRAPHIE",
      "STÉTHOSCOPE MANUEL",
      "TENSIOMETRE CONNECTE",
      "TENSIOMETRE DIGITALE",
      "TENSIOMETRE MANUEL",
      "THERMOMÈTRE",
    ],
    "équipement généreaux": [
      "ARMOIRE PHARMACEUTIQUE",
      "BATTERIE GROUPE ELECTROGENE",
      "CABLE LIAISON GROUPE ELECTROGENE",
      "CAISSE OUTILLAGE TECHNICIEN",
      "CAMERA SURVEILLANCE",
      "CANON POUR LA PORTE D’UNITÉ",
      "CLE A MOULETTE",
      "GROUPE ELECTROGENE",
      "ONDULEUR",
      "RALLONGE 10M",
      "RALLONGE 4M",
      "TÉLÉRUPTEUR",
      "TV REMOTE CONTROLE (PHILIPS)",
    ],
    Fourniture: [
      "BLOC NOTE",
      "BLOUSE MEDCIN",
      "CACHET MEDECIN",
      "CACHET UNITE",
      "ORDONANCIER",
      "Piles 2A",
      "Piles 3A",
      "PILES OTOSCOPE LR14-C",
      "POLAIRE",
      "PYJAMA INFIRMIERE",
      "SCOTCH NOIR",
      "STYLO",
      "TENUE INFIRMIER",
    ],
    "matériel informatique": [
      "ADAPTATEUR DISPLAY/HDMI",
      "CABLE 3.0 10 M",
      "CÂBLE HDMI 10M",
      "CABLE IMPRIMANTE USB",
      "CÄBLE RJ45",
      "CÂBLE SERIE A",
      "CÂBLE TACTILE 10 M",
      "CABLE TENSIOMETRE",
      "CÂBLE USB 10M MALE/FEMELLE",
      "CÂBLE USB POUR BOITIER",
      "CÂBLE VGA BOITIER MEDIOT",
      "CAMERA MOBILE",
      "CAMERA WEB",
      "CHARGEUR PC HP",
      "CHARGEUR PC LENOVO",
      "CHARGEUR SONDE ECHOGRAPHIE",
      "CHARGEUR STETHOSCOPE",
      "CHARGEUR TENSIOMETRE 6 V",
      "CHARGEUR TYPE B",
      "CHARGEUR TYPE C",
      "CLAVIER",
      "CLAVIER PC PROTABLE",
      "CLE WIFI 5 G",
      "CONNECTEUR RJ45",
      "DISQUE DUR PC PORTABLE",
      "ÉCRAN",
      "HUB",
      "MIC JABRA",
      "MINI PC",
      "NVR",
      "PC PORTABLE",
      "ROUTEUR WIFI",
      "SWITCH",
    ],
  };

  const categories = [
    "structure batiment",
    "dispositif médical",
    "matériel informatique",
    "équipement généreaux",
    "Fourniture",
    ,
  ];
  useEffect(() => {
    // Retrieve the full name from localStorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo && userInfo.nomComplet) {
      setTechnicien(userInfo.nomComplet); // Set the full name as technicien
      setProvince(userInfo.province);
    }
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    setError(null); // Reset any previous errors

    try {
      const response = await fetch(
        "https://maintenance-4-0-backend-9.onrender.com/api/v1/ticketMaintenance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            site,
            province,
            technicien,
            categorie,
            description,
            equipement_deficitaire, // Ensure this is added
            urgence, // Ensure this is added
            photos,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Ticket submitted:", data);
        onClose(); // Close the modal if submission is successful
        // Reset the form fields after successful submission
        setName("");
        setSite("");
        setProvince("");
        setTechnicien("");
        setCategorie("");
        setDescription("");
        setEquipementDeficitaire(""); // Reset defective equipment field
        setUrgence(""); // Reset urgency field
        setPhotos("");
      } else {
        setError(data.message || "Erreur lors de la soumission");
      }
    } catch (error) {
      setError("Erreur de réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Faire une demande de maintenance</DialogTitle>
      <DialogContent>
        <form noValidate autoComplete="off">
          {/* Name field with predefined options and custom input */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Type d'intervention</InputLabel>
            <Select
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Type d'intervention"
            >
              <MenuItem value="REPARATION TECHNIQUE">
                Réparation Technique
              </MenuItem>
              <MenuItem value="ASSISTANCE ET FORMATION">
                Assistance et Formation
              </MenuItem>
              <MenuItem value="PROBLEME LOGICIEL">Problème Logiciel</MenuItem>
              <MenuItem value="PROBLEME ELECTRIQUE">
                Problème Électrique
              </MenuItem>
              <MenuItem value="APPAREIL DEFECTUEUX">
                Appareil Défectueux
              </MenuItem>
              <MenuItem value="Autre">Autre</MenuItem>
            </Select>
          </FormControl>
          {name === "Autre" && (
            <TextField
              label="Précisez le type d'intervention"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
            />
          )}
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="site-label">Site</InputLabel>
            <Select
              labelId="site-label"
              value={site}
              onChange={(e) => setSite(e.target.value)}
              label="Site"
            >
              {sites.map((site, index) => (
                <MenuItem key={index} value={site}>
                  {site}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Choisissez un site</FormHelperText>
          </FormControl>
          <TextField
            label="Province"
            variant="outlined"
            fullWidth
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            margin="normal"
            required
            disabled
          />
          <TextField
            label="Technicien"
            variant="outlined"
            fullWidth
            value={technicien} // Display the full name here
            onChange={(e) => setTechnicien(e.target.value)} // Allow user to change if needed
            margin="normal"
            required
            disabled // Disable the field to prevent changing the email manually
          />
          {/* Category field with autocomplete */}
          {/* Category field with autocomplete */}
          <Autocomplete
            freeSolo
            options={categories}
            value={categorie}
            onInputChange={(e, newValue) => {
              setCategorie(newValue);
              setEquipementDeficitaire(""); // Reset equipment field when category changes
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Catégorie"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            )}
          />{" "}
          {/* Equipment field filtered by category */}
          <Autocomplete
            freeSolo
            options={equipmentByCategory[categorie] || []} // Filtered equipment list based on category
            value={equipement_deficitaire}
            onInputChange={(e, newValue) => setEquipementDeficitaire(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Équipement défectueux"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            )}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            required
          />
          {/* New field for defective equipment */}
          {/* New field for urgency */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Urgence</InputLabel>
            <Select
              value={urgence}
              onChange={(e) => setUrgence(e.target.value)}
              label="Urgence"
            >
              <MenuItem value="faible">faible</MenuItem>
              <MenuItem value="moyenne">moyenne</MenuItem>
              <MenuItem value="élevée">élevée</MenuItem>
            </Select>
          </FormControl>
          {/* New field for photos */}
          {/* <TextField
            label="Photos (URL ou chemins)"
            variant="outlined"
            fullWidth
            value={photos}
            onChange={(e) => setPhotos(e.target.value)}
            margin="normal"
          /> */}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Fermer
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          {loading ? "Envoi..." : "Soumettre"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModelMaintenance;
