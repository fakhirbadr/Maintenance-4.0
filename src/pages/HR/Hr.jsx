import Layout from "./Layout";
import React from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  List,
  ListItem,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "12px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#e0f2fe",
  height: "270px",
  overflow: "auto",
  padding: theme.spacing(3),
}));

const Hr = () => {
  // Données exemple
  const absences = [
    { id: 1, type: "Congé annuel", date: "2024-03-01", statut: "Approuvé" },
    { id: 2, type: "Maladie", date: "2024-03-05", statut: "En attente" },
    { id: 3, type: "Congé parental", date: "2024-03-10", statut: "Approuvé" },
    { id: 4, type: "Congé sans solde", date: "2024-03-15", statut: "Refusé" },
  ];

  const reclamations = [
    {
      id: 1,
      sujet: "Problème de paie",
      date: "2024-02-28",
      statut: "En cours",
    },
    {
      id: 2,
      sujet: "Conditions de travail",
      date: "2024-03-02",
      statut: "Résolu",
    },
    { id: 3, sujet: "Harcèlement", date: "2024-03-07", statut: "En cours" },
    {
      id: 4,
      sujet: "Erreur de contrat",
      date: "2024-03-12",
      statut: "Nouveau",
    },
  ];

  const actualites = [
    { id: 1, titre: "Nouvelle politique RH", date: "2024-03-01" },
    { id: 2, titre: "Atelier de formation", date: "2024-03-05" },
    { id: 3, titre: "Mise à jour des avantages", date: "2024-03-10" },
    { id: 4, titre: "Événement d'équipe", date: "2024-03-15" },
  ];

  const demandesDocuments = [
    {
      id: 1,
      type: "Contrat de travail",
      date: "2024-03-01",
      statut: "En attente",
    },
    { id: 2, type: "Bulletin de paie", date: "2024-03-05", statut: "Approuvé" },
    {
      id: 3,
      type: "Attestation de travail",
      date: "2024-03-10",
      statut: "Refusé",
    },
    {
      id: 4,
      type: "Relevé de compte",
      date: "2024-03-15",
      statut: "En attente",
    },
  ];

  return (
    <>
      <Layout />
      <Box
        sx={{
          minHeight: "90vh",
          p: 2,
          bgcolor: "#d1dffa",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid container spacing={4} sx={{ maxWidth: "90vw" }}>
          {/* Section Hero */}
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                borderRadius: "12px",
                overflow: "hidden",
                display: "flex",
                height: "270px",
                backgroundColor: "#e0f2fe",
              }}
            >
              <Box
                sx={{
                  width: "50%",
                  backgroundImage:
                    "url('https://zagrebglobal.com/wp-content/uploads/2024/08/hr-trends-shaping-2024-and-beyond.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <Box
                sx={{
                  width: "50%",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "primary.main",
                    fontWeight: "bold",
                    mb: 2,
                  }}
                >
                  SCX Technology RH Portal
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mb: 3,
                  }}
                >
                  Cette application vous permet de gérer facilement vos absences
                  et vos congés, de soumettre vos demandes et réclamations en
                  toute simplicité. Elle sert également de canal de
                  communication pour vous tenir informé des nouveautés et rester
                  à jour en temps réel
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    alignSelf: "flex-start",
                    textTransform: "none",
                  }}
                >
                  Demande de documents
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Section Absences */}
          <Grid item xs={12} md={4}>
            <StyledPaper>
              <Typography variant="h6" sx={{ color: "primary.main", mb: 2 }}>
                Absences
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#bfdbfe" }}>
                    <TableCell>Type</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Statut</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {absences.map((absence) => (
                    <TableRow key={absence.id} hover>
                      <TableCell sx={{ fontSize: "0.875rem" }}>
                        {absence.type}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.875rem" }}>
                        {absence.date}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={absence.statut}
                          size="small"
                          sx={{
                            fontSize: "0.75rem",
                            bgcolor:
                              absence.statut === "Approuvé"
                                ? "#dcfce7"
                                : "#fef9c3",
                            color:
                              absence.statut === "Approuvé"
                                ? "#166534"
                                : "#854d0e",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledPaper>
          </Grid>

          {/* Section Réclamations */}
          <Grid item xs={12} md={4}>
            <StyledPaper>
              <Typography variant="h6" sx={{ color: "primary.main", mb: 2 }}>
                Réclamations
              </Typography>
              <List>
                {reclamations.map((reclamation) => (
                  <ListItem
                    key={reclamation.id}
                    sx={{
                      borderLeft: "4px solid",
                      borderColor: "primary.main",
                      pl: 2,
                      py: 1,
                      mb: 1,
                    }}
                  >
                    <Box sx={{ width: "100%" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="subtitle2">
                          {reclamation.sujet}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "primary.main" }}
                        >
                          {reclamation.statut}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Déposée le {reclamation.date}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </StyledPaper>
          </Grid>

          {/* Section Nouveautés */}
          <Grid item xs={12} md={4}>
            <StyledPaper>
              <Typography variant="h6" sx={{ color: "primary.main", mb: 2 }}>
                Nouveautés
              </Typography>
              <List>
                {actualites.map((actu) => (
                  <ListItem
                    key={actu.id}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: "8px",
                      mb: 1,
                      "&:hover": { boxShadow: 2 },
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2">{actu.titre}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Publié le {actu.date}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </StyledPaper>
          </Grid>

          {/* Section Demandes de documents */}
          <Grid item xs={12} md={4}>
            <StyledPaper>
              <Typography variant="h6" sx={{ color: "primary.main", mb: 2 }}>
                Demande de documents
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#bfdbfe" }}>
                    <TableCell>Type</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Statut</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {demandesDocuments.map((demande) => (
                    <TableRow key={demande.id} hover>
                      <TableCell sx={{ fontSize: "0.875rem" }}>
                        {demande.type}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.875rem" }}>
                        {demande.date}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={demande.statut}
                          size="small"
                          sx={{
                            fontSize: "0.75rem",
                            bgcolor:
                              demande.statut === "Approuvé"
                                ? "#dcfce7"
                                : demande.statut === "Refusé"
                                ? "#fee2e2"
                                : "#fef9c3",
                            color:
                              demande.statut === "Approuvé"
                                ? "#166534"
                                : demande.statut === "Refusé"
                                ? "#991b1b"
                                : "#854d0e",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledPaper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Hr;
