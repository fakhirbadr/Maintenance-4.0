import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Tabs,
  Tab,
  Skeleton,
  Checkbox,
  ListItemText,
  Select,
  Grid,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import axios from "axios";

const regions = {
  "Tanger-Tétouan-Al Hoceïma": [
    "Tanger",
    "Tétouan",
    "Al Hoceïma",
    "Chefchaouen",
    "Larache",
    "Ouezzane",
    "Fahs-Anjra",
  ],
  "L'Oriental": [
    "Oujda-Angad",
    "Nador",
    "Berkane",
    "Driouch",
    "Taourirt",
    "Jerada",
    "Guercif",
    "Figuig",
  ],
  "Fès-Meknès": [
    "Fès",
    "Meknès",
    "Ifrane",
    "Taza",
    "Sefrou",
    "Boulemane",
    "El Hajeb",
    "Moulay Yacoub",
    "Taounate",
  ],
  "Rabat-Salé-Kénitra": [
    "Rabat",
    "Salé",
    "Kénitra",
    "Sidi Kacem",
    "Sidi Slimane",
    "Khémisset",
  ],
  "Béni Mellal-Khénifra": [
    "Béni Mellal",
    "Khénifra",
    "Azilal",
    "Fquih Ben Salah",
    "Kasba Tadla",
  ],
  "Casablanca-Settat": [
    "Casablanca",
    "Mohammedia",
    "Settat",
    "El Jadida",
    "Berrechid",
    "Nouaceur",
    "Médiouna",
    "Sidi Bennour",
    "Benslimane",
  ],
  "Marrakech-Safi": [
    "Marrakech",
    "Safi",
    "El Jadida",
    "Essaouira",
    "Rehamna",
    "Chichaoua",
    "Al Haouz",
    "Youssoufia",
    "El Kelaâ des Sraghna",
  ],
  "Drâa-Tafilalet": ["Errachidia", "Ouarzazate", "Zagora", "Tinghir", "Midelt"],
  "Souss-Massa": [
    "Agadir Ida-Outanane",
    "Taroudant",
    "Tiznit",
    "Chtouka Aït Baha",
    "Inezgane-Aït Melloul",
  ],
  "Guelmim-Oued Noun": ["Guelmim", "Tan-Tan", "Sidi Ifni", "Assa-Zag"],
  "Laâyoune-Sakia El Hamra": ["Laâyoune", "Boujdour", "Tarfaya", "Es-Semara"],
  "Dakhla-Oued Ed-Dahab": ["Dakhla", "Oued Ed-Dahab", "Aousserd"],
};

