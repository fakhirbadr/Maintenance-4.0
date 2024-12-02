import mongoose from "mongoose";

const FournitureSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Replacing 'ummc' with 'name'
  categorie: { type: String, required: true },
  besoin: { type: String, required: true },
  quantite: { type: Number, required: true },
  technicien: { type: String, required: true }, // Nouveau champ pour le technicien
  dateCreation: { type: Date, default: Date.now }, // Auto-generate the creation date
  isClosed: { type: Boolean, default: false }, // Valeur par défaut à false
});

const TicketFourniture = mongoose.model("TicketFourniture", FournitureSchema);
export default TicketFourniture;
