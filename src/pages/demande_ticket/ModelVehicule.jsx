import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
} from "@mui/material";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const TicketForm = ({ open, onClose }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    technicien: "",
    province: "",
    immatriculation: "",
    KM: "",
    prix: "",
    marque: "",
    model: "",
    categorie: "",
    commande: "",
    urgence: "Basse",
    description: "",
  });

  useEffect(() => {
    // Récupération des données depuis le localStorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        technicien: userInfo.nomComplet || "",
        province: userInfo.province || "",
      }));
    }
  }, []);

  const marques = ["Toyota", "Renault", "Ford", "Mercedes"];
  const categories = ["Maintenance", "Besoin"];
  const urgences = ["Basse", "Moyenne", "Haute"];

  const commandesParCategorie = {
    Maintenance: [
      "Réparation moteur",
      "Freins",
      "Pneus",
      "Batterie",
      "Embrayage",
      "Suspension",
      "Alternateur",
      "Climatisation",
      "Démarreur",
      "Éclairage",
      "Courroie de distribution",
      "Capteurs",
      "Injecteurs",
    ],
    Besoin: [
      "Vidange",
      "Demande gasoil",
      "Pneu",
      "Plaquettes de frein",
      "Disques de frein",
      "Huile moteur",
      "Filtre à air",
      "Filtre à gasoil",
      "Filtre à huile",
      "Système de lavage pare-brise",
      "Batterie",
    ],
    RechargeGasoil: ["Recharge de gasoil"],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [name]: value,
      };

      // Si la catégorie change, réinitialiser "commande"
      if (name === "categorie") {
        updatedFormData.commande = "";
      }

      return updatedFormData;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      console.log(formData);
      const response = await fetch(`${apiUrl}/api/ticketvehicules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Une erreur s'est produite lors de l'envoi du ticket");
      }

      const data = await response.json();
      console.log("Ticket créé avec succès :", data);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Créer un nouveau ticket pour véhicule</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* 1ère ligne */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Technicien"
              value={formData.technicien}
              fullWidth
              disabled
              margin="dense"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Province"
              value={formData.province}
              fullWidth
              disabled
              margin="dense"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

          {/* 2ème ligne */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Immatriculation"
              name="immatriculation"
              value={formData.immatriculation}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Catégorie"
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              fullWidth
              margin="dense"
            >
              {categories.map((categorie) => (
                <MenuItem key={categorie} value={categorie}>
                  {categorie}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* 3ème ligne */}

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Commande"
              name="commande"
              value={formData.commande}
              onChange={handleChange}
              fullWidth
              margin="dense"
            >
              {commandesParCategorie[formData.categorie]?.map((commande) => (
                <MenuItem key={commande} value={commande}>
                  {commande}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            {" "}
            <TextField
              label="kilométrage"
              value={formData.KM}
              onChange={handleChange}
              name="KM"
              fullWidth
              margin="dense"
              helperText="Entrez un commentaire pour l'urgence"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {" "}
            <TextField
              label="Prix"
              value={formData.prix}
              onChange={handleChange}
              name="prix"
              fullWidth
              margin="dense"
              helperText="Entrez un commentaire pour l'urgence"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Urgence"
              name="urgence"
              value={formData.urgence}
              onChange={handleChange}
              fullWidth
              margin="dense"
            >
              {urgences.map((urgence) => (
                <MenuItem key={urgence} value={urgence}>
                  {urgence}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            {" "}
            <TextField
              label="Description"
              value={formData.description}
              onChange={handleChange}
              name="description"
              fullWidth
              margin="dense"
              helperText="Entrez un commentaire pour l'urgence"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Fermer
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Soumettre
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketForm;
