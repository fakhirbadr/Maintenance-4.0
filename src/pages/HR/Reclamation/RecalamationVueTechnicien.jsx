import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

const RecalamationVueTechnicien = () => {
  const reclamationTypes = [
    { value: "dysfonctionnement", label: "Dysfonctionnement technique" },

    { value: "conditions", label: "Conditions de travail non conformes" },
    { value: "autre", label: "Autre" },
  ];

  return (
    <div className="px-24">
      <Grid container spacing={2}>
        {/* Première colonne */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              padding: "40px",
              backgroundColor: "#ccccff",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              height: "100%", // Prend toute la hauteur du conteneur
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Cette interface est conçue pour traiter les réclamations de
              manière confidentielle et garantir un espace sûr pour l'expression
              des préoccupations.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Elle est accessible à tous les collaborateurs, indépendamment de
              leur poste ou de leur ancienneté, et permet de signaler divers
              sujets liés à l'environnement de travail : Dysfonctionnements
              techniques ou organisationnels, Problèmes de toxicité au sein des
              équipes, Pressions ou abus liés à la hiérarchie, Harcèlement moral
              ou sexuel, Conditions de travail non conformes aux normes, ou
              toute autre problématique pouvant nuire au bien-être ou à
              l'efficacité au travail.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Grâce à cette plateforme, vous pouvez communiquer directement et
              discrètement avec le coordinateur dédié, dont le rôle est d'agir
              en tant que médiateur impartial. Il s'assure que vos
              préoccupations sont entendues et traitées dans les meilleurs
              délais, en collaboration avec le département des Ressources
              Humaines.
            </Typography>
            <Typography variant="body1" gutterBottom>
              L'objectif principal est de promouvoir un environnement de travail
              sain, respectueux et motivant, en offrant un espace d'écoute
              active et de résolution rapide des problèmes. Toutes les
              réclamations sont suivies de manière rigoureuse, avec un système
              de traçabilité et de retour d'information pour garantir une
              transparence et un traitement efficace.
            </Typography>
            <Typography variant="body1">
              Ensemble, nous nous engageons à construire un environnement
              professionnel où chacun se sent valorisé, respecté et en sécurité.
            </Typography>
          </Box>
        </Grid>

        {/* Deuxième colonne */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              padding: "40px",
              backgroundColor: "#ccccff",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              height: "100%", // Prend toute la hauteur du conteneur
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Soumettre une réclamation
            </Typography>

            {/* Nom complet */}
            <TextField
              fullWidth
              label="Nom complet"
              variant="outlined"
              margin="normal"
              required
            />

            {/* Type de réclamation */}
            <TextField
              select
              fullWidth
              label="Type de réclamation"
              variant="outlined"
              margin="normal"
              required
            >
              {reclamationTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            {/* Espace pour parler */}
            <TextField
              fullWidth
              label="Décrivez votre problème"
              variant="outlined"
              margin="normal"
              multiline
              rows={4}
              required
            />

            {/* Bouton d'envoi */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: "20px" }}
            >
              Envoyer la réclamation
            </Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default RecalamationVueTechnicien;
