import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import {
  Button,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Box,
  Skeleton,
} from "@mui/material";
import EquipmentDialog from "./EquipmentDialog";
import { useEffect, useState, useMemo, useCallback } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

const DocteursInventaire = () => {
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dynamicActifs, setDynamicActifs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingRows, setLoadingRows] = useState({});
  const [allUnits, setAllUnits] = useState([]);
  const [statisticsDialogOpen, setStatisticsDialogOpen] = useState(false);
  const [statisticsByDate, setStatisticsByDate] = useState([]);

  // Fetch all necessary data in one go
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [actifsResponse, inventoryResponse] = await Promise.all([
        axios.get(`${apiUrl}/api/actifs`),
        axios.get(
          `${apiUrl}/api/v1/inventaire/actifsInventaire?selectedUnite=${dynamicActifs.join(
            ","
          )}`
        ),
      ]);

      const allUnits = actifsResponse.data.map((unit) => unit.name);
      const allInventoryData = inventoryResponse.data;

      setAllUnits(allUnits);
      setData(allInventoryData);

      // Group by week and calculate statistics
      const groupedData = groupInventoriesByWeek(allInventoryData);
      const stats = calculateStatisticsByWeek(groupedData, allUnits);
      setStatisticsByDate(stats);
    } catch (error) {
      console.error("Erreur lors de la récupération des données", error);
    } finally {
      setIsLoading(false);
    }
  }, [dynamicActifs]);

  useEffect(() => {
    const fetchActifNames = async () => {
      const cachedNames = localStorage.getItem("cachedActifNames");
      const cachedData = localStorage.getItem("cachedActifData"); // Nouveau cache

      if (cachedNames && cachedData) {
        setDynamicActifs(JSON.parse(cachedNames));
        // Pas besoin de setter pour les données complètes ici
      } else {
        const userIds = JSON.parse(localStorage.getItem("userActifs"));
        if (userIds && Array.isArray(userIds)) {
          try {
            const responses = await Promise.all(
              userIds.map((id) => axios.get(`${apiUrl}/api/actifs/${id}`))
            );

            const fetchedNames = responses.map(
              (response) => response.data.name
            );
            const fetchedData = responses.map((response) => response.data); // Nouvelles données

            localStorage.setItem(
              "cachedActifNames",
              JSON.stringify(fetchedNames)
            );
            localStorage.setItem(
              "cachedActifData",
              JSON.stringify(fetchedData)
            ); // Stockage des données complètes

            setDynamicActifs(fetchedNames);
          } catch (error) {
            console.error("Erreur lors de la récupération des actifs", error);
          }
        }
      }
    };

    fetchActifNames();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (dynamicActifs.length > 0) {
        await fetchAllData();
        // Rafraîchir le cache après mise à jour
        const actifsResponse = await axios.get(`${apiUrl}/api/actifs`);
        localStorage.setItem(
          "cachedActifData",
          JSON.stringify(actifsResponse.data)
        );
      }
    };
    fetchData();
  }, [dynamicActifs, fetchAllData]);

  const normalizeUnitName = (name) => {
    return name.trim().toLowerCase();
  };

  const groupInventoriesByWeek = (data) => {
    const groupedData = {};

    data.forEach((item) => {
      const date = new Date(item.date);
      const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
      const diff = day === 0 ? 6 : day - 1;
      const monday = new Date(date);
      monday.setDate(date.getDate() - diff);
      monday.setHours(0, 0, 0, 0);

      const weekKey = monday.toISOString().split("T")[0];

      if (!groupedData[weekKey]) {
        groupedData[weekKey] = new Set();
      }
      groupedData[weekKey].add(normalizeUnitName(item.selectedUnite));
    });

    return groupedData;
  };

  const calculateStatisticsByWeek = (groupedData, allUnits) => {
    const statistics = [];
    const normalizedAllUnits = allUnits.map((unit) => normalizeUnitName(unit));
    const cachedActifData = JSON.parse(localStorage.getItem("cachedActifData"));

    // Créer un objet pour mapper les noms d'unités à leurs régions
    const unitToRegionMap = {};
    if (cachedActifData && Array.isArray(cachedActifData)) {
      cachedActifData.forEach((unit) => {
        unitToRegionMap[normalizeUnitName(unit.name)] = unit.region;
      });
    }

    Object.keys(groupedData).forEach((weekStart) => {
      const unitsWithInventory = groupedData[weekStart];
      const unitsWithoutInventory = normalizedAllUnits.filter(
        (unit) => !unitsWithInventory.has(unit)
      );

      const startDate = new Date(weekStart);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      // Ajouter la région aux unités avec et sans inventaire
      const unitsWithInventoryData = Array.from(unitsWithInventory).map(
        (unit) => ({
          name: unit,
          region: unitToRegionMap[unit] || "Région inconnue",
        })
      );

      const unitsWithoutInventoryData = unitsWithoutInventory.map((unit) => ({
        name: unit,
        region: unitToRegionMap[unit] || "Région inconnue",
      }));

      statistics.push({
        startDate: weekStart,
        endDate: endDate.toISOString().split("T")[0],
        unitsWithInventory: unitsWithInventoryData,
        unitsWithoutInventory: unitsWithoutInventoryData,
      });
    });

    return statistics;
  };
  const getUnitsByRegion = () => {
    const cachedActifData = JSON.parse(localStorage.getItem("cachedActifData"));
    const unitsByRegion = {};

    if (cachedActifData && Array.isArray(cachedActifData)) {
      cachedActifData.forEach((unit) => {
        const region = unit.region || "Région non spécifiée"; // Fallback pour sécurité
        if (!unitsByRegion[region]) {
          unitsByRegion[region] = [];
        }
        unitsByRegion[region].push(unit.name);
      });
    }

    return unitsByRegion;
  };

  const handleOpenStatisticsDialog = () => {
    setStatisticsDialogOpen(true);
  };

  const formatWeekRange = (startDateStr, endDateStr) => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const options = { month: "short", day: "numeric" };
    return `${startDate.toLocaleDateString(
      "fr-FR",
      options
    )} - ${endDate.toLocaleDateString(
      "fr-FR",
      options
    )} ${startDate.getFullYear()}`;
  };

  const handleCloseStatisticsDialog = () => {
    setStatisticsDialogOpen(false);
  };

  const rows = useMemo(() => {
    return data.map((item) => ({
      id: item._id,
      date: new Date(item.date).toLocaleDateString(),
      technicien: item.technicien,
      unite: item.selectedUnite,
      action: item.equipment
        ? Object.keys(item.equipment).map((key) => ({
            name: key,
            quantite: item.equipment[key].quantite || "Inconnu",
            fonctionnel: item.equipment[key].fonctionnel || "Inconnu",
          }))
        : [],
      validation: item.validation,
    }));
  }, [data]);

  const sortedRows = useMemo(() => {
    return rows.sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return a.unite.localeCompare(b.unite);
    });
  }, [rows]);

  const handleOpenDialog = useCallback((item) => {
    setSelectedItem(item.action);
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setSelectedItem(null);
  }, []);
  // const groupByRegion = (unitsWithInventory, unitsWithoutInventory) => {
  //   const cachedActifData = JSON.parse(localStorage.getItem("cachedActifData"));
  //   const groupedByRegion = {};

  //   // Créer un objet pour mapper les noms d'unités à leurs régions
  //   const unitToRegionMap = {};
  //   if (cachedActifData && Array.isArray(cachedActifData)) {
  //     cachedActifData.forEach((unit) => {
  //       unitToRegionMap[normalizeUnitName(unit.name)] = unit.region;
  //     });
  //   }

  //   // Grouper les unités avec inventaire par région
  //   unitsWithInventory.forEach((unit) => {
  //     const region = unitToRegionMap[unit] || "Région inconnue";
  //     if (!groupedByRegion[region]) {
  //       groupedByRegion[region] = { withInventory: [], withoutInventory: [] };
  //     }
  //     groupedByRegion[region].withInventory.push(unit);
  //   });

  //   // Grouper les unités sans inventaire par région
  //   unitsWithoutInventory.forEach((unit) => {
  //     const region = unitToRegionMap[unit] || "Région inconnue";
  //     if (!groupedByRegion[region]) {
  //       groupedByRegion[region] = { withInventory: [], withoutInventory: [] };
  //     }
  //     groupedByRegion[region].withoutInventory.push(unit);
  //   });

  //   return groupedByRegion;
  // };
  const groupByRegion = (units) => {
    return units.reduce((acc, unit) => {
      const region = unit.region;
      if (!acc[region]) {
        acc[region] = [];
      }
      acc[region].push(unit);
      return acc;
    }, {});
  };

  const handleValidation = useCallback(async (id) => {
    setLoadingRows((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.patch(`${apiUrl}/api/v1/inventaire/actifsInventaire/${id}`, {
        validation: true,
      });
      setData((prevData) =>
        prevData.map((item) =>
          item._id === id ? { ...item, validation: true } : item
        )
      );
    } catch (error) {
      console.error("Erreur lors de la validation !", error);
    } finally {
      setLoadingRows((prev) => ({ ...prev, [id]: false }));
    }
  }, []);

  return (
    <>
      <div className="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl uppercase text-orange-500">
        Inventaire hebdomadaire
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenStatisticsDialog}
        style={{ marginBottom: 20 }}
      >
        Statistiques
      </Button>
      {isLoading && (
        <div style={{ display: "flex", justifyContent: "center", margin: 20 }}>
          <Typography variant="body1" style={{ marginLeft: 10 }}>
            <Skeleton width={800} height={400} />
          </Typography>
        </div>
      )}
      {!isLoading && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="tableau dense">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Technicien</TableCell>
                <TableCell align="right">Unité</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    backgroundColor: row.validation ? "green" : "transparent",
                    color: row.validation ? "white" : "inherit",
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.date}
                  </TableCell>
                  <TableCell align="right">{row.technicien}</TableCell>
                  <TableCell align="right">{row.unite}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleOpenDialog(row)}
                    >
                      Voir
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleValidation(row.id)}
                      disabled={row.validation || loadingRows[row.id]}
                      sx={{ marginLeft: 1 }}
                    >
                      {loadingRows[row.id] ? "Validation..." : "Valider"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <EquipmentDialog
        open={openDialog}
        onClose={handleCloseDialog}
        equipmentData={selectedItem}
      />
      <Dialog
        open={statisticsDialogOpen}
        onClose={handleCloseStatisticsDialog}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle
          sx={{ bgcolor: "primary.main", color: "white", textAlign: "center" }}
        >
          Statistiques par Semaine
        </DialogTitle>
        <DialogContent>
          {statisticsByDate
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate)) // Tri par ordre décroissant
            .map((weekStats) => {
              const unitsWithoutInventoryByRegion = groupByRegion(
                weekStats.unitsWithoutInventory
              );
              const unitsWithInventoryByRegion = groupByRegion(
                weekStats.unitsWithInventory
              );

              // Étape 1 : Extraire toutes les régions
              const allRegions = [
                ...new Set([
                  ...Object.keys(unitsWithoutInventoryByRegion),
                  ...Object.keys(unitsWithInventoryByRegion),
                ]),
              ];

              // Étape 2 : Trier les régions par ordre alphabétique
              const sortedRegions = allRegions.sort((a, b) =>
                a.localeCompare(b)
              );

              return (
                <Box
                  key={weekStats.startDate}
                  sx={{
                    mb: 3,
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    bgcolor: "background.paper",
                    boxShadow: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
                  >
                    Semaine du{" "}
                    {formatWeekRange(weekStats.startDate, weekStats.endDate)}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          p: 2,
                          borderRight: "1px solid #e0e0e0",
                          height: "100%",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            color: "error.main",
                            fontWeight: "bold",
                            mb: 1,
                          }}
                        >
                          Unités sans inventaire
                        </Typography>
                        {sortedRegions.map((region) => (
                          <Box key={region} sx={{ mb: 2 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: "bold",
                                color: "text.primary",
                                mb: 1,
                              }}
                            >
                              {region}{" "}
                              <span style={{ color: "", fontSize: "0.8rem" }}>
                                (
                                {
                                  (unitsWithoutInventoryByRegion[region] || [])
                                    .length
                                }{" "}
                                unités)
                              </span>
                            </Typography>
                            <Grid container spacing={1}>
                              {(
                                unitsWithoutInventoryByRegion[region] || []
                              ).map((unit, index) => (
                                <Grid item key={index} xs={4}>
                                  <Box
                                    sx={{
                                      display: "block",
                                      p: 1,
                                      m: 0.5,
                                      border: "1px solid rgba(0, 0, 0, 0.1)",
                                      borderRadius: 1,
                                      bgcolor: "rgba(255, 51, 51, 0.2)", // Rouge clair pour les unités sans inventaire
                                      opacity: 0.8,
                                      transition:
                                        "transform 0.2s, box-shadow 0.2s",
                                      "&:hover": {
                                        transform: "scale(1.02)",
                                        boxShadow:
                                          "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                      },
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      sx={{ color: "text.secondary" }}
                                    >
                                      {unit.name}
                                    </Typography>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        ))}
                        {weekStats.unitsWithoutInventory.length === 0 && (
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            Aucune unité sans inventaire
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ p: 2 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "success.main",
                            fontWeight: "bold",
                            mb: 1,
                          }}
                        >
                          Unités avec inventaire
                        </Typography>
                        {sortedRegions.map((region) => (
                          <Box key={region} sx={{ mb: 2 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: "bold",
                                color: "text.primary",
                                mb: 1,
                              }}
                            >
                              {region}{" "}
                              <span style={{ color: "", fontSize: "0.8rem" }}>
                                (
                                {
                                  (unitsWithInventoryByRegion[region] || [])
                                    .length
                                }{" "}
                                unités)
                              </span>
                            </Typography>
                            <Grid container spacing={1}>
                              {(unitsWithInventoryByRegion[region] || []).map(
                                (unit, index) => (
                                  <Grid item key={index} xs={4}>
                                    <Box
                                      sx={{
                                        display: "block",
                                        p: 1,
                                        m: 0.5,
                                        border: "1px solid rgba(0, 0, 0, 0.1)",
                                        borderRadius: 1,
                                        bgcolor: "rgba(133, 255, 214, 0.2)", // Vert clair pour les unités avec inventaire
                                        opacity: 0.8,
                                        transition:
                                          "transform 0.2s, box-shadow 0.2s",
                                        "&:hover": {
                                          transform: "scale(1.02)",
                                          boxShadow:
                                            "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                        },
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{ color: "text.secondary" }}
                                      >
                                        {unit.name}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                )
                              )}
                            </Grid>
                          </Box>
                        ))}
                        {weekStats.unitsWithInventory.length === 0 && (
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            Aucune unité avec inventaire
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              );
            })}
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: "background.default" }}>
          <Button
            onClick={handleCloseStatisticsDialog}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2 }}
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DocteursInventaire;
