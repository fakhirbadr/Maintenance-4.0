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
  Autocomplete,
} from "@mui/material";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const immatriculations = [
  "17847-T-6",
  "52845-B-7",
  "49276-B-7",
  "50716-B-7",
  "43984-B-7",
  "52846-B-7",
  "9627-T-6",
  "51271-B-7",
  "76982-A-13",
  "84536-A-13",
  "60871-A-13",
  "49524-A-13",
  "52985-A-13",
  "52410-A-13",
  "68891-A-13",
  "56042-A-13",
  "68890-A-13",
  "55065-A-13",
  "68861-A-13",
  "28751-B-7",
  "59921-A-13",
  "54753-B-7",
  "83922-A-13",
  "51278-A-13",
  "54086-B-7",
  "53385-B-7",
  "60765-A-13",
  "WW526148",
  "28395-A-68",
  "58638-B-7",
  "56285-B-7",
  "56288-B-7",
  "59128-B-7",
  "59127-B-7",
  "56286-B-7",
  "56287-B-7",
  "56289-B-7",
  "56695-B-7",
  "53347-B-7",
  "35286-B-7",
  "50888-B-7",
  "82061-A-13",
  "57648-B-7",
  "54793-B-7",
  "79247-A-13",
  "82234-A-13",
  "83034-A-13",
  "81810-A-13",
  "53669-B-7",
  "53668-B-7",
  "79758-A-13",
  "58171-B-7",
  "79764-A-13",
  "58941-B-7",
  "53676-B-7",
  "82626-A-13",
  "81726-A-13",
  "56184-B-7",
  "56173-B-7",
  "56172-B-7",
  "56183-B-7",
  "58164-B-7",
  "58159-B-7",
  "58732-B-7",
  "58735-B-7",
  "59166-B-7",
  "58945-B-7",
  "53673-B-7",
  "53682-B-7",
  "58726-B-7",
  "79760-A-13",
  "82129-A-13",
  "52005-B-7",
  "52004-B-7",
  "52003-B-7",
  "52001-B-7",
  "52002-B-7",
  "79761-A-13",
  "79763-A-13",
  "79762-A-13",
  "82386-A-13",
  "82385-A-13",
  "77852-A-13",
  "79765-A-13",
  "58370-B-7",
  "58731-B-7",
  "82387-A-13",
  "58948-B-7",
  "81729-A-13",
  "82638-A-13",
  "79767-A-13",
  "79768-A-13",
  "58161-B-7",
  "79246-A-13",
  "82408-A-13",
  "81727-A-13",
  "82131-A-13",
  "58372-B-7",
  "82721-A-13",
  "82130-A-13",
  "52030-B-7",
  "82116-A-13",
  "53786-B-7",
  "58614-B-7",
  "82256-A-13",
  "82686-A-13",
  "WW113957",
  "53683-B-7",
  "53674-B-7",
  "65563-B-7",
  "53681-B-7",
  "82127-A-13",
  "53679-B-7",
  "81929-A-13",
  "82321-A-13",
  "81724-A-13",
  "82617-A-13",
  "82688-A-13",
  "53684-B-7",
  "58170-B-7",
  "58725-B-7",
  "79769-A-13",
  "82474-A-13",
  "79276-A-13",
  "79238-A-13",
  "81723-A-13",
  "53638-B-7",
  "82620-A-13",
  "82322-A-13",
  "81814-A-13",
  "58944-B-7",
  "53672-B-7",
  "58733-B-7",
  "58613-B-7",
  "82685-A-13",
  "82623-A-13",
  "58942-B-7",
  "58729-B-7",
  "58596-B-7",
  "79237-A-13",
  "81808-A-13",
  "81811-A-13",
  "82232-A-13",
  "53670-B-7",
  "82687-A-13",
  "58943-B-7",
  "82235-A-13",
  "59067-B-7",
  "82124-A-13",
  "82320-A-13",
  "58727-B-7",
  "82125-A-13",
  "58168-B-7",
  "58167-B-7",
  "79759-A-13",
  "53640-B-7",
  "82237-A-13",
  "82619-A-13",
  "82684-A-13",
  "79277-A-13",
  "58724-B-7",
  "58556-B-7",
  "81812-A-13",
  "53642-B-7",
  "53641-B-7",
  "79274-A-13",
  "82117-A-13",
  "82115-A-13",
  "82133-A-13",
  "82126-A-13",
  "82128-A-13",
  "58728-B-7",
  "53675-B-7",
  "82230-A-13",
  "58949-B-7",
  "79281-A-13",
  "79757-A-13",
  "59167-B-7",
  "82229-A-13",
  "82236-A-13",
  "58163-B-7",
  "58166-B-7",
  "82132-A-13",
  "56175-B-7",
  "81809-A-13",
  "53671-B-7",
  "56168-B-7",
  "58547-B-7",
  "58615-B-7",
  "58611-B-7",
  "58371-B-7",
  "82233-A-13",
  "58946-B-7",
  "53678-B-7",
  "79278-A-13",
  "58947-B-7",
  "81730-A-13",
  "58373-B-7",
  "82640-A-13",
  "82625-A-13",
  "56174-B-7",
  "81725-A-13",
  "79273-A-13",
  "79280-A-13",
  "53680-B-7",
  "79766-A-13",
  "81728-A-13",
  "58734-B-7",
  "79239-A-13",
  "58165-B-7",
  "53639-B-7",
  "81750-A-13",
  "53677-B-7",
  "79756-A-13",
  "58374-B-7",
  "58730-B-7",
  "82238-A-13",
  "82231-A-13",
  "59164-B-7",
  "58940-B-7",
  "53666-B-7",
  "79240-A-13",
  "58169-B-7",
  "82323-A-13",
  "58939-B-7",
  "82629-A-13",
  "58160-B-7",
  "58612-B-7",
  "56170-B-7",
  "53667-B-7",
  "56171-B-7",
  "82697-A-13",
  "79248-A-13",
  "58162-B-7",
  "79755-A-13",
  "58777-B-7",
  "58369-B-7",
  "58736-B-7",
  "56169-B-7",
  "55444-B-7",
  "55773-H-1",
  "59866-B-7",
  "WW512358",
  "86631-A-13",
  "60501-A-13",
  "57077-B-7",
  "57710-B-7",
  "80630-A-13",
  "59807-B-7",
];