function CreateAccountForm() {
  const [formData, setFormData] = useState({
    nomComplet: "",
    email: "",
    password: "",
    role: "",
    region: "",
    province: "",
    actifIds: [],
  });

  const [actifs, setActifs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour mettre à jour la valeur de la recherche

  // Fetch actifs depuis l'API
  useEffect(() => {
    const fetchActifs = async () => {
      try {
        const response = await axios.get(
          "https://backend-v1-e3bx.onrender.com/api/actifs"
        );
        setActifs(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des actifs :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActifs();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Afficher le nom et l'_id de l'actif sélectionné
    if (name === "actif") {
      const selectedActif = actifs.find((actif) => actif._id === value);
      if (selectedActif) {
        console.log("Nom:", selectedActif.name, "ID:", selectedActif._id);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const dataToSend = {
      nomComplet: formData.nomComplet,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      province: formData.province,
      actifIds: formData.actifIds, // IDs des actifs sélectionnés
    };

    try {
      console.log("Données envoyées :", dataToSend);

      const response = await axios.post(
        "https://backend-v1-e3bx.onrender.com/api/v1/users/register",
        dataToSend
      );

      console.log("Réponse du serveur :", response.data);

      // Alerte de succès
      alert("L'utilisateur a été enregistré avec succès !");

      // Recharger la page
      window.location.reload();
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi des données :",
        error.response || error
      );

      // Alerte en cas d'erreur
      alert("Une erreur s'est produite lors de l'enregistrement.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "left",
      }}
    >
      <Typography variant="h6">Création de compte</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nom Complet"
            name="nomComplet"
            value={formData.nomComplet}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Mot de passe"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Rôle"
            name="role"
            select
            value={formData.role}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Région"
            name="region"
            select
            value={formData.region}
            onChange={handleChange}
            fullWidth
            required
          >
            {Object.keys(regions).map((region) => (
              <MenuItem key={region} value={region}>
                {region}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Province"
            name="province"
            select
            value={formData.province}
            onChange={handleChange}
            fullWidth
            required
            disabled={!formData.region}
          >
            {formData.region &&
              regions[formData.region]?.map((province) => (
                <MenuItem key={province} value={province}>
                  {province}
                </MenuItem>
              ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            label="Actifs"
            name="actifIds"
            select
            value={formData.actifIds} // Should be an array for multiple selection
            onChange={(event) => {
              const { value } = event.target;
              // Si "All" est sélectionné, on sélectionne tous les actifs
              if (value.includes("all")) {
                setFormData((prevData) => ({
                  ...prevData,
                  actifIds: actifs.map((actif) => actif._id), // Sélectionne tous les actifs
                }));
              } else {
                setFormData((prevData) => ({
                  ...prevData,
                  actifIds:
                    typeof value === "string" ? value.split(",") : value, // Handle arrays
                }));
              }
            }}
            fullWidth
            required
            SelectProps={{
              multiple: true, // Enable multiple selection
              renderValue: (selected) =>
                selected.length === 0
                  ? ""
                  : selected.includes("all")
                  ? "All" // Affiche "All" si tous les actifs sont sélectionnés
                  : actifs
                      .filter((actif) => selected.includes(actif._id))
                      .map((actif) => actif.name)
                      .join(", "),
            }}
          >
            {/* "All" option */}
            <MenuItem value="all">
              <Checkbox checked={formData.actifIds.length === actifs.length} />
              <ListItemText primary="All" />
            </MenuItem>

            {loading ? (
              <MenuItem disabled>
                <Skeleton variant="text" width="100%" />
              </MenuItem>
            ) : actifs.length > 0 ? (
              actifs.map((actif) => (
                <MenuItem key={actif._id} value={actif._id}>
                  <Checkbox checked={formData.actifIds.includes(actif._id)} />
                  <ListItemText primary={actif.name} />
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Aucun actif disponible</MenuItem>
            )}
          </TextField>
        </Grid>
      </Grid>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ width: "100%" }}
      >
        Créer l'utilisateur
      </Button>
    </Box>
  );
}

function UpdateAccountForm() {
  const [users, setUsers] = useState([]);
  const [actifs, setActifs] = useState({}); // Dictionnaire pour stocker les noms des actifs
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Utilisateur sélectionné
  const [searchQuery, setSearchQuery] = useState(""); // État pour gérer la recherche

  // Fonction pour mettre à jour la valeur de la recherche
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtrer les actifs en fonction de la recherche
  const filteredActifs = Object.keys(actifs).filter((actifId) =>
    actifs[actifId].includes(searchQuery)
  );

  useEffect(() => {
    axios
      .get("https://backend-v1-e3bx.onrender.com/api/v1/users/user")
      .then((response) => {
        console.log(response.data); // Log the API response to inspect its structure
        if (Array.isArray(response.data)) {
          setUsers(response.data); // Si c'est un tableau, on le définit
        } else if (response.data && Array.isArray(response.data.users)) {
          setUsers(response.data.users); // Si les utilisateurs sont dans une propriété "users"
        }
      })
      .catch((error) => {
        console.error("There was an error fetching users!", error);
      });
  }, []);

  useEffect(() => {
    if (!Array.isArray(users) || users.length === 0) {
      console.warn(
        "Aucun utilisateur valide trouvé ou 'users' n'est pas un tableau."
      );
      return;
    }

    // Extraire les actifIds des utilisateurs
    const allActifIds = users.flatMap((user) => user.actifIds || []); // Ajout d'une validation pour éviter les erreurs
    const uniqueActifIds = [...new Set(allActifIds)]; // Éviter les doublons

    if (uniqueActifIds.length === 0) {
      console.warn("Aucun actifId unique trouvé.");
      return;
    }

    // Requête pour récupérer les informations des actifs
    axios
      .get("https://backend-v1-e3bx.onrender.com/api/actifs", {
        params: { ids: uniqueActifIds.join(",") }, // Passer les ids des actifs sous forme de chaîne
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          const actifsMap = response.data.reduce((acc, actif) => {
            acc[actif._id] = actif.name || "Nom inconnu"; // Gestion des noms manquants
            return acc;
          }, {});
          setActifs(actifsMap); // Mettre à jour l'état
        } else {
          console.error(
            "Réponse inattendue : les données des actifs ne sont pas un tableau.",
            response.data
          );
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des actifs :", error);
      });
  }, [users]);
  // La dépendance ici garantit que l'effet sera exécuté quand `users` changera

  const handleOpenDialog = (user) => {
    setSelectedUser(user); // Définir l'utilisateur sélectionné
    setOpen(true); // Ouvrir le dialogue
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedUser(null); // Réinitialiser l'utilisateur sélectionné
  };

  const handleUpdate = (userId) => {
    setOpen(true);
  };

  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(
        `https://backend-v1-e3bx.onrender.com/api/v1/users/delete/${userId}`
      );

      if (response.status === 200) {
        console.log("Utilisateur supprimé avec succès");

        // Affiche une alerte pour indiquer la réussite
        alert("Utilisateur supprimé avec succès.");

        // Rafraîchit la page pour recharger la liste des utilisateurs
        window.location.reload();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      alert("Une erreur est survenue lors de la suppression de l'utilisateur.");
    }
  };

  const handleSave = () => {
    // Exemple d'appel à une API pour mettre à jour l'utilisateur
    const { _id, ...userData } = selectedUser;
    axios
      .put(
        `https://backend-v1-e3bx.onrender.com/api/v1/users/users/${_id}`,
        userData
      )
      .then((response) => {
        console.log("User updated successfully:", response.data);
        alert("Utilisateur mis à jour avec succès.");
        setOpen(false);
        // Rafraîchir la liste des utilisateurs
        axios
          .get("https://backend-v1-e3bx.onrender.com/api/v1/users/user")
          .then((response) => setUsers(response.data));
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour:", error);
        alert("Une erreur est survenue lors de la mise à jour.");
      });
  };

  const handleInputChange = (field, value) => {
    setSelectedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div>
      {Array.isArray(users) && users.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Nom complet</TableCell>
                <TableCell>Actifs</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.email}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.nomComplet || "Nom non disponible"}
                  </TableCell>{" "}
                  {/* Affiche un message par défaut si nomComplet est vide ou manquant */}
                  <TableCell>
                    {user.actifIds && user.actifIds.length > 0
                      ? user.actifIds.map((actifId) => (
                          <span key={actifId}>
                            {actifs[actifId] || "Actif inconnu"}{" "}
                          </span>
                        ))
                      : "Aucun actif"}
                  </TableCell>
                  {/* Affiche "Aucun actif" si actifIds est vide ou manquant */}
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleOpenDialog(user)}
                        style={{ marginRight: "5px" }}
                      >
                        Update
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(user._id)} // Pass the user ID
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>No users found.</p>
      )}
      {/* Dialog de mise à jour */}
      {selectedUser && (
        <Dialog open={open} onClose={handleCloseDialog} className="w-full">
          <DialogTitle>Mettre à jour l'utilisateur</DialogTitle>
          <DialogContent>
            <TextField
              label="Nom complet"
              value={selectedUser.nomComplet || ""}
              onChange={(e) => handleInputChange("nomComplet", e.target.value)}
              fullWidth
              margin="dense"
              className="w-full" // Garantir que la largeur est pleine
            />
            <div>
              <label>Role</label>
              <Select
                value={selectedUser.role || ""}
                onChange={(e) => handleInputChange("role", e.target.value)}
                fullWidth
                className="w-full" // Forcer la largeur à 100%
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </div>
            <TextField
              label="Email"
              value={selectedUser.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              fullWidth
              margin="dense"
              className="w-full" // Garantir que la largeur est pleine
            />
            {/* Liste des actifs */}
            <div>
              <InputLabel>Actifs</InputLabel>
              <FormControl fullWidth>
                <Select
                  multiple
                  value={selectedUser.actifIds || []}
                  onChange={(e) =>
                    handleInputChange("actifIds", e.target.value)
                  }
                  renderValue={(selected) => {
                    return selected
                      .map((actifId) => actifs[actifId] || "Actif inconnu")
                      .join(", ");
                  }}
                  className="w-full"
                >
                  {/* Champ de recherche */}
                  <TextField
                    fullWidth
                    label="Rechercher"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    variant="outlined"
                    size="small"
                    style={{ marginBottom: "8px" }} // Style optionnel pour le champ de recherche
                  />

                  {/* MenuItems filtrés selon la recherche */}
                  {filteredActifs.length > 0 ? (
                    filteredActifs.map((actifId) => (
                      <MenuItem key={actifId} value={actifId}>
                        {actifs[actifId] || "Actif inconnu"}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>Aucun actif trouvé</MenuItem> // Message lorsque rien n'est trouvé
                  )}
                </Select>
              </FormControl>
            </div>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Annuler
            </Button>
            <Button onClick={handleSave} color="primary">
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

function Parametre() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabContents = [
    <CreateAccountForm />,
    <UpdateAccountForm />,
    <Typography>Autre contenu</Typography>, // Il semble qu'il manque un composant ici pour le troisième tab
  ];

  return (
    <Box sx={{ p: 3 }}>
      <div className="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl uppercase text-orange-500">
        Paramètres
      </div>
      <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
        <Tab label="Création de compte" />
        <Tab label="Affectation" />
      </Tabs>
      <Box sx={{ mt: 3 }}>{tabContents[activeTab]}</Box>
    </Box>
  );
}

export default Parametre;
