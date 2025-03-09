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
import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { EditIcon } from "lucide-react";

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
  const [newName, setNewName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingActifId, setEditingActifId] = useState(null);

  // Fetch data only once on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch data in parallel using Promise.all
        const [actifsResponse, fournituresResponse, subticketsResponse] =
          await Promise.all([
            axios.get(`${apiUrl}/api/actifs`),
            axios.get(
              `${apiUrl}/api/v1/fournitureRoutes?isClosed=false&isDeleted=false`
            ),
            axios.get(`${apiUrl}/api/v1/subtickets?isClosed=false`),
          ]);

        setActifs(actifsResponse.data);

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
        setBesoins(mergedBesoins);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoize actifs by region to avoid recalculations
  const actifsByRegion = useMemo(() => {
    const result = {};
    regionsMaroc.forEach((region) => {
      result[region] = actifs.filter((actif) => actif.region === region);
    });
    return result;
  }, [actifs]);

  // Memoize besoins by actif name for quicker lookups
  const besoinsByActifName = useMemo(() => {
    const result = {};
    besoins.forEach((besoin) => {
      if (!result[besoin.name]) {
        result[besoin.name] = [];
      }
      result[besoin.name].push(besoin);
    });
    return result;
  }, [besoins]);

  // Memoize region statistics to avoid recalculation on every render
  const regionStats = useMemo(() => {
    const stats = {};

    regionsMaroc.forEach((region) => {
      const actifsInRegion = actifsByRegion[region] || [];

      let totalBesoins = 0;
      let totalNonFunctional = 0;

      actifsInRegion.forEach((actif) => {
        // Count besoins
        const actifBesoins = besoinsByActifName[actif.name] || [];
        totalBesoins += actifBesoins.length;

        // Count non-functional equipment
        if (actif.categories) {
          actif.categories.forEach((category) => {
            if (category.equipments) {
              totalNonFunctional += category.equipments.filter(
                (equipment) => !equipment.isFunctionel
              ).length;
            }
          });
        }
      });

      stats[region] = {
        totalBesoins,
        totalNonFunctional,
      };
    });

    return stats;
  }, [actifsByRegion, besoinsByActifName]);

  // Memoize non-functional counts for each actif
  const actifNonFunctionalCounts = useMemo(() => {
    const counts = {};

    actifs.forEach((actif) => {
      if (actif.categories) {
        counts[actif._id] = actif.categories.reduce(
          (count, category) =>
            count +
            (category.equipments?.filter((equipment) => !equipment.isFunctionel)
              .length || 0),
          0
        );
      } else {
        counts[actif._id] = 0;
      }
    });

    return counts;
  }, [actifs]);

  const handleRegionClick = useCallback(
    (index) => {
      setOpenRegion(openRegion === index ? false : index);
    },
    [openRegion]
  );

  const handleActifClick = useCallback(
    (actifId) => {
      setOpenActif(openActif === actifId ? null : actifId);
    },
    [openActif]
  );

  const handleCategoryClick = useCallback(
    (categoryId) => {
      setOpenCategory(openCategory === categoryId ? null : categoryId);
    },
    [openCategory]
  );

  const startEditing = useCallback((actif) => {
    setNewName(actif.name);
    setIsEditing(true);
    setEditingActifId(actif._id);
  }, []);

  const updateActifName = useCallback(() => {
    if (!newName.trim() || !editingActifId) {
      alert("Please provide a valid name.");
      return;
    }

    axios
      .put(`${apiUrl}/api/actifs/${editingActifId}`, { name: newName })
      .then(() => {
        // Update the actif state with the new name
        setActifs((prevActifs) =>
          prevActifs.map((actif) =>
            actif._id === editingActifId ? { ...actif, name: newName } : actif
          )
        );
        setNewName("");
        setIsEditing(false);
        setEditingActifId(null);
      })
      .catch((err) => {
        console.error("Error updating asset name:", err);
        alert("Failed to update asset name.");
      });
  }, [newName, editingActifId]);

  // If loading, show loading spinner centered
  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "2rem" }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2 className="pb-3 text-3xl font-extrabold leading-none tracking-tight md:text-4xl uppercase text-orange-500">
        Inventaire des actifs
      </h2>

      {regionsMaroc.map((region, index) => {
        const stats = regionStats[region] || {
          totalBesoins: 0,
          totalNonFunctional: 0,
        };
        const actifsRegion = actifsByRegion[region] || [];

        return (
          <Accordion
            key={index}
            expanded={openRegion === index}
            onChange={() => handleRegionClick(index)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <h3>{region}</h3>
                <Badge
                  badgeContent={stats.totalNonFunctional}
                  color="error"
                  sx={{ marginLeft: 2 }}
                />
                <Badge
                  badgeContent={stats.totalBesoins}
                  color="warning"
                  sx={{ marginLeft: 2, paddingLeft: 1 }}
                />
              </div>
            </AccordionSummary>
            <AccordionDetails>
              {actifsRegion.length > 0 ? (
                <List>
                  {actifsRegion.map((actif) => {
                    const actifBesoins = besoinsByActifName[actif.name] || [];
                    const nonFunctionalCount =
                      actifNonFunctionalCounts[actif._id] || 0;
                    const isCurrentlyEditing =
                      isEditing && editingActifId === actif._id;

                    return (
                      <Accordion
                        key={actif._id}
                        expanded={openActif === actif._id}
                        onChange={() => handleActifClick(actif._id)}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`panel${actif._id}-content`}
                          id={`panel${actif._id}-header`}
                        >
                          <ListItemText
                            primary={
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
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
                                    badgeContent={actifBesoins.length}
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
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent accordion toggle
                                    startEditing(actif);
                                  }}
                                />
                              </div>
                            }
                            sx={{
                              backgroundColor: "#332f2f",
                              padding: "8px",
                              borderRadius: "4px",
                              width: "100%",
                            }}
                          />
                        </AccordionSummary>
                        <AccordionDetails>
                          {isCurrentlyEditing && (
                            <div style={{ marginBottom: "15px" }}>
                              <TextField
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                label="New Asset Name"
                                variant="outlined"
                                fullWidth
                                sx={{ marginBottom: "10px" }}
                              />
                              <Button
                                onClick={updateActifName}
                                variant="contained"
                                color="primary"
                              >
                                Update Name
                              </Button>
                            </div>
                          )}

                          {actif.categories && (
                            <List sx={{ pl: 4 }}>
                              {actif.categories.map((category) => {
                                // Count non-functional equipment for this category
                                const nonFunctionalCountCategory =
                                  category.equipments?.filter(
                                    (equipment) => !equipment.isFunctionel
                                  ).length || 0;

                                return (
                                  <div key={category.id}>
                                    <ListItem
                                      button
                                      onClick={() =>
                                        handleCategoryClick(category.id)
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
                                            <div style={{ flexGrow: 1 }} />
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

                          {actifBesoins.length > 0 ? (
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
                                  badgeContent={actifBesoins.length}
                                  color="warning"
                                  sx={{ marginLeft: 2 }}
                                />
                              </Typography>
                              <Grid container spacing={2} sx={{ pl: 4 }}>
                                {actifBesoins.map((besoin) => (
                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={2.4}
                                    key={besoin.id || besoin._id}
                                  >
                                    <ListItem
                                      sx={{
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
