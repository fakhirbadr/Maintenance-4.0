import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";

const SubTickets = ({ open, ticket, onClose, onSave }) => {
  // Initialize state for sub-ticket name and comment
  const [subTicketFields, setSubTicketFields] = useState({
    name: "",
    site: "",
    province: "",
    region: "",
    technicien: "",
    categorie: "",
    description: "",
    quantite: 1,
    equipement_deficitaire: "",
    commentaire: "",
  });

  // Reset fields when modal is opened
  useEffect(() => {
    if (open) {
      setSubTicketFields({
        name: ticket.name || "",
        site: ticket.site || "",
        region: ticket.region || "",
        province: ticket.province || "",
        technicien: ticket.technicien || "",
        categorie: ticket.categorie || "",
        description: ticket.description || "",
        quantite: 1,
        equipement_deficitaire: ticket.equipement_deficitaire || "",
        commentaire: ticket.commentaire || "",
      });
    }
  }, [open]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubTicketFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  // API call to add a sub-ticket and update the visibility status
  const handleAddSubTicket = async () => {
    try {
      const response = await axios.patch(
        `https://backend-v1-1.onrender.com/api/v1/ticketMaintenance/${ticket._id}`,
        {
          isVisible: false, // Update visibility status to false
          subTickets: [...ticket.subTickets, subTicketFields],
        }
      );
      console.log("Sous-ticket ajouté:", response.data);
      onSave(); // Trigger the onSave callback to refresh the data
    } catch (error) {
      console.error("Erreur lors de l'ajout du sous-ticket:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Créer un sous-ticket</DialogTitle>
      <DialogContent>
        <Grid item xs={12}>
          <Typography sx={{ paddingY: 2 }} variant="h6" align="center">
            Besoins liés au ticket de maintenance
          </Typography>
        </Grid>
        {ticket ? (
          <Grid container spacing={2}>
            {/* Ticket Information */}
            <Grid item xs={4}>
              <TextField
                label="Name"
                value={ticket.name || ""}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Site"
                value={ticket.site || ""}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Province"
                value={ticket.province || ""}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Technician"
                value={ticket.technicien || ""}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Category"
                value={ticket.categorie || ""}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Urgency"
                value={ticket.urgence || ""}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Description"
                value={ticket.description || ""}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Defective Equipment"
                value={ticket.equipement_deficitaire || ""}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Comments"
                value={ticket.commentaire || ""}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
                disabled
              />
            </Grid>
            {/* Sub-Ticket Information */}
            <Grid item xs={12}>
              <Typography variant="h6" align="center">
                Besoins liés au ticket de besoin
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Nom du sous-ticket"
                name="name"
                value={subTicketFields.name}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Site"
                name="site"
                value={subTicketFields.site}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Région"
                name="region"
                value={subTicketFields.region}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Province"
                name="province"
                value={subTicketFields.province}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Technicien"
                name="technicien"
                value={subTicketFields.technicien}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                disabled
              />
            </Grid>{" "}
            <Grid item xs={4}>
              <TextField
                label="Catégorie"
                name="categorie"
                value={subTicketFields.categorie}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Description"
                name="description"
                value={subTicketFields.description}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                multiline
                rows={1}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Quantité"
                name="quantite"
                type="number"
                value={subTicketFields.quantite}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              />
            </Grid>{" "}
            <Grid item xs={4}>
              <TextField
                label="Équipement déficitaire"
                name="equipement_deficitaire"
                value={subTicketFields.equipement_deficitaire}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Commentaire"
                name="commentaire"
                value={subTicketFields.commentaire}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        ) : (
          <p>Loading...</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleAddSubTicket}
          color="secondary"
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubTickets;
