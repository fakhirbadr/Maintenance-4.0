import mongoose from "mongoose";

// Définir le schéma pour le ticket de maintenance
const ticketMaintenanceSchema = new mongoose.Schema(
  {
    name: { type: String, required: false }, // Changez à true
    site: { type: String, required: false },
    province: { type: String, required: false },
    technicien: { type: String, required: false },
    categorie: {
      type: String,
      required: false, // Changez à true
      enum: [
        "structure batiment",
        "dispositif médical",
        "matériel informatique",
      ],
    },
    description: { type: String, required: false },
    equipement_deficitaire: { type: String, required: false },
    urgence: {
      type: String,
      required: false, // Changez à true
      enum: ["faible", "moyenne", "élevée"],
    },
    photos: [{ type: String }],
  },
  { timestamps: true }
);

const TicketMaintenance = mongoose.model(
  "TicketMaintenance",
  ticketMaintenanceSchema
);

export default TicketMaintenance;
