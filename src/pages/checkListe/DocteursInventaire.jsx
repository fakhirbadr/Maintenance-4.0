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
import { Button } from "@mui/material";
import EquipmentDialog from "./EquipmentDialog";
import { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

const DocteursInventaire = () => {
  const [data, setData] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [dynamicActifs, setDynamicActifs] = useState([]);

  useEffect(() => {
    const userIds = JSON.parse(localStorage.getItem("userActifs"));
    if (userIds && Array.isArray(userIds)) {
      setDynamicActifs(userIds);

      // Récupérer les noms des actifs en fonction de leurs IDs
      const fetchActifNames = async () => {
        const fetchedNames = [];
        for (const id of userIds) {
          try {
            const response = await axios.get(`${apiUrl}/api/actifs/${id}`);
            if (response.data && response.data.name) {
              fetchedNames.push(response.data.name);
            }
          } catch (error) {
            console.error(
              `Erreur lors de la récupération de l'actif avec l'id ${id}`,
              error
            );
          }
        }
        console.log("Noms des actifs :", fetchedNames);
        setDynamicActifs(fetchedNames);
      };

      fetchActifNames();
    }
  }, []);

  // Récupération des données filtrées par noms depuis l'API
  useEffect(() => {
    if (dynamicActifs.length > 0) {
      const urlWithNames = `${apiUrl}/api/v1/inventaire/actifsInventaire?selectedUnite=${dynamicActifs.join(
        ","
      )}`;
      console.log("URL avec les noms des actifs :", urlWithNames);

      axios
        .get(urlWithNames)
        .then((response) => {
          console.log("Données récupérées de l'API :", response.data);
          setData(response.data);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des données !", error);
        });
    }
  }, [dynamicActifs]);

  // Transformation des données pour correspondre à la structure du tableau
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

  // Tri des lignes par date puis par unité
  const sortedRows = rows.sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return a.unite.localeCompare(b.unite);
  });

  const handleOpenDialog = (item) => {
    setSelectedItem(item.action); // Passez uniquement les équipements au dialogue
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleValidation = (id) => {
    axios
      .patch(`${apiUrl}/api/v1/inventaire/actifsInventaire/${id}`, {
        validation: true,
      })
      .then(() => {
        setData((prevData) =>
          prevData.map((item) =>
            item._id === id ? { ...item, validation: true } : item
          )
        );
      })
      .catch((error) => {
        console.error("Erreur lors de la validation !", error);
      });
  };

  return (
    <>
      <div className="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl uppercase text-orange-500">
        Inventaire hebdomadaire
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="tableau dense">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="right">Technicien</TableCell>
              <TableCell align="right">Unité</TableCell>
              <TableCell align="right">Action</TableCell>
              {/* <TableCell align="right">Validation</TableCell> */}
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
                {/* <TableCell align="right">
                  {row.action.length > 0
                    ? row.action.map((equip) => equip.name).join(", ")
                    : "Aucun équipement"}
                </TableCell> */}
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
                    disabled={row.validation}
                    sx={{ marginLeft: 1 }}
                  >
                    Valider
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
