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
import { Button, CircularProgress, Typography } from "@mui/material";
import EquipmentDialog from "./EquipmentDialog";
import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

const DocteursInventaire = () => {
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dynamicActifs, setDynamicActifs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingRows, setLoadingRows] = useState({}); // État pour le chargement par ligne
  const [page, setPage] = useState(1); // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10); // Nombre de lignes par page

  // Récupérer les noms des actifs depuis le cache ou l'API
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

  // Récupérer les données paginées depuis l'API
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

  // Transformer les données pour le tableau
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

  // Trier les lignes par date puis par unité
  const sortedRows = rows.sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return a.unite.localeCompare(b.unite);
  });

  // Gérer l'ouverture du dialogue
  const handleOpenDialog = (item) => {
    setSelectedItem(item.action);
    setOpenDialog(true);
  };

  // Gérer la fermeture du dialogue
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  // Gérer la validation d'une ligne
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
      {/* Indicateur de chargement global */}
      {isLoading && (
        <div style={{ display: "flex", justifyContent: "center", margin: 20 }}>
          <CircularProgress />
          <Typography variant="body1" style={{ marginLeft: 10 }}>
            Chargement en cours...
          </Typography>
        </div>
      )}
      {/* Tableau de données */}
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
      {/* Pagination
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <Button
          variant="outlined"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Précédent
        </Button>
        <Typography variant="body1" style={{ margin: "0 20px" }}>
          Page {page}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={data.length < rowsPerPage}
        >
          Suivant
        </Button>
      </div> */}
      {/* Dialogue d'équipement */}
      <EquipmentDialog
        open={openDialog}
        onClose={handleCloseDialog}
        equipmentData={selectedItem}
      />
    </>
  );
};

export default DocteursInventaire;
