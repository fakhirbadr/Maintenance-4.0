import React, { useState } from "react";
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
  const equipmentList = [
    "CAMERA SURVILLANCE",
    "CLIMATISATION",
    "RENDEZ-VOUS",
    "CONNEXION",
    "STETHOSCOPE",
    "CABLE HDMI",
    "CÂBLE RÉSEAU",
    "ORDINATEUR",
    "ÉCRAN",
    "ECG",
    "MIC JABRA",
    "GROUPE ÉLECTROGÈNE",
    "VISIONSTATION",
    "APK ECG",
    "TACTILE",
    "CAMERA WEB",
    "CAMERA MOBILE",
    "NVR",
    "APK ECHOGRAPHIE",
    "BOITIER TELE MEDECINE",
    "HUB",
    "PARTAGER PERIPHERIQUE",
    "SONDE ECHOGRAPHIE",
    "OTOSCOPE",
    "IRISCOPE",
    "DERMATOSCOPE",
    "SANITAIRE",
    "REFRIGERATEUR",
    "SATELLITE",
    "TABLET",
    "DOCLICK",
    "TERMOMETRE",
    "CABLE",
    "OXEMETRE",
    "BOITE ALIMENTATION",
    "NAVIGATEUR",
    "ELECTRICITE",
    "HAUT-PARLEUR JABRA",
    "INVERSEUR",
    "TENSIOMETRE",
    "SATURATION",
    "CLAVIER",
    "Télérupteur",
    "RÉFRIGÉRATEUR",
  ];

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    setError(null); // Reset any previous errors

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/ticketMaintenance",
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
            equipement_deficitaire,
            urgence,
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
        setEquipementDeficitaire("");
        setUrgence("");
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
          />
          <TextField
            label="Technicien"
            variant="outlined"
            fullWidth
            value={technicien}
            onChange={(e) => setTechnicien(e.target.value)}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Catégorie</InputLabel>
            <Select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              label="Catégorie"
            >
              <MenuItem value="structure batiment">Structure Bâtiment</MenuItem>
              <MenuItem value="dispositif médical">Dispositif médical</MenuItem>
              <MenuItem value="matériel informatique">
                Matériel informatique
              </MenuItem>
            </Select>
          </FormControl>
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
          <Autocomplete
            freeSolo
            options={equipmentList}
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
          {/* New field for urgency */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Urgence</InputLabel>
            <Select
              value={urgence}
              onChange={(e) => setUrgence(e.target.value)}
              label="Urgence"
            >
              <MenuItem value="faible">Faible</MenuItem>
              <MenuItem value="moyenne">Moyenne</MenuItem>
              <MenuItem value="élevée">Élevée</MenuItem>
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
