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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Button,
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

// Vérifie si au moins un équipement est présent dans un inventaire
function hasAtLeastOneEquipmentPresent(inventaire) {
  if (!inventaire.equipment) return false;
  return Object.values(inventaire.equipment).some(
    (eq) => eq.presence === true
  );
}

const DocteursInventaire = () => {
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingRows, setLoadingRows] = useState({});
  const [statisticsDialogOpen, setStatisticsDialogOpen] = useState(false);
  const [statisticsByDate, setStatisticsByDate] = useState([]);
  const [allUnits, setAllUnits] = useState([]);

  useEffect(() => {
    const loadInventaires = async () => {
      setIsLoading(true);
      try {
        const resp = await axios.get(
          `${apiUrl}/api/v1/inventaire/actifsInventaire`
        );
        setData(resp.data);
        // Récupère toutes les unités distinctes présentes dans l'inventaire
        const units = Array.from(
          new Set(resp.data.map((d) => d.selectedUnite).filter(Boolean))
        );
        setAllUnits(units);
        // Calcul stats
        const groupedData = groupInventoriesByWeek(resp.data);
        const stats = calculateStatisticsByWeek(groupedData, units, resp.data);
        setStatisticsByDate(stats);
      } catch (e) {
        console.error("[ERROR] Impossible de charger les inventaires:", e);
        setData([]);
        setAllUnits([]);
        setStatisticsByDate([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadInventaires();
  }, []);

  // ----------- Statistiques -----------
  function normalizeUnitName(name) {
    return name?.trim().toLowerCase() || "";
  }

  function groupInventoriesByWeek(data) {
    const groupedData = {};
    data.forEach((item) => {
      const date = new Date(item.date);
      const day = date.getDay();
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
  }

  function calculateStatisticsByWeek(groupedData, allUnits, rawData) {
    const statistics = [];
    const normalizedAllUnits = allUnits.map((unit) => normalizeUnitName(unit));
    Object.keys(groupedData).forEach((weekStart) => {
      // Pour chaque unité, récupérer les inventaires de la semaine
      const weekInventaires = rawData.filter((item) => {
        const date = new Date(item.date);
        const day = date.getDay();
        const diff = day === 0 ? 6 : day - 1;
        const monday = new Date(date);
        monday.setDate(date.getDate() - diff);
        monday.setHours(0, 0, 0, 0);
        return monday.toISOString().split("T")[0] === weekStart;
      });
      
      // Unités ayant réalisé l'inventaire
      const unitsWithInventory = Array.from(
  new Set(weekInventaires.map(inv => normalizeUnitName(inv.selectedUnite)))
).map(name => ({ name }));

      // Unités sans inventaire
      const unitsWithoutInventory = normalizedAllUnits.filter(
        unit => !unitsWithInventory.some(u => u.name === unit)
      ).map(name => ({ name }));

      const startDate = new Date(weekStart);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      statistics.push({
        startDate: weekStart,
        endDate: endDate.toISOString().split("T")[0],
        unitsWithInventory,    // Unités ayant fait l'inventaire
        unitsWithoutInventory, // Unités n'ayant pas fait l'inventaire
      });
    });
    return statistics;
  }

  function groupByRegion(units) {
    // Ici il n'y a pas de région, donc on regroupe tout dans "Toutes"
    return { Toutes: units };
  }

  // ----------- Excel Export -----------
  const handleExportExcel = () => {
    const lastFourWeeks = [...statisticsByDate]
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      .slice(0, 4);

    // mapping unit name -> display name
    const allUnitsSet = new Set(allUnits.map(normalizeUnitName));
    const weekHeaders = lastFourWeeks.map((week) =>
      formatWeekLabel(week.startDate, week.endDate)
    );

    const dataExcel = Array.from(allUnitsSet).map((unitName) => {
      const weekStatus = lastFourWeeks.map((week) => {
        const hasInventory = week.unitsWithInventory.some(
          (u) => normalizeUnitName(u.name) === unitName
        );
        return hasInventory ? "Fait" : "Non fait";
      });
      
      const doneCount = weekStatus.filter((s) => s === "Fait").length;
      const percentage = (doneCount / lastFourWeeks.length) * 100;
      
      const weekData = lastFourWeeks.reduce((acc, week, index) => {
        acc[weekHeaders[index]] = weekStatus[index];
        return acc;
      }, {});
      
      return {
        Unité: unitName,
        ...weekData,
        "Taux de réalisation": `${percentage.toFixed(0)}%`,
      };
    });

    dataExcel.sort((a, b) => a.Unité.localeCompare(b.Unité));

    const worksheet = XLSX.utils.json_to_sheet(dataExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Statistiques");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "statistiques_inventaire.xlsx");
  };

  function formatWeekRange(startDateStr, endDateStr) {
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
  }

  function formatWeekLabel(startDateStr, endDateStr) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const startDay = startDate.getDate().toString().padStart(2, "0");
    const endDay = endDate.getDate().toString().padStart(2, "0");
    const endMonth = (endDate.getMonth() + 1).toString().padStart(2, "0");
    const year = endDate.getFullYear();
    return `${startDay}-${endDay}/${endMonth}/${year}`;
  }

  // ----------- Tableau principal -----------
  const rows = useMemo(() => {
    const mapped = data.map((item) => ({
      id: item._id,
      date: new Date(item.date),
      dateString: new Date(item.date).toLocaleDateString(),
      technicien: item.technicien,
      unite: item.selectedUnite,
      action: item.equipment
        ? Object.entries(item.equipment).map(([key, val]) => ({
            name: key,
            quantite: val.presence === false ? 0 : val.quantite ?? "Inconnu",
            // CORRECTION : Vérifier d'abord la présence avec un statut dédié
            statut: val.presence === false 
              ? "Non Disponible"  // Nouveau statut pour les équipements absents
              : val.fonctionnel === "Oui"
              ? "Fonctionnel"     // Si présent et fonctionnel = "Oui"
              : val.fonctionnel === "Non"
              ? "Défectueux"      // Si présent et fonctionnel = "Non"
              : "Inconnu",        // Si présent mais fonctionnel non défini
            presence: val.presence,
            fonctionnel: val.fonctionnel,
          }))
        : [],
      validation: item.validation,
    }));
    return mapped;
  }, [data]);

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => b.date - a.date);
  }, [rows]);

  const handleOpenDialog = useCallback((item) => {
    setSelectedItem(item.action);
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setSelectedItem(null);
  }, []);

  const handleOpenStatisticsDialog = () => {
    setStatisticsDialogOpen(true);
  };

  const handleCloseStatisticsDialog = () => {
    setStatisticsDialogOpen(false);
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
      console.error("[ERROR] Erreur lors de la validation !", error);
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
      <Button
        variant="contained"
        color="secondary"
        onClick={handleExportExcel}
        style={{ marginBottom: 20, marginLeft: 10 }}
      >
        Exporter en Excel
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
                    {row.dateString}
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

      {/* --------- Statistiques Dialog --------- */}
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
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
            .map((weekStats) => {
              const unitsWithoutInventoryByRegion = groupByRegion(
                weekStats.unitsWithoutInventory
              );
              const unitsWithInventoryByRegion = groupByRegion(
                weekStats.unitsWithInventory
              );
              
              const allRegions = [
                ...new Set([
                  ...Object.keys(unitsWithoutInventoryByRegion),
                  ...Object.keys(unitsWithInventoryByRegion),
                ]),
              ];
              
              const sortedRegions = allRegions.sort((a, b) => a.localeCompare(b));
              
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
                    {/* Colonne: Unités sans inventaire */}
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, borderRight: "1px solid #e0e0e0", height: "100%" }}>
                        <Typography
                          variant="body1"
                          sx={{ color: "error.main", fontWeight: "bold", mb: 1 }}
                        >
                          Unités sans inventaire
                        </Typography>
                        {sortedRegions.map((region) => (
                          <Box key={region} sx={{ mb: 2 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold", color: "text.primary", mb: 1 }}
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
                                <Grid item key={index} xs={12}>
                                  <Box
                                    sx={{
                                      display: "block",
                                      p: 1,
                                      m: 0.5,
                                      border: "1px solid rgba(0, 0, 0, 0.1)",
                                      borderRadius: 1,
                                      bgcolor: "rgba(255, 51, 51, 0.2)",
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
                            Toutes les unités ont fait l'inventaire
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    
                    {/* Colonne: Unités avec inventaire */}
                    <Grid item xs={6}>
                      <Box sx={{ p: 2 }}>
                        <Typography
                          variant="body1"
                          sx={{ color: "success.main", fontWeight: "bold", mb: 1 }}
                        >
                          Unités avec inventaire
                        </Typography>
                        {sortedRegions.map((region) => (
                          <Box key={region} sx={{ mb: 2 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold", color: "text.primary", mb: 1 }}
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
                                  <Grid item key={index} xs={12}>
                                    <Box
                                      sx={{
                                        display: "block",
                                        p: 1,
                                        m: 0.5,
                                        border: "1px solid rgba(0, 0, 0, 0.1)",
                                        borderRadius: 1,
                                        bgcolor: "rgba(133, 255, 214, 0.2)",
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
                            Aucune unité n'a fait l'inventaire
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