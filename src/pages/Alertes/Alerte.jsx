import React, { useEffect, useState } from "react";
import Location from "../../components/Location";
import {
  Badge,
  Button,
  Collapse,
  Grid,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import axios from "axios";
import * as XLSX from "xlsx";

// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const Alerte = () => {
  const [ticketData, setTicketData] = useState([]);
  const [fournitureData, setFournitureData] = useState([]);
  const [showAllTickets, setShowAllTickets] = useState(false);
  const [showAllFourniture, setShowAllFourniture] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogType, setDialogType] = useState(""); // "ticket" ou "fourniture"
  const theme = useTheme();

  // Styled components with improved dark theme support
  const DarkThemeItem = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1e1e2f" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(3),
    borderRadius: "12px",
    color:
      theme.palette.mode === "dark" ? "#e2e2e2" : theme.palette.text.secondary,
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 8px 16px 0 rgba(0,0,0,0.4)"
        : "0 2px 8px rgba(0,0,0,0.1)",
  }));

  const DarkThemeTitle = styled("span")(({ theme }) => ({
    color: theme.palette.mode === "dark" ? "#ffffff" : "inherit",
    fontWeight: "bold",
  }));

  const DarkThemeHighlight = styled("span")(({ theme }) => ({
    color: theme.palette.mode === "dark" ? "#ffc107" : "#f59e0b", // Yellow that works in dark mode
  }));

  const TicketCard = styled("div")(({ theme }) => ({
    marginBottom: "16px",
    position: "relative",
    cursor: "pointer",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-2px)",
    },
    "& .shadow": {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      marginTop: "4px",
      marginLeft: "4px",
      borderRadius: "8px",
      backgroundColor: theme.palette.mode === "dark" ? "#4c51bf" : "#6366f1",
      opacity: theme.palette.mode === "dark" ? 0.7 : 1,
    },
    "& .content": {
      position: "relative",
      padding: "12px",
      backgroundColor: theme.palette.mode === "dark" ? "#2d3748" : "#fff",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: theme.palette.mode === "dark" ? "#4c51bf" : "#6366f1",
      borderRadius: "8px",
    },
    "& .title": {
      fontWeight: "bold",
      fontSize: "0.95rem",
      color: theme.palette.mode === "dark" ? "#ffffff" : "#1a202c",
    },
    "& .category": {
      fontSize: "0.75rem",
      fontWeight: "600",
      letterSpacing: "0.02em",
      color: theme.palette.mode === "dark" ? "#a5b4fc" : "#6366f1",
      textTransform: "uppercase",
      marginBottom: "4px",
    },
    "& .details": {
      fontSize: "0.875rem",
      fontWeight: "500",
      color: theme.palette.mode === "dark" ? "#ffffff" : "#4a5568",
      marginBottom: "8px",
      lineHeight: "1.4",
    },
  }));

  const FournitureCard = styled("div")(({ theme }) => ({
    marginBottom: "16px",
    position: "relative",
    cursor: "pointer",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-2px)",
    },
    "& .shadow": {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      marginTop: "4px",
      marginLeft: "4px",
      borderRadius: "8px",
      backgroundColor: theme.palette.mode === "dark" ? "#047857" : "#10b981",
      opacity: theme.palette.mode === "dark" ? 0.7 : 1,
    },
    "& .content": {
      position: "relative",
      padding: "12px",
      backgroundColor: theme.palette.mode === "dark" ? "#2d3748" : "#fff",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: theme.palette.mode === "dark" ? "#047857" : "#10b981",
      borderRadius: "8px",
    },
    "& .title": {
      fontWeight: "bold",
      fontSize: "0.95rem",
      color: theme.palette.mode === "dark" ? "#ffffff" : "#1a202c",
    },
    "& .category": {
      fontSize: "0.75rem",
      fontWeight: "600",
      letterSpacing: "0.02em",
      color: theme.palette.mode === "dark" ? "#6ee7b7" : "#059669",
      textTransform: "uppercase",
      marginBottom: "4px",
    },
    "& .details": {
      fontSize: "0.875rem",
      fontWeight: "500",
      color: theme.palette.mode === "dark" ? "#ffffff" : "#4a5568",
      marginBottom: "8px",
      lineHeight: "1.4",
    },
  }));

  const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: "8px",
    backgroundColor: theme.palette.mode === "dark" ? "#2d3748" : undefined,
    color: theme.palette.mode === "dark" ? "#ffffff" : undefined,
    "&:hover": {
      backgroundColor: theme.palette.mode === "dark" ? "#4a5568" : undefined,
    },
    borderColor: theme.palette.mode === "dark" ? "#6b7280" : undefined,
    fontWeight: "500",
  }));

  const ExportButton = styled(Button)(({ theme }) => ({
    marginTop: "16px",
    backgroundColor: theme.palette.mode === "dark" ? "#065f46" : "#10b981",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: theme.palette.mode === "dark" ? "#047857" : "#059669",
    },
    fontWeight: "bold",
  }));

  const DialogButton = styled(Button)(({ theme }) => ({
    fontWeight: "bold",
    backgroundColor:
      theme.palette.mode === "dark"
        ? dialogType === "ticket"
          ? "#4c51bf"
          : "#047857"
        : dialogType === "ticket"
        ? "#6366f1"
        : "#10b981",
    color: "#ffffff",
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? dialogType === "ticket"
            ? "#3c4392"
            : "#036645"
          : dialogType === "ticket"
          ? "#4f52c3"
          : "#059669",
    },
  }));

  const DetailRow = styled("div")({
    display: "flex",
    marginBottom: "12px",
    alignItems: "flex-start",
  });

  const DetailLabel = styled(Typography)(({ theme }) => ({
    fontWeight: "bold",
    width: "140px",
    color: theme.palette.mode === "dark" ? "#d1d5db" : "#4b5563",
    paddingRight: "12px",
  }));

  const DetailValue = styled(Typography)(({ theme }) => ({
    flex: 1,
    color: theme.palette.mode === "dark" ? "#f3f4f6" : "#1f2937",
  }));

  // Highlight text styling for important data
  const ImportantText = styled("span")(({ theme }) => ({
    fontWeight: "600",
    color: theme.palette.mode === "dark" ? "#ffffff" : "inherit",
  }));

  // Time elapsed styling for better visibility
  const TimeElapsed = styled("span")(({ theme }) => ({
    color: theme.palette.mode === "dark" ? "#fcd34d" : "#d97706", // amber for better visibility
    fontWeight: "600",
  }));

  // Function to calculate elapsed time
  const calculateElapsedTime = (dateCreation) => {
    const creationDate = new Date(dateCreation);
    const now = new Date();
    const diffInMilliseconds = now - creationDate;

    // Calculate days, hours and minutes
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const days = Math.floor(diffInMinutes / (60 * 24));
    const hours = Math.floor((diffInMinutes % (60 * 24)) / 60);
    const minutes = diffInMinutes % 60;

    return `${days}j ${hours}h ${minutes}m`;
  };

  // Calculate alerts according to user role
  const filterDataByRole = (data, role) => {
    const timeThreshold = role === "superviseur" ? 4320 : 4320; // 3 days in minutes
    return data.filter((item) => {
      const creationDate = new Date(item.createdAt || item.dateCreation);
      const now = new Date();
      const diffInMilliseconds = now - creationDate;
      const diffInMinutes = diffInMilliseconds / (1000 * 60);
      return diffInMinutes > timeThreshold;
    });
  };

  // Function to handle card click and open dialog
  const handleCardClick = (item, type) => {
    setSelectedItem(item);
    setDialogType(type);
    setDialogOpen(true);
  };

  // Function to close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    // Get user role from localStorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userRole = userInfo?.role || "admin";

    const fetchTicketData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/ticketMaintenance?isClosed=false&isDeleted=false`
        );
        const fetchedData = response.data;
        const filteredData = filterDataByRole(fetchedData, userRole);
        setTicketData(filteredData);
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      }
    };

    const fetchFournitureData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/fournitureRoutes?isClosed=false&isDeleted=false`
        );
        const fetchedData = response.data.fournitures;
        const filteredFournitureData = filterDataByRole(fetchedData, userRole);
        setFournitureData(filteredFournitureData);
      } catch (error) {
        console.error("Error fetching fourniture data:", error);
      }
    };

    fetchTicketData();
    fetchFournitureData();
  }, []);

  // Function to export data to Excel with colored header
  const exportToExcel = (data, fileName) => {
    const filteredData = data.map((item) => {
      const elapsedTime = calculateElapsedTime(item.dateCreation);
      return {
        name: item.name,
        region: item.region,
        province: item.province,
        besoin: item.besoin,
        quantite: item.quantite,
        technicien: item.technicien,
        commentaire: item.commentaire,
        status: item.status,
        dateCreation: item.dateCreation,
        tempsEcoule: elapsedTime,
      };
    });

    // Create Excel sheet
    const worksheet = XLSX.utils.json_to_sheet(filteredData, {
      skipHeader: true,
    });

    // Add custom header
    const header = [
      "Nom",
      "Région",
      "Province",
      "Besoin",
      "Quantité",
      "Technicien",
      "Commentaire",
      "Statut",
      "Date Création",
      "Temps Écoulé",
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: "A1" });

    // Apply style to header
    const headerStyle = {
      fill: {
        patternType: "solid",
        fgColor: { rgb: theme.palette.mode === "dark" ? "2E3B55" : "0000FF" },
      },
      font: {
        color: { rgb: "FFFFFF" },
        bold: true,
      },
      alignment: {
        horizontal: "center",
      },
    };

    // Apply style to each header cell
    for (let C = 0; C < header.length; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cellAddress]) worksheet[cellAddress] = {};
      worksheet[cellAddress].s = headerStyle;
    }

    // Adjust column widths
    const colWidths = header.map((h) => ({ wch: h.length + 5 }));
    worksheet["!cols"] = colWidths;

    // Create new workbook and add sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Données");

    // Export Excel file
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  // Fonction pour formater la date de création
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Rendu du dialogue de détails
  const renderDialog = () => {
    if (!selectedItem) return null;

    // Contenu spécifique au type de ticket (maintenance ou fourniture)
    const dialogContent =
      dialogType === "ticket" ? (
        <>
          <DialogTitle
            sx={{
              fontWeight: "bold",
              color: theme.palette.mode === "dark" ? "#fff" : "#1a202c",
              borderBottom: `2px solid ${
                theme.palette.mode === "dark" ? "#4c51bf" : "#6366f1"
              }`,
            }}
          >
            Détails du Ticket de Maintenance
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <DetailRow>
              <DetailLabel variant="body1">Site:</DetailLabel>
              <DetailValue variant="body1">{selectedItem.site}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel variant="body1">Région:</DetailLabel>
              <DetailValue variant="body1">{selectedItem.region}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel variant="body1">Province:</DetailLabel>
              <DetailValue variant="body1">{selectedItem.province}</DetailValue>
            </DetailRow>
            <Divider sx={{ my: 2 }} />
            <DetailRow>
              <DetailLabel variant="body1">Catégorie:</DetailLabel>
              <DetailValue variant="body1">
                {selectedItem.categorie || "Non spécifiée"}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel variant="body1">Équipement:</DetailLabel>
              <DetailValue variant="body1">
                {selectedItem.equipement_deficitaire || "Non spécifié"}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel variant="body1">Problème:</DetailLabel>
              <DetailValue variant="body1">
                {selectedItem.probleme || "Non spécifié"}
              </DetailValue>
            </DetailRow>
            <Divider sx={{ my: 2 }} />
            <DetailRow>
              <DetailLabel variant="body1">Technicien:</DetailLabel>
              <DetailValue variant="body1">
                {selectedItem.technicien}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel variant="body1">Statut:</DetailLabel>
              <DetailValue variant="body1">
                {selectedItem.status || "En attente"}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel variant="body1">Date création:</DetailLabel>
              <DetailValue variant="body1">
                {formatDate(selectedItem.createdAt)}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel variant="body1">Temps écoulé:</DetailLabel>
              <DetailValue
                variant="body1"
                sx={{
                  color: theme.palette.mode === "dark" ? "#fcd34d" : "#d97706",
                  fontWeight: "bold",
                }}
              >
                {calculateElapsedTime(selectedItem.createdAt)}
              </DetailValue>
            </DetailRow>
            <Divider sx={{ my: 2 }} />
            <DetailRow>
              <DetailLabel variant="body1">Description:</DetailLabel>
              <DetailValue variant="body1">
                {selectedItem.description || "Aucune description fournie"}
              </DetailValue>
            </DetailRow>
            {selectedItem.commentaires && (
              <DetailRow>
                <DetailLabel variant="body1">Commentaires:</DetailLabel>
                <DetailValue variant="body1">
                  {selectedItem.commentaires}
                </DetailValue>
              </DetailRow>
            )}
          </DialogContent>
        </>
      ) : (
        <>
          <DialogTitle
            sx={{
              fontWeight: "bold",
              color: theme.palette.mode === "dark" ? "#fff" : "#1a202c",
              borderBottom: `2px solid ${
                theme.palette.mode === "dark" ? "#047857" : "#10b981"
              }`,
            }}
          >
            Détails du Ticket de Commande
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <DetailRow>
              <DetailLabel variant="body1">Nom:</DetailLabel>
              <DetailValue variant="body1">{selectedItem.name}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel variant="body1">Région:</DetailLabel>
              <DetailValue variant="body1">{selectedItem.region}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel variant="body1">Province:</DetailLabel>
              <DetailValue variant="body1">{selectedItem.province}</DetailValue>
            </DetailRow>
            <Divider sx={{ my: 2 }} />
            <DetailRow>
              <DetailLabel variant="body1">Catégorie:</DetailLabel>
              <DetailValue variant="body1">
                {selectedItem.categorie || "Non spécifiée"}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel variant="body1">Besoin:</DetailLabel>
              <DetailValue variant="body1">
                {selectedItem.besoin || "Non spécifié"}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel variant="body1">Quantité:</DetailLabel>
              <DetailValue variant="body1">
                {selectedItem.quantite || "Non spécifiée"}
              </DetailValue>
            </DetailRow>
            <Divider sx={{ my: 2 }} />
            <DetailRow>
              <DetailLabel variant="body1">Technicien:</DetailLabel>
              <DetailValue variant="body1">
                {selectedItem.technicien}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel variant="body1">Statut:</DetailLabel>
              <DetailValue variant="body1">
                {selectedItem.status || "En attente"}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel variant="body1">Date création:</DetailLabel>
              <DetailValue variant="body1">
                {formatDate(selectedItem.dateCreation)}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel variant="body1">Temps écoulé:</DetailLabel>
              <DetailValue
                variant="body1"
                sx={{
                  color: theme.palette.mode === "dark" ? "#fcd34d" : "#d97706",
                  fontWeight: "bold",
                }}
              >
                {calculateElapsedTime(selectedItem.dateCreation)}
              </DetailValue>
            </DetailRow>
            <Divider sx={{ my: 2 }} />
            {selectedItem.commentaire && (
              <DetailRow>
                <DetailLabel variant="body1">Commentaire:</DetailLabel>
                <DetailValue variant="body1">
                  {selectedItem.commentaire}
                </DetailValue>
              </DetailRow>
            )}
          </DialogContent>
        </>
      );

    return (
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.mode === "dark" ? "#1e1e2f" : "#fff",
            borderRadius: "10px",
          },
        }}
      >
        {dialogContent}
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <DialogButton onClick={handleCloseDialog}>Fermer</DialogButton>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <div className={theme.palette.mode === "dark" ? "" : ""}>
      <div className="mr-auto">
        <Location />
      </div>

      <div>
        <Grid container spacing={3}>
          {/* First column - Tickets */}
          <Grid item xs={12} sm={6}>
            <DarkThemeItem>
              <h1 className="text-4xl font-bold mb-4">
                <DarkThemeHighlight className="uppercase text-4xl font-bold mb-4">
                  Alertes
                </DarkThemeHighlight>{" "}
                <DarkThemeTitle>Tickets Maintenances</DarkThemeTitle>{" "}
                <Badge
                  badgeContent={ticketData.length}
                  color="error"
                  sx={{ ml: 3 }}
                />
              </h1>
              <div className="w-full">
                {ticketData.slice(0, 5).map((ticket, index) => (
                  <TicketCard
                    key={ticket._id || index}
                    onClick={() => handleCardClick(ticket, "ticket")}
                  >
                    <div className="shadow"></div>
                    <div className="content">
                      <div className="flex items-center -mt-1">
                        <h3 className="title ml-3">
                          {ticket.site} / {ticket.region} / {ticket.province}{" "}
                        </h3>
                      </div>
                      <p className="category">
                        {ticket.categorie || "Catégorie non spécifiée"} |{" "}
                        {ticket.equipement_deficitaire ||
                          "Équipement défectueux non spécifié"}
                      </p>
                      <p className="details">
                        <ImportantText>Technicien : </ImportantText>
                        {ticket.technicien} /{" "}
                        <ImportantText>Temps écoulé : </ImportantText>{" "}
                        <TimeElapsed>
                          {calculateElapsedTime(ticket.createdAt)}
                        </TimeElapsed>
                      </p>
                    </div>
                  </TicketCard>
                ))}
                <StyledButton
                  onClick={() => setShowAllTickets(!showAllTickets)}
                  variant="outlined"
                  color="primary"
                  fullWidth
                >
                  {showAllTickets ? "Voir moins" : "Voir plus"}
                </StyledButton>
                <Collapse in={showAllTickets}>
                  {ticketData.slice(5).map((ticket, index) => (
                    <TicketCard
                      key={ticket._id || index}
                      onClick={() => handleCardClick(ticket, "ticket")}
                    >
                      <div className="shadow"></div>
                      <div className="content">
                        <div className="flex items-center -mt-1">
                          <h3 className="title ml-3">
                            {ticket.site} / {ticket.region} / {ticket.province}
                          </h3>
                        </div>
                        <p className="category">
                          {ticket.categorie || "Catégorie non spécifiée"} |{" "}
                          {ticket.equipement_deficitaire ||
                            "Équipement défectueux non spécifié"}
                        </p>
                        <p className="details">
                          <ImportantText>Technicien : </ImportantText>
                          {ticket.technicien} /{" "}
                          <ImportantText>Temps écoulé : </ImportantText>{" "}
                          <TimeElapsed>
                            {calculateElapsedTime(ticket.createdAt)}
                          </TimeElapsed>
                        </p>
                      </div>
                    </TicketCard>
                  ))}
                </Collapse>
              </div>
            </DarkThemeItem>
          </Grid>

          {/* Second column - Fourniture Routes */}
          <Grid item xs={12} sm={6}>
            <DarkThemeItem>
              <h1 className="text-4xl font-bold mb-4">
                <DarkThemeHighlight className="uppercase text-4xl font-bold mb-4">
                  Alertes
                </DarkThemeHighlight>{" "}
                <DarkThemeTitle>Tickets commandes</DarkThemeTitle>{" "}
                <Badge
                  badgeContent={fournitureData.length}
                  color="error"
                  sx={{ ml: 3 }}
                />
              </h1>
              <div className="w-full">
                {fournitureData.slice(0, 5).map((route, index) => (
                  <FournitureCard
                    key={route._id || index}
                    onClick={() => handleCardClick(route, "fourniture")}
                  >
                    <div className="shadow"></div>
                    <div className="content">
                      <div className="flex items-center -mt-1">
                        <h3 className="title ml-3">
                          {route.name} / {route.region} / {route.province}
                        </h3>
                      </div>
                      <p className="category">
                        {route.categorie || "Catégorie non spécifiée"} |{" "}
                        {route.besoin || "Équipement défectueux non spécifié"}|{" "}
                        {route.status}
                      </p>
                      <p className="details">
                        <ImportantText>{route.technicien}</ImportantText> /{" "}
                        <ImportantText>Temps écoulé : </ImportantText>{" "}
                        <TimeElapsed>
                          {calculateElapsedTime(route.dateCreation)}
                        </TimeElapsed>
                      </p>
                    </div>
                  </FournitureCard>
                ))}
                <StyledButton
                  onClick={() => setShowAllFourniture(!showAllFourniture)}
                  variant="outlined"
                  color="primary"
                  fullWidth
                >
                  {showAllFourniture ? "Voir moins" : "Voir plus"}
                </StyledButton>
                <Collapse in={showAllFourniture}>
                  {fournitureData.slice(5).map((route, index) => (
                    <FournitureCard
                      key={route._id || index}
                      onClick={() => handleCardClick(route, "fourniture")}
                    >
                      <div className="shadow"></div>
                      <div className="content">
                        <div className="flex items-center -mt-1">
                          <h3 className="title ml-3">
                            {route.name} / {route.region} / {route.province}
                          </h3>
                        </div>
                        <p className="category">
                          {route.categorie || "Catégorie non spécifiée"} |{" "}
                          {route.besoin || "Équipement défectueux non spécifié"}
                        </p>
                        <p className="details">
                          <ImportantText>Technicien : </ImportantText>
                          {route.technicien} /{" "}
                          <ImportantText>Temps écoulé : </ImportantText>{" "}
                          <TimeElapsed>
                            {calculateElapsedTime(route.dateCreation)}
                          </TimeElapsed>
                        </p>
                      </div>
                    </FournitureCard>
                  ))}
                </Collapse>
                {/* Button to export to Excel */}
                <ExportButton
                  onClick={() => exportToExcel(fournitureData, "commandes")}
                  variant="contained"
                  fullWidth
                >
                  Exporter en Excel
                </ExportButton>
              </div>
            </DarkThemeItem>
          </Grid>
        </Grid>
      </div>

      {/* Dialog pour afficher les détails */}
      {renderDialog()}
    </div>
  );
};

export default Alerte;
