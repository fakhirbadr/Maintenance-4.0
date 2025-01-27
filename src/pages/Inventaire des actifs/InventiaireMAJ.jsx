import {
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Grid,
  Typography,
  Badge,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { EditIcon } from "lucide-react";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const regionsMaroc = [
  "Rabat-Salé-Kénitra",
  "Casablanca-Settat",
  "Marrakech-Safi",
  "Fès-Meknès",
  "Tanger-Tétouan-Al Hoceïma",
  "Souss-Massa",
  "Drâa-Tafilalet",
  "Béni Mellal-Khénifra",
  "Oriental",
];

const InventaireMAJ = () => {
  const [openRegion, setOpenRegion] = useState(false);
  const [openActif, setOpenActif] = useState(null);
  const [openCategory, setOpenCategory] = useState(null);
  const [actifs, setActifs] = useState([]);
  const [besoins, setBesoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Control editing mode

  // State to store region totals
  const [regionTotals, setRegionTotals] = useState({});

  // State to store non-functional equipment count for each region
  const [regionNonFunctional, setRegionNonFunctional] = useState({});

  useEffect(() => {
    // Fetch actifs
    axios
      .get(`${apiUrl}/api/actifs`)
      .then((response) => {
        setActifs(response.data);
        // After fetching the actifs, calculate region totals
        regionsMaroc.forEach((region) => calculateRegionTotal(region));
      })
      .catch((err) => {
        setError(err.message);
      });

    // Fetch besoins
    const fetchBesoins = async () => {
      try {
        const fournituresResponse = await axios.get(
          `${apiUrl}/api/v1/fournitureRoutes?isClosed=false&isDeleted=false`
        );
        const subticketsResponse = await axios.get(
          `${apiUrl}/api/v1/subtickets?isClosed=false`
        );

        // Transform subtickets fields
        const formattedSubtickets = subticketsResponse.data.subTickets.map(
          (item) => ({
            id: item._id,
            name: item.site,
            region: item.region,
            province: item.province,
            technicien: item.technicien,
            categorie: item.categorie,
            quantite: item.quantite,
            besoin: item.equipement_deficitaire,
            commentaire: item.commentaire,
          })
        );

        // Merge both responses
        const mergedBesoins = [
          ...fournituresResponse.data.fournitures,
          ...formattedSubtickets,
        ];
        console.log("Merged Besoins:", mergedBesoins);

        setBesoins(mergedBesoins);
      } catch (err) {
        console.error("Erreur lors du chargement des besoins:", err);
      }
    };

    fetchBesoins();
  }, []); // This will run once, when the component is mounted.
  // This will run once, when the component is mounted.

  // Function to calculate the total for a region and non-functional equipment count
  const calculateRegionTotal = (region) => {
    const actifsRegion = actifs.filter((actif) => actif.region === region);

    // Calcul du total des besoins pour la région
    const totalBesoinsRegion = actifsRegion.reduce((total, actif) => {
      const besoinsActif = besoins.filter(
        (besoin) => besoin.name === actif.name
      );
      return total + besoinsActif.length;
    }, 0);

    // Calcul du nombre d'équipements non fonctionnels pour la région
    const nonFunctionalCountRegion = actifsRegion.reduce((total, actif) => {
      const nonFunctionalCount = actif.categories?.reduce(
        (count, category) =>
          count +
          category.equipments.filter((equipment) => !equipment.isFunctionel)
            .length,
        0
      );
      return total + nonFunctionalCount;
    }, 0);

    // Mise à jour des états avec les résultats calculés
    setRegionTotals((prev) => ({
      ...prev,
      [region]: totalBesoinsRegion,
    }));

    setRegionNonFunctional((prev) => ({
      ...prev,
      [region]: nonFunctionalCountRegion,
    }));
  };

  // Load totals for each region when the component is mounted
  useEffect(() => {
    regionsMaroc.forEach((region) => calculateRegionTotal(region));
  }, [actifs, besoins]); // Recalculate if actifs or besoins change

  const updateActifName = (actifId) => {
    if (!newName.trim()) {
      alert("Please provide a valid name.");
      return;
    }

    axios
      .put(`http://localhost:3000/api/actifs/${actifId}`, { name: newName })
      .then((response) => {
        // Update the actif state with the new name
        setActifs((prevActifs) =>
          prevActifs.map((actif) =>
            actif._id === actifId ? { ...actif, name: newName } : actif
          )
        );
        setNewName(""); // Reset the name input field
        alert("Asset name updated successfully.");
      })
      .catch((err) => {
        console.error("Error updating asset name:", err);
        alert("Failed to update asset name.");
      });
  };

  return (
    <div>
      <h2 className="pb-3 text-3xl font-extrabold leading-none tracking-tight md:text-4xl uppercase text-orange-500">
        Inventaire des actifs
      </h2>
      {/* <div className="py-4 justify-end flex">
        <Button sx={{ padding: "7px" }} variant="outlined">
          Ajouter un actif
        </Button>
      </div> */}

      {regionsMaroc.map((region, index) => {
        // Charger les actifs de la région spécifique
        const actifsRegion = actifs.filter((actif) => actif.region === region);

        // Get the total of needs for this region from the state
        const totalBesoinsRegion = regionTotals[region] || 0;

        // Get the total of non-functional equipment for this region from the state
        const totalNonFunctionalRegion = regionNonFunctional[region] || 0;

        return (
          <Accordion
            key={index}
            expanded={openRegion === index}
            onChange={() => {
              setOpenRegion(openRegion === index ? false : index);
              loadActifs(region);
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <h3>{region}</h3>
                <Badge
                  badgeContent={totalNonFunctionalRegion}
                  color="error"
                  sx={{ marginLeft: 2 }} // Add padding here
                />
                <Badge
                  badgeContent={totalBesoinsRegion}
                  color="warning"
                  sx={{ marginLeft: 2, paddingLeft: 1 }} // Add padding here
                />
              </div>
            </AccordionSummary>
            <AccordionDetails>
              {loading ? (
                <CircularProgress />
              ) : error ? (
                <p>Error: {error}</p>
              ) : actifsRegion.length > 0 ? (
                <List>
                  {actifsRegion.map((actif) => {
                    const besoinsActif = besoins.filter(
                      (besoin) => besoin.name === actif.name
                    );

                    // Calculate the total number of non-functional equipment for the actif
                    const nonFunctionalCount = actif.categories?.reduce(
                      (count, category) =>
                        count +
                        category.equipments.filter(
                          (equipment) => !equipment.isFunctionel
                        ).length,
                      0
                    );

                    return (
                      <Accordion
                        key={actif.id}
                        expanded={openActif === actif._id}
                        onChange={() =>
                          setOpenActif(
                            openActif === actif._id ? null : actif._id
                          )
                        }
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`panel${actif.id}-content`}
                          id={`panel${actif.id}-header`}
                        >
                          <ListItemText
                            primary={
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between", // Permet de pousser le bouton à droite
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {actif.name}
                                  {nonFunctionalCount > 0 && (
                                    <Badge
                                      badgeContent={nonFunctionalCount}
                                      color="error"
                                      sx={{ marginLeft: 2 }}
                                    />
                                  )}
                                  <Badge
                                    badgeContent={besoinsActif.length}
                                    color="warning"
                                    sx={{ marginLeft: 2, paddingLeft: 1 }}
                                  />
                                </div>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  startIcon={<EditIcon fontSize="small" />}
                                  sx={{
                                    width: "40px",
                                    height: "30px",
                                    minWidth: "40px",
                                    padding: "4px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                  onClick={() => {
                                    // Activate editing mode and set the current name as the newName
                                    setNewName(actif.name); // Assuming `actif.name` is the current name
                                    setIsEditing(true); // Enable editing mode
                                  }}
                                >
                                  {/* Icon only, no text */}
                                </Button>

                                {/* Conditionally render the TextField based on isEditing */}
                                {isEditing && (
                                  <TextField
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    label="New Asset Name"
                                    variant="outlined"
                                    fullWidth
                                    sx={{ marginTop: "10px" }}
                                  />
                                )}

                                {/* Only show the update button when in editing mode */}
                                {isEditing && (
                                  <Button
                                    onClick={() => updateActifName(actif._id)} // Assuming `actif._id` is the ID
                                    variant="contained"
                                    color="primary"
                                    sx={{ marginTop: "10px" }}
                                  >
                                    Update Name
                                  </Button>
                                )}
                              </div>
                            }
                            sx={{
                              backgroundColor: "#332f2f",
                              padding: "8px",
                              borderRadius: "4px",
                            }}
                          />
                        </AccordionSummary>
                        <AccordionDetails>
                          {actif.categories && (
                            <List sx={{ pl: 4 }}>
                              {actif.categories.map((category) => {
                                // Count non-functional equipment for this category
                                const nonFunctionalCountCategory =
                                  category.equipments.filter(
                                    (equipment) => !equipment.isFunctionel
                                  ).length;

                                return (
                                  <div key={category.id}>
                                    <ListItem
                                      button
                                      onClick={() =>
                                        setOpenCategory(
                                          openCategory === category.id
                                            ? null
                                            : category.id
                                        )
                                      }
                                      selected={openCategory === category.id}
                                    >
                                      <ListItemText
                                        primary={
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              width: "100%",
                                            }}
                                          >
                                            {category.name}
                                            {nonFunctionalCountCategory > 0 && (
                                              <Badge
                                                badgeContent={
                                                  nonFunctionalCountCategory
                                                }
                                                color="error"
                                                sx={{ marginLeft: 2 }}
                                              />
                                            )}
                                            <div style={{ flexGrow: 1 }} />{" "}
                                            {/* This pushes the button to the right */}
                                          </div>
                                        }
                                      />
                                    </ListItem>

                                    {openCategory === category.id &&
                                      category.equipments && (
                                        <Grid container spacing={2}>
                                          {category.equipments.map(
                                            (equipment) => (
                                              <Grid
                                                item
                                                xs={2}
                                                sm={2}
                                                md={2}
                                                lg={2}
                                                key={equipment.id}
                                              >
                                                <ListItem>
                                                  <ListItemText
                                                    primary={equipment.name}
                                                    secondary={
                                                      equipment.details
                                                    }
                                                  />
                                                  <div
                                                    style={{
                                                      marginLeft: "10px",
                                                    }}
                                                  >
                                                    {equipment.isFunctionel ? (
                                                      <CheckCircleIcon color="success" />
                                                    ) : (
                                                      <CancelIcon color="error" />
                                                    )}
                                                  </div>
                                                </ListItem>
                                              </Grid>
                                            )
                                          )}
                                        </Grid>
                                      )}
                                  </div>
                                );
                              })}
                            </List>
                          )}
                          {besoinsActif.length > 0 ? (
                            <>
                              <Typography
                                variant="h6"
                                sx={{
                                  pl: 4,
                                  fontWeight: "bold",
                                  mb: 2,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                Besoins
                                <Badge
                                  badgeContent={besoinsActif.length}
                                  color="warning"
                                  sx={{ marginLeft: 2 }}
                                />
                              </Typography>
                              <Grid container spacing={2} sx={{ pl: 4 }}>
                                {besoinsActif.map((besoin) => (
                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={2.4}
                                    key={besoin._id}
                                  >
                                    <ListItem
                                      sx={{
                                        backgroundColor: "",
                                        borderRadius: "8px",
                                      }}
                                    >
                                      <ListItemText
                                        primary={`Besoin: ${besoin.besoin}`}
                                        secondary={`Quantité: ${besoin.quantite}`}
                                      />
                                    </ListItem>
                                  </Grid>
                                ))}
                              </Grid>
                            </>
                          ) : (
                            <p>Aucun besoin trouvé pour cet actif.</p>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </List>
              ) : (
                <p>Aucun actif trouvé pour cette région.</p>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
};

export default InventaireMAJ;