const TicketForm = ({ open, onClose }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
  const categories = [
    "Maintenance préventive",
    "Maintenance corrective",
    "Besoin",
  ];

  const commandesParCategorie = {
    "Maintenance préventive": [
      "Vidange complet",
      "Vidange simple",
      "Filtre climat",
      "Liquide de refroidissement",
      "Liquide de frein",
      "Bougies d'allumage",
      "Bougies de préchauffage",
      "Batterie",
      "Pneus",
      "Plaquettes de frein",
      "Disques de frein",
      "Courroie de distribution",
      "Courroie accessoires",
      "Suspension",
      "Essuie-glaces",
      "Éclairage",
      "Ammortisseur avant",
      "Ammortisseur arriére"
    ],
    "Maintenance corrective": [
      "Réparation moteur",
      "Surchauffe moteur",
      "Panne batterie",
      "Embrayage défectueux",
      "Suspension bruyante ou cassée",
      "Alternateur HS",
      "Démarreur en panne",
      "Injecteurs encrassés ou défaillants",
      "Courroie de distribution cassée",
      "Boîte de vitesses",
      "Fuite de liquide de refroidissement",
      "Climatisation",
      "Échappement troué / catalyseur HS",
      "Turbo en panne",
      "Freins défaillants",
      "Pneu crevé ou éclaté",
      "Éclairage HS",
      "Pompe à eau HS"
    ],
    "Besoin": [
      "Demande Gasoil",
      "Demande Solde JAWAZ"
    ]
  };

  const initialFormData = {
    technicien: "",
    province: "",
    immatriculation: "",
    KM: "",
    marque: "",
    model: "",
    categorie: "",
    commande: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialFormData);

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
    if (loading) return;

    // Validation des champs obligatoires
    if (!formData.technicien || 
        !formData.province || 
        !formData.immatriculation || 
        !formData.KM || 
        !formData.categorie || 
        !formData.commande || 
        !formData.description) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    setLoading(true);
    setError("");

    try {
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

      // Réinitialiser le formulaire
      setFormData((prev) => ({
        ...initialFormData,
        technicien: prev.technicien,
        province: prev.province,
      }));

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
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <Grid container spacing={2}>
          {/* 1ère ligne */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Technicien"
              value={formData.technicien}
              fullWidth
              required
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
              required
              disabled
              margin="dense"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

          {/* 2ème ligne */}
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={immatriculations}
              value={formData.immatriculation}
              onChange={(event, newValue) => {
                setFormData((prev) => ({
                  ...prev,
                  immatriculation: newValue || "",
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Immatriculation"
                  margin="dense"
                  fullWidth
                  required
                  helperText="Commencez à taper pour rechercher"
                />
              )}
              isOptionEqualToValue={(option, value) => option === value}
              clearOnEscape
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
              required
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
              required
              margin="dense"
              disabled={!formData.categorie}
            >
              {(commandesParCategorie[formData.categorie] || []).map(
                (commande) => (
                  <MenuItem key={commande} value={commande}>
                    {commande}
                  </MenuItem>
                )
              )}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Kilométrage"
              value={formData.KM}
              onChange={handleChange}
              name="KM"
              fullWidth
              required
              margin="dense"
              type="number"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              value={formData.description}
              onChange={handleChange}
              name="description"
              fullWidth
              required
              margin="dense"
              multiline
              rows={4}
            />
          </Grid>
        </Grid>
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

export default TicketForm;