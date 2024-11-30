import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Button,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
} from "@mui/material";

const AddModel = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    // Champs communs à tous les tickets
    type_selection: "", // Type de ticket : "fourniture" ou "maintenance"
    site: "",
    technicien: "",
    statut: "ouvert", // Par défaut, le statut est "ouvert"
    region: "",
    province: "",
    description: "",
    heure_debut: "",
    heure_fin: "",
    priorité: "Norme", // Par défaut, priorité "Norme"

    // Champs spécifiques à la fourniture
    fourniture: {
      produits: "", // Nom ou description du produit
      quantite: "", // Quantité demandée
      justification: "", // Raison pour laquelle cette fourniture est nécessaire
      fournisseur: "", // Fournisseur suggéré
      budgetEstime: "", // Budget estimé pour la fourniture
      dateLivraisonSouhaitee: "", // Date de livraison souhaitée
      remarques: "", // Remarques supplémentaires
    },

    // Champs spécifiques à la maintenance
    maintenance: {
      lieu: "", // Lieu ou emplacement de l'équipement concerné
      equipement: "", // Nom ou description de l'équipement
      numeroSerie: "", // Numéro de série de l'équipement
      natureIncident: "", // Description de l'incident ou du problème
      actionsTentees: "", // Actions déjà entreprises pour résoudre le problème
      personneContact: "", // Nom ou coordonnées de la personne à contacter
      observations: "", // Observations ou commentaires supplémentaires
      piecesDemandees: [], // Liste des pièces nécessaires pour la réparation
    },

    // Champ pour un nouveau produit ajouté dynamiquement
    nouveauProduit: "",
  });

  const [error, setError] = useState(""); // Pour afficher les erreurs
  const [unites, setUnites] = useState([]); // Liste des unités

  // Récupérer les unités depuis l'API
  useEffect(() => {
    const fetchUnites = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/unite");
        setUnites(response.data.data.unites);
      } catch (error) {
        console.error("Erreur lors de la récupération des unités:", error);
      }
    };
    fetchUnites();
  }, []);

  // Gérer les changements dans les champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Soumission du formulaire
  const handleSubmit = async () => {
    if (!formData.type_selection) {
      setError("Veuillez sélectionner le type de ticket avant de continuer.");
      return;
    }
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:3009/api/v1/tickets",
        formData
      );
      console.log("Réponse API :", response.data);
      onClose(); // Fermer le modal
    } catch (error) {
      console.error("Erreur lors de l'ajout du ticket :", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Création d'un Ticket</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Sélection du type de formulaire */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Type de ticket"
              name="type_selection"
              value={formData.type_selection}
              onChange={handleChange}
              margin="dense"
              variant="outlined"
            >
              <MenuItem value="fourniture">Demande de fourniture</MenuItem>
              <MenuItem value="maintenance">Ticket de maintenance</MenuItem>
            </TextField>
          </Grid>

          {/* Affichage des champs selon le type */}
          {formData.type_selection === "fourniture" && (
            <>
              {/* Champs spécifiques pour les fournitures */}
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="site-label">Site</InputLabel>
                  <Select
                    labelId="site-label"
                    id="site"
                    name="site"
                    value={formData.site}
                    onChange={handleChange}
                    label="Site"
                  >
                    {unites.map((unite, index) => (
                      <MenuItem key={unite.id || index} value={unite.name}>
                        {unite.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Produit"
                  name="produits"
                  value={formData.produits}
                  onChange={handleChange}
                  margin="dense"
                  variant="outlined"
                >
                  {[
                    "CAMERA SURVEILLANCE",
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
                    "CABLE RJ45",
                    "STETHOSCOPE",
                    "BRASAD",
                    "Caméra de surveillance",
                    "Inverseur",
                    "lampe",
                    "Otoscope connecté",
                    "balance",
                    "Câble HDMI",
                    "caméra Web",
                    "caméra mobile",
                    "chargeur PC",
                    "Clavier",
                    "clé wifi 5G",
                    "Dextro",
                    "gel d'échographe",
                    "Glucomètre",
                    "HUB",
                    "mélangeur",
                    "NVR camera",
                    "OTOSCOPE",
                    "Oxymètre",
                    "oxymetre connecté",
                    "PC Lenovo",
                    "PC Portable",
                    "Portrait DE ROI",
                    "sonde d'échographie",
                    "STETHOSCOPE",
                    "stéthoscopes connectés",
                    "tablette",
                    "TENSIOMETRE CONNECTE",
                    "tensiometre manuel",
                    "TV",
                    "STABILISATEUR DE TENSION",
                    "DEMARREUR GROUPE ELECTROGENE",
                    "BATTERIE GROUPE ELECTROGENE",
                    "CYLINDRE GROUPE ELECTROGENE",
                    "STABILISATEUR DE TENSION",
                    "ROUTEUR WIFI",
                    "TENU INFERMIERE",
                    "TENU MEDCIN",
                    "CABLE TACTILE",
                    "TABLE",
                    "BLOUSE MEDCIN",
                    "T-SHIRT TECHNICIEN",
                    "PLANTES",
                    "GLUCOMETRE",
                    "BATTRIE POUR OTOSCOPE",
                    "Dextro",
                    "CHARGEUR TYPE-C",
                    "LES PILLES",
                    "PILE AA",
                    "PILE AAA",
                    "PILE OTOSCOPE",
                    "CHAISE POUR PATIENTS",
                    "CHARGEUR TYPE B",
                    "TELECOMMANDE",
                    "CABLE VGA",
                    "CABLE 3,0",
                    "RUBAN METRE",
                    "AGENDAS",
                    "GAZON ARTIFICIEL",
                    "PYJAMAS",
                    "POLAIRE",
                    "DISPLAY",
                    "Pése poids bébé",
                    "oxygène",
                    "débit mètre d'oxygéne",
                    "masques de nébulisation",
                  ].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                  <MenuItem value="autre">Autre (Saisir un produit)</MenuItem>
                </TextField>

                {formData.produits === "autre" && (
                  <TextField
                    fullWidth
                    label="Nom du produit"
                    name="nouveauProduit"
                    value={formData.nouveauProduit || ""}
                    onChange={handleChange}
                    margin="dense"
                    variant="outlined"
                  />
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Quantité"
                  name="quantite"
                  value={formData.quantite}
                  onChange={handleChange}
                  margin="dense"
                  variant="outlined"
                  type="number"
                />
              </Grid>
            </>
          )}

          {formData.type_selection === "maintenance" && (
            <>
              {/* Champs spécifiques pour les tickets de maintenance */}
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="site-label">Site</InputLabel>
                  <Select
                    labelId="site-label"
                    id="site"
                    name="site"
                    value={formData.site}
                    onChange={handleChange}
                    label="Site"
                  >
                    {unites.map((unite, index) => (
                      <MenuItem key={unite.id || index} value={unite.name}>
                        {unite.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Technicien"
                  name="technicien"
                  value={formData.technicien}
                  onChange={handleChange}
                  margin="dense"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Province"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  margin="dense"
                  variant="outlined"
                />
              </Grid>
            </>
          )}

          {/* Champs communs */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="dense"
              variant="outlined"
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Heure de début"
              name="heure_debut"
              type="time"
              value={formData.heure_debut}
              onChange={handleChange}
              margin="dense"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Heure de fin"
              name="heure_fin"
              type="time"
              value={formData.heure_fin}
              onChange={handleChange}
              margin="dense"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Priorité"
              name="priorité"
              value={formData.priorité}
              onChange={handleChange}
              margin="dense"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>

      {/* Message d'erreur */}
      {error && (
        <Typography color="error" sx={{ marginLeft: 2 }}>
          {error}
        </Typography>
      )}

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Ajoutereee
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddModel;
