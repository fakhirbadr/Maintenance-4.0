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
} from "@mui/material";
import EquipmentDialog from "./EquipmentDialog";
import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

const DocteursInventaire = () => {
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dynamicActifs, setDynamicActifs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingRows, setLoadingRows] = useState({});
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [allUnits, setAllUnits] = useState([]);
  const [statisticsDialogOpen, setStatisticsDialogOpen] = useState(false);
  const [statisticsByDate, setStatisticsByDate] = useState([]);

  useEffect(() => {
    const fetchActifNames = async () => {
      const cachedNames = localStorage.getItem("cachedActifNames");
      if (cachedNames) {
        setDynamicActifs(JSON.parse(cachedNames));
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
            localStorage.setItem(
              "cachedActifNames",
              JSON.stringify(fetchedNames)
            );
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
    if (dynamicActifs.length > 0) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const url = `${apiUrl}/api/v1/inventaire/actifsInventaire?selectedUnite=${dynamicActifs.join(
            ","
          )}&page=${page}&limit=${rowsPerPage}`;
          const response = await axios.get(url);
          setData(response.data);
        } catch (error) {
          console.error("Erreur lors de la récupération des données !", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [dynamicActifs, page, rowsPerPage]);

  const fetchAllUnits = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/actifs");
      setAllUnits(response.data.map((unit) => unit.name));
    } catch (error) {
      console.error("Erreur lors de la récupération des unités", error);
    }
  };

  const normalizeUnitName = (name) => {
    return name.trim().toLowerCase();
  };

  const groupInventoriesByDate = (data) => {
    const groupedData = {};

    data.forEach((item) => {
      const date = new Date(item.date).toISOString().split("T")[0]; // Format YYYY-MM-DD
      if (!groupedData[date]) {
        groupedData[date] = new Set();
      }
      groupedData[date].add(normalizeUnitName(item.selectedUnite));
    });

    return groupedData;
  };

  const calculateStatisticsByDate = (groupedData, allUnits) => {
    const statistics = [];

    // Normaliser la liste complète des unités
    const normalizedAllUnits = allUnits.map((unit) => normalizeUnitName(unit));

    Object.keys(groupedData).forEach((date) => {
      const unitsWithInventory = groupedData[date];
      const unitsWithoutInventory = normalizedAllUnits.filter(
        (unit) => !unitsWithInventory.has(unit)
      );

      statistics.push({
        date,
        unitsWithInventory: Array.from(unitsWithInventory),
        unitsWithoutInventory,
      });
    });

    return statistics;
  };

  const handleOpenStatisticsDialog = () => {
    fetchAllUnits();
    const groupedData = groupInventoriesByDate(data);
    const stats = calculateStatisticsByDate(groupedData, allUnits);
    setStatisticsByDate(stats);
    setStatisticsDialogOpen(true);
  };

  const handleCloseStatisticsDialog = () => {
    setStatisticsDialogOpen(false);
  };

  const rows = data.map((item) => ({
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

  const sortedRows = rows.sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return a.unite.localeCompare(b.unite);
  });

  const handleOpenDialog = (item) => {
    setSelectedItem(item.action);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleValidation = async (id) => {
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
  };

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
          <CircularProgress />
          <Typography variant="body1" style={{ marginLeft: 10 }}>
            Chargement en cours...
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
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Statistiques des inventaires par date</DialogTitle>
        <DialogContent>
          {statisticsByDate.map((stat, index) => (
            <Box
              key={index}
              sx={{
                marginBottom: 4,
                borderBottom: "1px solid #ccc",
                paddingBottom: 2,
              }}
            >
              {/* Titre de date centré en haut */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  mb: 2,
                  textTransform: "uppercase",
                }}
              >
                {stat.date}
              </Typography>

              <Grid container spacing={2}>
                {/* Colonne de gauche */}
                <Grid item xs={6}>
                  <Typography
                    variant="h6" // Augmentation de la taille
                    sx={{
                      color: "whait", // Changement en noir
                      fontWeight: "bold",
                      mb: 1, // Marge sous le titre
                    }}
                  >
                    Unités ayant fait l'inventaire : ✅
                  </Typography>
                  <ul style={{ listStyleType: "none", padding: 0 }}>
                    {stat.unitsWithInventory.map((unit, idx) => (
                      <li
                        key={idx}
                        style={{
                          color: "#a6ff4d",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          fontSize: "1rem", // Taille légèrement réduite
                        }}
                      >
                        {unit}
                      </li>
                    ))}
                  </ul>
                </Grid>

                {/* Colonne de droite */}
                <Grid item xs={6}>
                  <Typography
                    variant="h6" // Augmentation de la taille
                    sx={{
                      color: "whait", // Changement en noir
                      fontWeight: "bold",
                      mb: 1, // Marge sous le titre
                    }}
                  >
                    Unités n'ayant pas fait l'inventaire : ❌
                  </Typography>
                  <ul style={{ listStyleType: "none", padding: 0 }}>
                    {stat.unitsWithoutInventory.map((unit, idx) => (
                      <li
                        key={idx}
                        style={{
                          color: "#ff80b3",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          fontSize: "1rem", // Taille légèrement réduite
                        }}
                      >
                        {unit}
                      </li>
                    ))}
                  </ul>
                </Grid>
              </Grid>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatisticsDialog} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DocteursInventaire;
