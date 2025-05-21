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
  Fade,
  Stack,
  Divider,
  ThemeProvider,
  createTheme,
  CssBaseline,
  useTheme,
  CircularProgress,
} from "@mui/material";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

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
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (open && selectedEquipment) {
      const fetchRelatedData = async () => {
        setLoading(true);
        try {
          const params = new URLSearchParams({
            isClosed: "false",
            description: selectedEquipment.description,
            region: region || "",
            province: province || "",
            startDate: startDate || "",
            endDate: endDate || "",
          });

          const response = await fetch(
            `${apiUrl}/api/v1/merged-data?isDeleted=false&${params.toString()}`
          );
          const data = await response.json();
          setRelatedData(data.mergedData || []);
        } catch (error) {
          console.error("Erreur lors de la récupération des données :", error);
        }
        setLoading(false);
      };

      fetchRelatedData();
    }
  }, [open, selectedEquipment, region, province, startDate, endDate]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Dialog open={open} onClose={handleCloseModel} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: theme.palette.primary.main,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            bgcolor: "background.paper",
          }}
        >
          Détails des besoins
        </DialogTitle>

        <DialogContent sx={{ bgcolor: "background.paper" }}>
          {selectedEquipment ? (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              alignItems="center"
              justifyContent="space-between"
              sx={{
                borderRadius: 2,
                p: 2,
                mb: 1,
                boxShadow: 1,
                bgcolor: "background.default",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  minWidth: 250,
                }}
              >
                Nom de l'équipement :{" "}
                <span
                  style={{ fontWeight: 400, color: theme.palette.text.primary }}
                >
                  {selectedEquipment.description}
                </span>
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 500, color: theme.palette.text.secondary }}
              >
                Nombre des demandes :{" "}
                <span
                  style={{ fontWeight: 400, color: theme.palette.text.primary }}
                >
                  {selectedEquipment.count}
                </span>
              </Typography>
            </Stack>
          ) : (
            <Typography variant="body1" color="textSecondary">
              Aucun équipement sélectionné.
            </Typography>
          )}

          <Divider sx={{ my: 3, bgcolor: theme.palette.primary.main }} />

          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Résultats associés :
            </Typography>
            {loading ? (
              // Loading indicator
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  minHeight: 180,
                  py: 4,
                  color: theme.palette.text.secondary,
                }}
                spacing={2}
              >
                <CircularProgress color="primary" />
                <Typography variant="body1">
                  Chargement des données...
                </Typography>
              </Stack>
            ) : relatedData.length > 0 ? (
              <Grid container spacing={3}>
                {relatedData.map((item, idx) => (
                  <Grid item xs={12} sm={6} key={item.id}>
                    <Fade in={open} timeout={400 + idx * 180}>
                      <Card
                        sx={{
                          boxShadow: 5,
                          borderRadius: 3,
                          borderLeft: `5px solid ${theme.palette.primary.main}`,
                          bgcolor: "background.default",
                          minHeight: 210,
                          transition: "transform 0.2s",
                          "&:hover": {
                            transform: "scale(1.025)",
                            boxShadow: 8,
                          },
                        }}
                      >
                        <CardContent>
                          <Stack spacing={1}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: theme.palette.primary.main,
                                fontWeight: 600,
                              }}
                            >
                              {item.name}
                            </Typography>
                            <Divider
                              sx={{
                                my: 0.5,
                                bgcolor: theme.palette.primary.main,
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: theme.palette.text.primary }}
                            >
                              <strong>Catégorie :</strong> {item.categorie}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: theme.palette.text.secondary }}
                            >
                              <strong>Région :</strong> {item.region}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: theme.palette.text.secondary }}
                            >
                              <strong>Province :</strong> {item.province}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: theme.palette.text.primary }}
                            >
                              <strong>Description :</strong> {item.description}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: theme.palette.text.secondary }}
                            >
                              <strong>Statut :</strong> {item.status}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: theme.palette.text.secondary }}
                            >
                              <strong>Commentaire :</strong>{" "}
                              {item.commentaire || "Aucun"}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: theme.palette.text.secondary }}
                            >
                              <strong>Date de création :</strong>{" "}
                              {new Date(item.createdAt).toLocaleDateString()}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Aucun résultat trouvé.
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "background.paper" }}>
          <Button
            onClick={handleCloseModel}
            variant="contained"
            color="primary"
            sx={{
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default function DetailsBesoinWithTheme(props) {
  // This wrapper is needed so that useTheme() works inside DetailsBesoin
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <DetailsBesoin {...props} />
    </ThemeProvider>
  );
}
