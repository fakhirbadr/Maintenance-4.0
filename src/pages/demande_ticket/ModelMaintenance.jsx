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
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

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
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedActifId, setSelectedActifId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedEquipmentId, setSelectedEquipmentId] = useState("");
  const [selectedRegionActif, setSelectedRegionActif] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const userIds = JSON.parse(localStorage.getItem("userActifs"));
    if (userIds && Array.isArray(userIds)) {
      Promise.all(
        userIds.map(async (id) => {
          try {
            const response = await fetch(`${apiUrl}/api/actifs/${id}`);
            if (response.ok) {
              return await response.json();
            }
          } catch (e) {
            console.error(e);
          }
          return null;
        })
      ).then((results) => {
        const actifs = results.filter(Boolean);
        setNames(actifs);
        if (actifs.length > 0) {
          setSelectedName(actifs[0].name);
          setSelectedActifId(actifs[0]._id);
          setCategories(actifs[0].categories || []);
          setSelectedCategory(actifs[0].categories[0]?.name || "");
          setSelectedCategoryId(actifs[0].categories[0]?._id || "");
          setEquipments(actifs[0].categories[0]?.equipments || []);
          setSelectedEquipment(
            actifs[0].categories[0]?.equipments[0]?.name || ""
          );
          setSelectedEquipmentId(
            actifs[0].categories[0]?.equipments[0]?._id || ""
          );
          setSelectedRegionActif(actifs[0].region || "");
          setProvince(actifs[0].province || "");
        }
      });
    }
  }, []);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      if (userInfo.nomComplet) {
        setTechnicien(userInfo.nomComplet);
      }
    }
  }, []);

  const handleSelectChange = (event) => {
    const actifName = event.target.value;
    setSelectedName(actifName);
    setSelectedCategory("");
    setSelectedEquipment("");
    const selectedActif = names.find((actif) => actif.name === actifName);
    if (selectedActif) {
      setSelectedActifId(selectedActif._id);
      setCategories(selectedActif.categories || []);
      setSelectedRegionActif(selectedActif.region || "");
      setProvince(selectedActif.province || "");
      // Init category & equipment
      if (selectedActif.categories && selectedActif.categories.length > 0) {
        setSelectedCategory(selectedActif.categories[0].name || "");
        setSelectedCategoryId(selectedActif.categories[0]._id || "");
        setEquipments(selectedActif.categories[0].equipments || []);
        if (
          selectedActif.categories[0].equipments &&
          selectedActif.categories[0].equipments.length > 0
        ) {
          setSelectedEquipment(
            selectedActif.categories[0].equipments[0].name || ""
          );
          setSelectedEquipmentId(
            selectedActif.categories[0].equipments[0]._id || ""
          );
        } else {
          setSelectedEquipment("");
          setSelectedEquipmentId("");
        }
      } else {
        setSelectedCategory("");
        setSelectedCategoryId("");
        setEquipments([]);
        setSelectedEquipment("");
        setSelectedEquipmentId("");
      }
    } else {
      setCategories([]);
      setSelectedCategory("");
      setEquipments([]);
      setSelectedEquipment("");
      setSelectedActifId("");
      setSelectedRegionActif("");
      setProvince("");
    }
  };

  const handleCategoryChange = (event) => {
    const categoryName = event.target.value;
    setSelectedCategory(categoryName);
    setSelectedEquipment("");
    const selectedCategoryObj = categories.find(
      (category) => category.name === categoryName
    );
    if (selectedCategoryObj) {
      setSelectedCategoryId(selectedCategoryObj._id);
      setEquipments(selectedCategoryObj.equipments || []);
      if (
        selectedCategoryObj.equipments &&
        selectedCategoryObj.equipments.length > 0
      ) {
        setSelectedEquipment(selectedCategoryObj.equipments[0].name || "");
        setSelectedEquipmentId(selectedCategoryObj.equipments[0]._id || "");
      } else {
        setSelectedEquipment("");
        setSelectedEquipmentId("");
      }
    } else {
      setEquipments([]);
      setSelectedEquipment("");
      setSelectedCategoryId("");
    }
  };

  const handleEquipmentChange = (event) => {
    const equipmentName = event.target.value;
    setSelectedEquipment(equipmentName);
    const selectedEquipmentObj = equipments.find(
      (equipment) => equipment.name === equipmentName
    );
    if (selectedEquipmentObj) {
      setSelectedEquipmentId(selectedEquipmentObj._id);
    } else {
      setSelectedEquipmentId("");
    }
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedActifId || !selectedCategoryId || !selectedEquipmentId) {
      setError("Certains IDs sont manquants : Actif, Catégorie ou Équipement.");
      return;
    }
    setIsSubmitting(true);
    const ticketData = {
      site: selectedName,
      categorie: selectedCategory,
      equipement_deficitaire: selectedEquipment,
      name: name,
      urgence: urgence,
      province,
      region: selectedRegionActif,
      technicien,
      description,
      selectedActifId,
      selectedCategoryId,
      selectedEquipmentId,
    };
    try {
      const response = await fetch(`${apiUrl}/api/v1/ticketMaintenance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
      });
      if (response.ok) {
        setSuccess("Ticket créé avec succès !");
        // PUT update
        const updateResponse = await fetch(
          `${apiUrl}/api/actifs/${selectedActifId}/categories/${selectedCategoryId}/equipments/${selectedEquipmentId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isFunctionel: false }),
          }
        );
        if (updateResponse.ok) {
          setTimeout(() => {
            setSuccess("");
            onClose();
          }, 2000);
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
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Faire une demande de maintenance</DialogTitle>
      <DialogContent>
        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
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
          {/* Actif, Catégorie, Équipement */}
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
            <TextField
              fullWidth
              label="Technicien"
              value={technicien}
              onChange={(e) => setTechnicien(e.target.value)}
              disabled
            />
          </Grid>
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
              label="Region"
              value={selectedRegionActif}
              onChange={(e) => setSelectedRegionActif(e.target.value)}
              disabled
            />
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
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category.name}>
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
                label="Équipement"
              >
                {equipments.map((equipment) => (
                  <MenuItem key={equipment._id} value={equipment.name}>
                    {equipment.name}
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
        <Button onClick={handleSubmit} disabled={isSubmitting} color="primary">
          Soumettre
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModelMaintenance;
