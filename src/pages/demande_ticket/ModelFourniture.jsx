import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import axios from "axios";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const ModelFourniture = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    categorie: "",
    besoin: "",
    quantite: "",
    technicien: "",
    customCategorie: "", // Pour le champ personnalisé catégorie
    customBesoin: "",
    status: "", // Pour le champ personnalisé besoin
    province: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = [
    "Structure Bâtiment",
    "Dispositif Médicaux",
    "Matériel Informatique",
    "Fourniture",
    "équipement généreaux",
  ];

  // Define the needs for each category
  const categoryNeeds = {
    "Structure Bâtiment": [
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
    "Dispositif Médicaux": [
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
    "Matériel Informatique": [
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

  const [besoins, setBesoins] = useState([]);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo); // Parse the stored JSON object
      if (userInfo.province) {
        setFormData((prevData) => ({
          ...prevData,
          province: userInfo.province,
          site: userInfo.site,
          technicien: userInfo.nomComplet,
        }));
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "categorie") {
      setBesoins(categoryNeeds[value] || []); // Update needs based on selected category
    }
  };

  const handleSubmit = async () => {
    const {
      name,
      categorie,
      besoin,
      quantite,
      technicien,
      customCategorie,
      customBesoin,
      status,
    } = formData;

    const selectedCategorie =
      categorie === "Autre" ? customCategorie : categorie;
    const selectedBesoin = besoin === "Autre" ? customBesoin : besoin;

    if (
      !name ||
      !selectedCategorie ||
      !selectedBesoin ||
      !quantite ||
      !technicien
    ) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    if (quantite <= 0) {
      setError("La quantité doit être supérieure à zéro.");
      return;
    }

    setError("");

    try {
      const response = await axios.post(
        "https://maintenance-4-0-backend-9.onrender.com/api/v1/fournitureRoutes",
        { ...formData, categorie: selectedCategorie, besoin: selectedBesoin }
      );

      setSuccess("Ticket créé avec succès !");
      console.log("Réponse de l'API :", response.data);

      setFormData({
        name: "",
        categorie: "",
        besoin: "",
        quantite: "",
        technicien: "",
        customCategorie: "",
        customBesoin: "",
        status,
      });

      setTimeout(() => {
        setSuccess("");
        onClose();
      }, 2000);
    } catch (err) {
      setError("Une erreur s'est produite lors de la création du ticket.");
      console.error("Erreur API :", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Créer un Ticket Fourniture</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <FormControl fullWidth margin="normal">
          <InputLabel>Site</InputLabel>
          <Select
            value={formData.name}
            onChange={handleChange}
            label="Site"
            name="name"
          >
            {[
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
            ].map((site, index) => (
              <MenuItem key={index} value={site}>
                {site}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Catégorie */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Catégorie</InputLabel>
          <Select
            value={formData.categorie}
            onChange={handleChange}
            label="Catégorie"
            name="categorie"
          >
            {categories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}
            <MenuItem value="Autre">Autre</MenuItem>
          </Select>
        </FormControl>
        {formData.categorie === "Autre" && (
          <TextField
            fullWidth
            label="Nouvelle Catégorie"
            variant="outlined"
            name="customCategorie"
            value={formData.customCategorie}
            onChange={handleChange}
            margin="normal"
          />
        )}

        {/* Besoin */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Besoin</InputLabel>
          <Select
            value={formData.besoin}
            onChange={handleChange}
            label="Besoin"
            name="besoin"
          >
            {besoins.map((need, index) => (
              <MenuItem key={index} value={need}>
                {need}
              </MenuItem>
            ))}
            <MenuItem value="Autre">Autre</MenuItem>
          </Select>
        </FormControl>
        {formData.besoin === "Autre" && (
          <TextField
            fullWidth
            label="Nouveau Besoin"
            variant="outlined"
            name="customBesoin"
            value={formData.customBesoin}
            onChange={handleChange}
            margin="normal"
          />
        )}

        {/* Quantité */}

        <TextField
          fullWidth
          label="Quantité"
          variant="outlined"
          name="quantite"
          value={formData.quantite}
          onChange={handleChange}
          margin="normal"
          type="number"
        />
        {/* Province */}
        <TextField
          fullWidth
          label="Province"
          variant="outlined"
          name="province"
          value={formData.province}
          onChange={handleChange}
          margin="normal"
          disabled // Lecture seule
        />

        {/* Technicien */}
        <TextField
          fullWidth
          label="Technicien"
          variant="outlined"
          name="technicien"
          value={formData.technicien}
          onChange={handleChange}
          margin="normal"
          disabled
        />
        {/* Status */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.status}
            onChange={handleChange}
            label="Status"
            name="status"
          >
            {["pending", "in-progress", "completed"].map((status, index) => (
              <MenuItem key={index} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}{" "}
                {/* Capitalize first letter */}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Soumettre
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModelFourniture;
