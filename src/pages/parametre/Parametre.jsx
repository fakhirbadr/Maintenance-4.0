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
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

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
    "TATA",
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

  // Fetch actifs depuis l'API
  useEffect(() => {
    const fetchActifs = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/actifs`);
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
        `${apiUrl}/api/v1/users/register`,
        dataToSend
      );

      console.log("Réponse du serveur :", response.data);

      // Alerte de succès
      alert("L'utilisateur a été enregistré avec succès !");

      // Reset form
      setFormData({
        nomComplet: "",
        email: "",
        password: "",
        role: "",
        region: "",
        province: "",
        actifIds: [],
      });
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi des données :",
        error.response || error
      );

      // Alerte en cas d'erreur
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Erreur: ${error.response.data.message}`);
      } else {
        alert("Une erreur s'est produite lors de l'enregistrement.");
      }
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
            <MenuItem value="docteurs">Docteurs</MenuItem>
            <MenuItem value="chargé de stock">Chargé de stock</MenuItem>
            <MenuItem value="chargés de performance">
              Chargés de performance
            </MenuItem>
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
            value={formData.actifIds}
            onChange={(event) => {
              const { value } = event.target;
              // Si "All" est sélectionné, on sélectionne tous les actifs
              if (value.includes("all")) {
                setFormData((prevData) => ({
                  ...prevData,
                  actifIds: actifs.map((actif) => actif._id),
                }));
              } else {
                setFormData((prevData) => ({
                  ...prevData,
                  actifIds: typeof value === "string" ? value.split(",") : value,
                }));
              }
            }}
            fullWidth
            required
            SelectProps={{
              multiple: true,
              renderValue: (selected) =>
                selected.length === 0
                  ? ""
                  : selected.includes("all")
                  ? "All"
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
                  <ListItemText primary={`${actif.name} - ${actif.province}`} />
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
  const [actifs, setActifs] = useState({});
  const [allActifs, setAllActifs] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter actifs based on search query
  const filteredActifs = allActifs.filter((actif) =>
    actif.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/users/user`);
        console.log("Users response:", response.data);
        
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else if (response.data && Array.isArray(response.data.users)) {
          setUsers(response.data.users);
        } else {
          console.error("Unexpected response format:", response.data);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Erreur lors de la récupération des utilisateurs.");
      }
    };

    fetchUsers();
  }, []);

  // Fetch all actifs for dropdown and create actifs map
  useEffect(() => {
    const fetchActifs = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/actifs`);
        console.log("Actifs response:", response.data);
        
        if (Array.isArray(response.data)) {
          setAllActifs(response.data);
          
          // Create actifs map for display
          const actifsMap = response.data.reduce((acc, actif) => {
            acc[actif._id] = actif.name || "Nom inconnu";
            return acc;
          }, {});
          setActifs(actifsMap);
        } else {
          console.error("Unexpected actifs response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching actifs:", error);
      }
    };

    fetchActifs();
  }, []);

  const handleOpenDialog = (user) => {
    // Create a deep copy of the user object to avoid direct mutation
    setSelectedUser({
      ...user,
      actifIds: user.actifIds || [] // Ensure actifIds is always an array
    });
    setSearchQuery(""); // Reset search query when opening dialog
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedUser(null);
    setSearchQuery("");
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      return;
    }

    try {
      const response = await axios.delete(`${apiUrl}/api/v1/users/delete/${userId}`);

      if (response.status === 200) {
        console.log("Utilisateur supprimé avec succès");
        alert("Utilisateur supprimé avec succès.");
        
        // Update the users list instead of reloading the page
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      alert("Une erreur est survenue lors de la suppression de l'utilisateur.");
    }
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    try {
      // Prepare the data to send - exclude _id and other non-updatable fields
      const { _id, __v, createdAt, updatedAt, ...userData } = selectedUser;
      
      // Validate required fields
      if (!userData.email || !userData.nomComplet) {
        alert("Email et nom complet sont requis.");
        return;
      }

      // Ensure actifIds is an array
      if (!Array.isArray(userData.actifIds)) {
        userData.actifIds = [];
      }

      // Filtrer les IDs d'actifs qui existent dans allActifs
      const validActifIds = userData.actifIds.filter(actifId => 
        allActifs.some(actif => actif._id === actifId)
      );

      const invalidActifIds = userData.actifIds.filter(actifId => 
        !allActifs.some(actif => actif._id === actifId)
      );

      // Mettre à jour les actifIds avec seulement les valides
      userData.actifIds = validActifIds;

      console.log("Sending update data:", userData);
      console.log("User ID:", _id);
      console.log("API URL:", `${apiUrl}/api/v1/users/users/${_id}`);

      const response = await axios.put(`${apiUrl}/api/v1/users/users/${_id}`, userData);
      
      console.log("User updated successfully:", response.data);
      alert("Utilisateur mis à jour avec succès.");
      
      // Update the local users state instead of refetching
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === _id ? { ...user, ...userData } : user
        )
      );
      
      if (invalidActifIds.length > 0) {
        alert(`Attention : ${invalidActifIds.length} actif(s) introuvable(s) ont été ignorés.`);
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      
      // More detailed error handling
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        
        if (error.response.data && error.response.data.message) {
          alert(`Erreur: ${error.response.data.message}`);
        } else {
          alert(`Erreur ${error.response.status}: ${error.response.statusText}`);
        }
      } else if (error.request) {
        alert("Erreur de réseau: Impossible de contacter le serveur.");
      } else {
        alert("Une erreur inattendue est survenue.");
      }
    }
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
                <TableRow key={user._id || user.email}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.nomComplet || "Nom non disponible"}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        lineHeight: "1.5rem",
                        maxHeight: "3rem",
                      }}
                    >
                      {user.actifIds && user.actifIds.length > 0
                        ? user.actifIds.map((actifId) => (
                            <span key={actifId}>
                              {actifs[actifId] || "Actif inconnu"}{" "}
                            </span>
                          ))
                        : "Aucun actif"}
                    </Box>
                  </TableCell>
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
                        onClick={() => handleDelete(user._id)}
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
        <Typography>Aucun utilisateur trouvé.</Typography>
      )}

      {/* Update Dialog */}
      {selectedUser && (
        <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>Mettre à jour l'utilisateur</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Nom complet"
                value={selectedUser.nomComplet || ""}
                onChange={(e) => handleInputChange("nomComplet", e.target.value)}
                fullWidth
                required
                margin="dense"
              />
              
              <FormControl fullWidth margin="dense">
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedUser.role || ""}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  label="Role"
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="docteurs">Docteurs</MenuItem>
                  <MenuItem value="chargé de stock">Chargé de stock</MenuItem>
                  <MenuItem value="chargés de performance">Chargés de performance</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Email"
                value={selectedUser.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                fullWidth
                required
                type="email"
                margin="dense"
              />

              {/* Actifs Selection */}
              <FormControl fullWidth margin="dense">
                <InputLabel>Actifs</InputLabel>
                <Select
                  multiple
                  value={selectedUser.actifIds || []}
                  onChange={(e) => handleInputChange("actifIds", e.target.value)}
                  label="Actifs"
                  renderValue={(selected) => {
                    if (selected.length === 0) return "Aucun actif sélectionné";
                    return selected
                      .map((actifId) => actifs[actifId] || "Actif inconnu")
                      .join(", ");
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  {/* Search field inside the dropdown */}
                  <Box sx={{ p: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Rechercher un actif..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Box>

                  {/* Filtered actifs */}
                  {filteredActifs.length > 0 ? (
                    filteredActifs.map((actif) => (
                      <MenuItem key={actif._id} value={actif._id}>
                        <Checkbox 
                          checked={(selectedUser.actifIds || []).includes(actif._id)} 
                        />
                        <ListItemText 
                          primary={`${actif.name} - ${actif.province || 'Province inconnue'}`} 
                        />
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      {searchQuery ? "Aucun actif trouvé" : "Aucun actif disponible"}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Annuler
            </Button>
            <Button onClick={handleSave} color="primary" variant="contained">
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
    <CreateAccountForm key="create" />,
    <UpdateAccountForm key="update" />,
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