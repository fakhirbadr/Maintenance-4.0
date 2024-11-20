import mongoose from "mongoose";
import Unite from "../../../models/unitesModel.js";
import { DataArray } from "@mui/icons-material";

const ticketsSchema = new mongoose.Schema({
  date: {
    type: String,
    default: () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0"); // getMonth() retourne un index de 0 à 11, donc il faut ajouter 1 pour le mois actuel
      const year = now.getFullYear(); // Correction ici
      return `${day}-${month}-${year}`;
    },
  },

  technicien: {
    type: String,
  },
  type_intervention: {
    type: String,
  },
  statut: {
    type: String,
  },
  region: {
    type: String,
  },
  province: {
    type: String,
  },
  description: {
    type: String,
  },
  heure_debut: {
    type: String,
    default: () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0"); // Heure
      const minutes = String(now.getMinutes()).padStart(2, "0"); // Minutes
      return `${hours}:${minutes}`; // Format HH:mm
    },
  },
  heure_fin: {
    type: String,
  },
  priorité: {
    type: String,
    default: () => {
      return "norme";
    },
  },
});

const Ticket = mongoose.model("Tickets", ticketsSchema);

export default Ticket;
