import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

const Item = ({ children }) => (
  <Box
    sx={{
      p: 2,
      textAlign: "left",
      color: "text.secondary",
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 1,
      display: "flex",
      alignItems: "center",
    }}
  >
    {children}
  </Box>
);

const ProfilUser = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [actifs, setActifs] = useState([]);
  const [loadingActifs, setLoadingActifs] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false); // Nouvel état
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const marocRegions = [
    "Tanger-Tétouan-Al Hoceïma",
    "Oriental",
    "Fès-Meknès",
    "Rabat-Salé-Kénitra",
    "Béni Mellal-Khénifra",
    "Casablanca-Settat",
    "Marrakech-Safi",
    "Drâa-Tafilalet",
    "Souss-Massa",
    "Guelmim-Oued Noun",
    "Laâyoune-Sakia El Hamra",
    "Dakhla-Oued Ed-Dahab",
  ];

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userInfo"));
    const userActifs = JSON.parse(localStorage.getItem("userActifs"));
    setUserInfo(userData);

    fetch("https://backend-v1-1.onrender.com/api/actifs")
      .then((response) => response.json())
      .then((data) => {
        const filteredActifs = data.filter((actif) =>
          userActifs.includes(actif._id)
        );
        setActifs(filteredActifs);
        setLoadingActifs(false);
      })
      .catch((error) => {
        console.error("Error fetching actifs:", error);
        setLoadingActifs(false);
      });
  }, []);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const token = localStorage.getItem("token"); // Récupérer le token
    const userInfoFromStorage = JSON.parse(localStorage.getItem("userInfo")); // Récupérer l'info utilisateur
    const userId = userInfoFromStorage?.id; // Assurez-vous que l'ID utilisateur est présent

    if (!userId) {
      alert("ID utilisateur introuvable !");
      return;
    }

    try {
      const response = await fetch(
        `https://backend-v1-1.onrender.com/api/v1/users/update-password/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      if (response.ok) {
        alert("Mot de passe mis à jour avec succès !");
        setCurrentPassword("");
        setNewPassword("");
        setShowPasswordForm(false);
      } else {
        const errorData = await response.json();
        alert(`Erreur : ${errorData.message || "Une erreur est survenue."}`);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe :", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  if (!userInfo) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4 }}>
        Chargement des informations utilisateur...
      </Typography>
    );
  }

  return (
    <>
      {" "}
      <Typography
        component="h2"
        sx={{
          mb: 4,
          fontSize: { xs: "2rem", md: "2.5rem" },
          fontWeight: "bold",
          textTransform: "uppercase",
          color: "orange",
        }}
      >
        Mon Espace
      </Typography>
      <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
        <Box
          component="section"
          sx={{ p: 2, border: "1px dashed grey", borderRadius: 2 }}
        >
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={6}>
              <Item>
                <TextField
                  label="Nom Complet"
                  variant="standard"
                  value={userInfo.nomComplet}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  disabled
                />
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <TextField
                  label="Email"
                  variant="standard"
                  value={userInfo.email}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  disabled
                />
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <FormControl fullWidth>
                  <InputLabel>Région</InputLabel>
                  <Select value={userInfo.region || ""} fullWidth>
                    {marocRegions.map((region, index) => (
                      <MenuItem key={index} value={region}>
                        {region}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <FormControl fullWidth>
                  <InputLabel>Actifs</InputLabel>
                  <Select value={userInfo.actif || ""} fullWidth>
                    {loadingActifs ? (
                      <MenuItem value="">Chargement...</MenuItem>
                    ) : (
                      actifs.map((actif, index) => (
                        <MenuItem key={index} value={actif._id}>
                          {actif.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Item>
                <TextField
                  label="Province"
                  variant="standard"
                  value={userInfo.province}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                    style: { textAlign: "center" }, // Center text inside the TextField
                  }}
                  disabled
                  sx={{
                    display: "flex",
                    justifyContent: "center", // Center the TextField within the Item component
                  }}
                />
              </Item>
            </Grid>
          </Grid>

          {/* Bouton et formulaire de changement de mot de passe */}
          <Grid container spacing={2} sx={{ mt: 3 }}>
            {!showPasswordForm ? (
              <Grid item xs={6}>
                <Item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowPasswordForm(true)}
                    fullWidth
                  >
                    Modifier le mot de passe
                  </Button>
                </Item>
              </Grid>
            ) : (
              <>
                <Grid item xs={6}>
                  <Item>
                    <TextField
                      label="Mot de passe actuel"
                      variant="standard"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      fullWidth
                    />
                  </Item>
                </Grid>
                <Grid item xs={6}>
                  <Item>
                    <TextField
                      label="Nouveau mot de passe"
                      variant="standard"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      fullWidth
                    />
                  </Item>
                </Grid>
                <Grid item xs={6}>
                  <Item>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handlePasswordChange}
                      fullWidth
                    >
                      Confirmer
                    </Button>
                  </Item>
                </Grid>
                <Grid item xs={6}>
                  <Item>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setShowPasswordForm(false)}
                      fullWidth
                    >
                      Annuler
                    </Button>
                  </Item>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default ProfilUser;
