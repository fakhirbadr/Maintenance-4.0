import React, { useEffect, useState } from "react";
import axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Badge,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Padding } from "@mui/icons-material";

const Inventaire = () => {
  const [actifs, setActifs] = useState([]); // État pour stocker les actifs
  const [loading, setLoading] = useState(true); // État pour savoir si les données sont en cours de chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs
  const [openDialog, setOpenDialog] = useState(false); // Gérer l'état d'ouverture du dialogue
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [categories, setCategories] = useState([
    {
      name: "",
      equipments: [{ name: "", description: "", isFunctionel: true }],
    },
  ]);

  // Handler to open the dialog
  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  // Handler to close the dialog
  const handleClose = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    axios
      .get("https://backend-v1-e3bx.onrender.com/api/actifs") // Remplacez par l'URL de votre API
      .then((response) => {
        setActifs(response.data); // Stocker les données dans l'état
        setLoading(false);
        console.log(response.data); // Pour visualiser les données
      })
      .catch((err) => {
        setError(err.message); // Gérer l'erreur
        setLoading(false);
      });
  }, []); // Le tableau vide [] signifie que l'effet ne s'exécute qu'une seule fois

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Filtrer les régions pour éviter les répétitions
  const uniqueRegions = [...new Set(actifs.map((actif) => actif.region))];

  const handleAddEquipment = (categoryIndex) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].equipments.push({
      name: "",
      description: "",
      isFunctionel: true,
    });
    setCategories(newCategories);
  };

  // Change handlers for dynamic categories and equipments
  const handleCategoryChange = (index, field, value) => {
    const newCategories = [...categories];
    newCategories[index][field] = value;
    setCategories(newCategories);
  };

  const handleEquipmentChange = (
    categoryIndex,
    equipmentIndex,
    field,
    value
  ) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].equipments[equipmentIndex][field] = value;
    setCategories(newCategories);
  };

  const handleAddCategory = () => {
    setCategories([
      ...categories,
      {
        name: "",
        equipments: [{ name: "", description: "", isFunctionel: true }],
      },
    ]);
  };

  // Submit handler
  const handleSubmit = () => {
    const newActif = {
      name,
      region,
      categories,
    };

    // Make the POST request
    axios
      .post("https://backend-v1-e3bx.onrender.com/api/actifs", newActif) // Change URL if necessary
      .then((response) => {
        console.log(response);
        handleClose(); // Fermer le dialogue après un ajout réussi
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h2 className="pb-3 text-3xl font-extrabold leading-none tracking-tight md:text-4xl uppercase text-orange-500">
        Inventaire des actifs
      </h2>
      <div className="py-4 justify-end flex">
        <Button
          sx={{ padding: "7px" }}
          onClick={handleClickOpen}
          variant="outlined"
        >
          Ajouter un actif
        </Button>
      </div>
      {/* Dialog component */}
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Ajouter un Actif</DialogTitle>
        <DialogContent>
          {/* First Row - Actif Name and Region */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Nom de l'actif"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="region-label">Région</InputLabel>
                <Select
                  labelId="region-label"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  <MenuItem value="Tanger-Tétouan-Al Hoceima">
                    Tanger-Tétouan-Al Hoceima
                  </MenuItem>
                  <MenuItem value="L'Oriental">L'Oriental</MenuItem>
                  <MenuItem value="Fès-Meknès">Fès-Meknès</MenuItem>
                  <MenuItem value="Rabat-Salé-Kénitra">
                    Rabat-Salé-Kénitra
                  </MenuItem>
                  <MenuItem value="Béni Mellal-Khénifra">
                    Béni Mellal-Khénifra
                  </MenuItem>
                  <MenuItem value="Casablanca-Settat">
                    Casablanca-Settat
                  </MenuItem>
                  <MenuItem value="Marrakech-Safi">Marrakech-Safi</MenuItem>
                  <MenuItem value="Drâa-Tafilalet">Drâa-Tafilalet</MenuItem>
                  <MenuItem value="Souss-Massa">Souss-Massa</MenuItem>
                  <MenuItem value="Guelmim-Oued Noun">
                    Guelmim-Oued Noun
                  </MenuItem>
                  <MenuItem value="Laâyoune-Sakia El Hamra">
                    Laâyoune-Sakia El Hamra
                  </MenuItem>
                  <MenuItem value="Dakhla-Oued Ed-Dahab">
                    Dakhla-Oued Ed-Dahab
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Second Row - Categories and Equipments */}
          {categories.map((category, categoryIndex) => (
            <Grid container spacing={2} key={categoryIndex}>
              <Grid item xs={6}>
                <TextField
                  label={`Nom de la catégorie ${categoryIndex + 1}`}
                  fullWidth
                  margin="normal"
                  value={category.name}
                  onChange={(e) =>
                    handleCategoryChange(categoryIndex, "name", e.target.value)
                  }
                />
              </Grid>

              {/* Equipments */}
              {category.equipments.map((equipment, equipmentIndex) => (
                <Grid item xs={6} mt={2} key={equipmentIndex}>
                  <TextField
                    label={`Nom de l'équipement ${equipmentIndex + 1}`}
                    fullWidth
                    value={equipment.name}
                    onChange={(e) =>
                      handleEquipmentChange(
                        categoryIndex,
                        equipmentIndex,
                        "name",
                        e.target.value
                      )
                    }
                  />
                </Grid>
              ))}

              {/* Add Button for more equipments */}
              <Grid item xs={12} mb={3}>
                <Button
                  variant="outlined"
                  onClick={() => handleAddEquipment(categoryIndex)}
                  fullWidth
                >
                  Ajouter un équipement
                </Button>
              </Grid>
            </Grid>
          ))}

          {/* Add Button for more categories */}
          <Grid item xs={12}>
            <Button variant="outlined" onClick={handleAddCategory} fullWidth>
              Ajouter une catégorie
            </Button>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      {uniqueRegions.map((region) => {
        // Total des équipements non fonctionnels pour cette région
        const totalNonFonctionnelsRegion = actifs
          .filter((actif) => actif.region === region)
          .reduce((total, actif) => {
            return (
              total +
              actif.categories.reduce((catTotal, category) => {
                return (
                  catTotal +
                  category.equipments.filter(
                    (equipment) => !equipment.isFunctionel
                  ).length
                );
              }, 0)
            );
          }, 0);

        return (
          <div key={region} className="pb-3">
            <Accordion>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls={`${region}-content`}
                id={`${region}-header`}
              >
                <Typography>
                  {region}{" "}
                  <Badge
                    badgeContent={totalNonFonctionnelsRegion}
                    color="error"
                    sx={{ ml: 3 }}
                  ></Badge>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {actifs
                  .filter((actif) => actif.region === region)
                  .map((actif) => {
                    // Total des équipements non fonctionnels pour cet actif
                    const totalNonFonctionnelsActif = actif.categories.reduce(
                      (catTotal, category) => {
                        return (
                          catTotal +
                          category.equipments.filter(
                            (equipment) => !equipment.isFunctionel
                          ).length
                        );
                      },
                      0
                    );

                    return (
                      <Accordion key={actif._id} sx={{ bgcolor: "#212121" }}>
                        <AccordionSummary
                          expandIcon={<ArrowDropDownIcon />}
                          aria-controls={`${actif.name}-content`}
                          id={`${actif.name}-header`}
                        >
                          <Typography>
                            {actif.name}{" "}
                            <Badge
                              badgeContent={totalNonFonctionnelsActif}
                              color="error"
                              sx={{ ml: 3 }}
                            ></Badge>
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {actif.categories.map((category) => {
                            // Total des équipements non fonctionnels pour cette catégorie
                            const totalNonFonctionnelsCategorie =
                              category.equipments.filter(
                                (equipment) => !equipment.isFunctionel
                              ).length;

                            return (
                              <Accordion
                                key={category._id}
                                sx={{ bgcolor: "#2b2b2b" }}
                              >
                                <AccordionSummary
                                  expandIcon={<ArrowDropDownIcon />}
                                  aria-controls={`${category.name}-content`}
                                  id={`${category.name}-header`}
                                >
                                  <Typography>
                                    {category.name}{" "}
                                    <Badge
                                      badgeContent={
                                        totalNonFonctionnelsCategorie
                                      }
                                      color="error"
                                      sx={{ ml: 3 }}
                                    ></Badge>
                                  </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 2, // Espacement entre les accordéons
                                    }}
                                  >
                                    {category.equipments.map((equipment) => (
                                      <Accordion
                                        key={equipment._id}
                                        sx={{
                                          bgcolor: "#3b3939",
                                          flex: "1 1 calc(23.33% - 16px)", // 3 par ligne avec marge
                                          minWidth: 250, // Largeur minimale pour éviter les problèmes d'ajustement
                                        }}
                                      >
                                        <AccordionSummary
                                          expandIcon={<ArrowDropDownIcon />}
                                          aria-controls={`${equipment.name}-content`}
                                          id={`${equipment.name}-header`}
                                        >
                                          <Typography>
                                            {equipment.name}{" "}
                                            {equipment.isFunctionel
                                              ? "✔️"
                                              : "❌"}
                                          </Typography>
                                        </AccordionSummary>
                                      </Accordion>
                                    ))}
                                  </Box>
                                </AccordionDetails>
                              </Accordion>
                            );
                          })}
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
              </AccordionDetails>
            </Accordion>
          </div>
        );
      })}
    </div>
  );
};

export default Inventaire;
