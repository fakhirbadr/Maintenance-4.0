import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Alert,
  Grid,
} from "@mui/material";

const ModelMaintenance = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [names, setNames] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [equipments, setEquipments] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [urgence, setUrgence] = useState("");
  const [province, setProvince] = useState("");
  const [technicien, setTechnicien] = useState("");
  const [description, setDescription] = useState(""); // Ajout de l'état pour description
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedActifId, setSelectedActifId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedEquipmentId, setSelectedEquipmentId] = useState("");

  useEffect(() => {
    const userIds = JSON.parse(localStorage.getItem("userActifs"));
    if (userIds && Array.isArray(userIds)) {
      const fetchedNames = [];
      userIds.forEach(async (id) => {
        try {
          const response = await fetch(
            `https://backend-v1-e3bx.onrender.com/api/actifs/${id}`
          );
          if (response.ok) {
            const data = await response.json();
            fetchedNames.push(data); // Ajoutez l'objet complet ici
            if (fetchedNames.length === userIds.length) {
              setNames(fetchedNames); // Mettez à jour avec les objets complets
              setSelectedName(fetchedNames[""].name); // Utilisez le premier nom
              setCategories(fetchedNames[""].categories || [""]); // Catégories du premier actif
              setSelectedCategory(fetchedNames[0].categories[0]?.name || "");
              setEquipments(fetchedNames[0].categories[0]?.equipments || []);
              setSelectedEquipment(
                fetchedNames[0].categories[0]?.equipments[0]?._id || ""
              );
            }
          } else {
            console.error(`Erreur pour l'ID ${id}: ${response.statusText}`);
          }
        } catch (error) {
          console.error(
            `Erreur lors de la récupération des données pour l'ID ${id}:`,
            error
          );
        }
      });
    }
  }, []);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo); // Parse the stored JSON object
      if (userInfo.province) {
        setProvince(userInfo.province); // Mise à jour de province
      }
      if (userInfo.nomComplet) {
        setTechnicien(userInfo.nomComplet); // Mise à jour du technicien
      }
    }
  }, []);
  const handleSelectChange = (event) => {
    const name = event.target.value;
    setSelectedName(name);
    setSelectedCategory("");
    setSelectedEquipment("");

    const selectedActif = names.find((actif) => actif.name === name);
    if (selectedActif) {
      setSelectedActifId(selectedActif._id); // Stocke l'ID de l'actif
      setCategories(selectedActif.categories);
      setSelectedCategory(selectedActif.categories[0]?.name || "");
      setSelectedEquipment(
        selectedActif.categories[0]?.equipments[0]?._id || ""
      );
    } else {
      console.error("Actif introuvable pour le nom :", name);
    }
  };

  const handleCategoryChange = (event) => {
    const categoryName = event.target.value;
    setSelectedCategory(categoryName);
    setSelectedEquipment("");

    const selectedCategory = categories.find(
      (category) => category.name === categoryName
    );

    if (selectedCategory) {
      setSelectedCategoryId(selectedCategory._id); // Stocke l'ID de la catégorie
      setEquipments(selectedCategory.equipments);
    }
  };

  const handleEquipmentChange = (event) => {
    const selectedName = event.target.value;
    setSelectedEquipment(selectedName);

    const selectedEquipmentObj = equipments.find(
      (equipment) => equipment.name === selectedName
    );

    if (selectedEquipmentObj) {
      setSelectedEquipmentId(selectedEquipmentObj._id); // Stocke l'ID de l'équipement
    }
  };
  // Fonction pour gérer la description
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  // Fonction pour soumettre la demande de maintenance
  const handleSubmit = async () => {
    // Vérifier si les ID sont définis avant d'envoyer les requêtes
    if (!selectedActifId || !selectedCategoryId || !selectedEquipmentId) {
      setError("Certains IDs sont manquants : Actif, Catégorie ou Équipement.");
      return; // Arrêter la soumission si les IDs sont manquants
    }
    console.log("Actif ID:", selectedActifId);
    console.log("Category ID:", selectedCategoryId);
    console.log("Equipment ID:", selectedEquipmentId);

    const ticketData = {
      site: selectedName, // Utilise le nom de l'actif
      categorie: selectedCategory, // Utilise la catégorie sélectionnée
      equipement_deficitaire: selectedEquipment,
      name: name, // Envoie l'ID de l'équipement
      urgence: urgence,
      province,
      technicien,
      description,
      selectedActifId: selectedActifId,
      selectedCategoryId: selectedCategoryId,
      selectedEquipmentId: selectedEquipmentId,
    };
    console.log(ticketData);
    try {
      // POST pour créer un ticket de maintenance
      const response = await fetch(
        "https://backend-v1-e3bx.onrender.com/api/v1/ticketMaintenance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ticketData),
        }
      );

      if (response.ok) {
        setSuccess("Ticket créé avec succès !");

        // Si le ticket a été créé avec succès, effectuer la mise à jour via PUT
        const updateResponse = await fetch(
          `https://backend-v1-e3bx.onrender.com/api/actifs/${selectedActifId}/categories/${selectedCategoryId}/equipments/${selectedEquipmentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              // Vous pouvez envoyer des données supplémentaires si nécessaire pour la mise à jour
              isFunctionel: false, // Exemple de mise à jour de statut
            }),
          }
        );

        if (updateResponse.ok) {
          setTimeout(() => {
            setSuccess(""); // Effacer le message de succès après un certain délai
            onClose(); // Fermer la modale après la soumission
          }, 2000); // Rester visible pendant 2 secondes
        } else {
          console.error(
            "Erreur lors de la mise à jour de l'équipement",
            updateResponse.statusText
          );
        }
      } else {
        console.error(
          "Erreur lors de l'envoi de la requête",
          response.statusText
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de la soumission de la demande de maintenance:",
        error
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Faire une demande de maintenance</DialogTitle>
      <DialogContent>
        {success && <Alert severity="success">{success}</Alert>}

        <Grid container spacing={3}>
          {/* First row: Type d'intervention and Urgence */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
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
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
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
          </Grid>

          {/* Second row: Précisez and Technicien */}
          {name === "Autre" && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Précisez le type d'intervention"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
              />
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Technicien"
              value={technicien}
              onChange={(e) => setTechnicien(e.target.value)}
              disabled
            />
          </Grid>

          {/* Third row: Actif, Catégorie, Équipement */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="select-label">Nom de l'Actif</InputLabel>
              <Select
                labelId="select-label"
                id="select"
                value={selectedName}
                onChange={handleSelectChange}
              >
                {names.map((actif) => (
                  <MenuItem key={actif._id} value={actif.name}>
                    {actif.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="category-select-label">Catégorie</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
                label="Catégorie"
              >
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="equipment-select-label">Équipement</InputLabel>
              <Select
                labelId="equipment-select-label"
                id="equipment-select"
                value={selectedEquipment}
                onChange={handleEquipmentChange}
              >
                {equipments.map((equipment) => (
                  <MenuItem key={equipment._id} value={equipment.name}>
                    {equipment.name} {/* Affiche le nom de l'équipement */}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Description field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={handleDescriptionChange}
              multiline
              rows={3}
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

export default ModelMaintenance;
