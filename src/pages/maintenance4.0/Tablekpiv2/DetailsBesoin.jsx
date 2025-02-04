import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
} from "@mui/material";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const DetailsBesoin = ({
  open,
  handleCloseModel,
  selectedEquipment,
  region,
  province,
  startDate,
  endDate,
}) => {
  const [relatedData, setRelatedData] = useState([]);

  useEffect(() => {
    if (open && selectedEquipment) {
      const fetchRelatedData = async () => {
        try {
          const params = new URLSearchParams({
            isClosed: "false",
            description: selectedEquipment.description, // Utilisez "description" au lieu de "besoin"
            region: region || "",
            province: province || "",
            startDate: startDate || "",
            endDate: endDate || "",
          });

          const response = await fetch(
            `${apiUrl}/api/v1/merged-data?isDeleted=false&${params.toString()}`
          );
          const data = await response.json();
          setRelatedData(data.mergedData || []); // Utilisez "mergedData" au lieu de "fournitures"
        } catch (error) {
          console.error("Erreur lors de la récupération des données :", error);
        }
      };

      fetchRelatedData();
    }
  }, [open, selectedEquipment, region, province, startDate, endDate]);

  return (
    <Dialog open={open} onClose={handleCloseModel} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#FF5A1F",
          textTransform: "uppercase",
        }}
      >
        Détails des besoins
      </DialogTitle>

      <DialogContent>
        {selectedEquipment ? (
          <>
            <Typography variant="h6" gutterBottom>
              Nom de l'équipement : {selectedEquipment.description}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Nombre des demandes : {selectedEquipment.count}
            </Typography>
          </>
        ) : (
          <Typography variant="body1" color="textSecondary">
            Aucun équipement sélectionné.
          </Typography>
        )}

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Résultats associés :
          </Typography>
          {relatedData.length > 0 ? (
            <Grid container spacing={2}>
              {relatedData.map((item) => (
                <Grid item xs={12} sm={6} key={item.id}>
                  <Card sx={{ boxShadow: 3 }}>
                    <CardContent>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Catégorie : {item.categorie}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Région : {item.region}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Province : {item.province}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Description : {item.description}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Statut : {item.status}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Commentaire : {item.commentaire || "Aucun"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Date de création :{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Aucun résultat trouvé.
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModel} variant="contained" color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailsBesoin;
