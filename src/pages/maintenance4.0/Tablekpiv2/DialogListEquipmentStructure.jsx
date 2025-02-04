import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
} from "@mui/material";
import DetailsBesoin from "./DetailsBesoin";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const DialogListEquipmentStructure = ({
  openFour,
  categorie,
  hundleCloseFour,
  region,
  province,
  startDate,
  endDate,
}) => {
  const [openDetail, setOpenDetail] = useState(false);
  const handleCloseModel = () => setOpenDetail(false);

  const [dataFormatted, setDataFormatted] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          isDeleted: "false",
          isClosed: "false",
          categorie: categorie || "",
          region: region || "",
          province: province || "",
          startDate: startDate || "",
          endDate: endDate || "",
        });

        const url = `${apiUrl}/api/v1/merged-data?${params.toString()}`;
        const response = await fetch(url);
        const result = await response.json();

        // Grouper les données par "description" et compter les occurrences
        const groupedData = result.mergedData.reduce((acc, item) => {
          const description = item.description || "Non spécifié";
          if (!acc[description]) {
            acc[description] = { ...item, count: 0 }; // Ajouter la propriété "count"
          }
          acc[description].count += 1; // Incrémenter le compteur
          return acc;
        }, {});

        // Convertir l'objet en tableau
        const formattedData = Object.values(groupedData);
        setDataFormatted(formattedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    if (openFour) {
      fetchData();
    }
  }, [openFour, categorie, region, province, startDate, endDate]);

  return (
    <>
      <Dialog
        open={openFour}
        onClose={hundleCloseFour}
        PaperProps={{
          sx: {
            maxWidth: "50%",
            maxHeight: "60%",
            width: "100%",
            height: "100%",
          },
        }}
      >
        <DialogContent dividers>
          <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
            <Table
              sx={{ minWidth: 650 }}
              size="small"
              aria-label="equipment table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell align="right">Nombre des demandes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataFormatted.length > 0 ? (
                  dataFormatted.map((item, index) => (
                    <TableRow
                      key={index}
                      onClick={() => {
                        setSelectedEquipment(item);
                        setOpenDetail(true);
                      }}
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: "action.hover",
                        },
                        "&:hover": {
                          backgroundColor: "primary.light",
                          "& *": { color: "black" },
                        },
                        cursor: "pointer",
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {item.description}
                      </TableCell>
                      <TableCell align="right">
                        {item.count} {/* Affiche le nombre de demandes */}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      Pas de données disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={hundleCloseFour} variant="contained" color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      <DetailsBesoin
        selectedEquipment={selectedEquipment}
        open={openDetail}
        handleCloseModel={handleCloseModel}
        region={region}
        province={province}
        startDate={startDate}
        endDate={endDate}
      />
    </>
  );
};

export default DialogListEquipmentStructure;
