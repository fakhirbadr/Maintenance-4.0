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
const DialogListEquipmentStructure = ({
  openFour,
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
  const [selectedBesoin, setSelectedBesoin] = useState(null); // State to hold the selected 'besoin'
  const handleOpen = () => setOpenDetail(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          categorie: "Structure Bâtiment",
          region: region || "",
          province: province || "",
          startDate: startDate || "",
          endDate: endDate || "",
        });

        const response = await fetch(
          `https://backend-v1-1.onrender.com/api/v1/fournitureRoutes?${params.toString()}`
        );
        const result = await response.json();
        console.log("Données brutes de l'API:", result);

        const dispositifMedicaux =
          result.nonClosedByNeedAndCategory?.["Structure Bâtiment"] || [];
        setDataFormatted(dispositifMedicaux);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    if (open) {
      fetchData();
    }
  }, [region, province, startDate, endDate, openFour]);
  return (
    <>
      {" "}
      <Dialog
        open={openFour}
        hundleCloseFour={hundleCloseFour}
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
                  <TableCell align="right">Quantité</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataFormatted.length > 0 ? (
                  dataFormatted.map((item, index) => (
                    <TableRow
                      key={index}
                      onClick={() => {
                        console.log("Ligne cliquée:", item.besoin);
                        setSelectedEquipment(item); // Met à jour l'équipement sélectionné
                        handleOpen(); // Ouvre le modal
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
                        {item.besoin || "Non spécifié"}
                      </TableCell>
                      <TableCell align="right">
                        {item.count !== undefined ? item.count : "N/A"}
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
      {/* Pass props to DetailsBesoin to open/close */}
      <DetailsBesoin
        selectedEquipment={selectedEquipment}
        open={openDetail}
        handleCloseModel={handleCloseModel}
        region={region}
        province={province}
        startDate={startDate} // Passing startDate
        endDate={endDate} // Passing endDate
      />
    </>
  );
};

export default DialogListEquipmentStructure;
