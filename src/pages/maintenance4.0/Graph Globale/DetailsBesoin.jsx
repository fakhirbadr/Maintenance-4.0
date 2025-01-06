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
            besoin: selectedEquipment.besoin,
            region: region || "", // Inclure la région si spécifiée
            province: province || "", // Inclure la province si spécifiée
            startDate: startDate || "", // Inclure la date de début si spécifiée
            endDate: endDate || "", // Inclure la date de fin si spécifiée
          });

          const response = await fetch(
            `https://backend-v1-1.onrender.com/api/v1/fournitureRoutes?${params.toString()}`
          );
          const data = await response.json();
          setRelatedData(data.fournitures || []);
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
          textAlign: "center", // Centrer le texte
          fontWeight: "bold", // Police en gras
          color: "#FF5A1F", // Couleur bleue
          textTransform: "uppercase", // Texte en majuscules
        }}
      >
        Détails des besoins
      </DialogTitle>

      <DialogContent>
        {selectedEquipment ? (
          <>
            <Typography variant="h6" gutterBottom>
              Nom de l'équipement : {selectedEquipment.besoin}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Quantité : {selectedEquipment.count}
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
                <Grid item xs={12} sm={6} key={item._id}>
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
                        Besoin : {item.besoin}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Quantité : {item.quantite}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Technicien : {item.technicien || "Non spécifié"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Statut : {item.status}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Commentaire : {item.commentaire || "Aucun"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Date de création :{" "}
                        {new Date(item.dateCreation).toLocaleDateString()}
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
