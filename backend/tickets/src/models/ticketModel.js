import mongoose from "mongoose";

const ticketsSchema = new mongoose.Schema({
  // Champs communs
  date: {
    type: String,
    default: () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0
      const year = now.getFullYear();
      return `${day}-${month}-${year}`;
    },
  },
  site: {
    type: String,
  },
  technicien: {
    type: String,
    // Champs obligatoires
  },
  type_intervention: {
    type: String,
    // Fourniture ou maintenance
    enum: ["fourniture", "maintenance"], // Types autorisés
  },
  statut: {
    type: String,
    default: "ouvert",
    enum: ["ouvert", "en cours", "fermé"],
  },
  region: {
    type: String,
  },
  province: {
    type: String,
  },
  description: {
    type: String,
    // Description obligatoire
  },
  heure_debut: {
    type: String,
    default: () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    },
  },
  heure_fin: {
    type: String,
  },
  priorité: {
    type: String,
    default: "norme",
    enum: ["Urgent", "Norme", "Faible"], // Valeurs autorisées
  },

  // Champs spécifiques à la demande de fourniture
  fourniture: {
    site: { type: String }, // Nom ou description de la fourniture
    quantite: { type: Number }, // Quantité demandée
    justification: { type: String }, // Raison pour laquelle cette fourniture est nécessaire
    fournisseur: { type: String }, // Fournisseur suggéré
    budgetEstime: { type: Number }, // Budget estimé pour la fourniture
    dateLivraisonSouhaitee: { type: Date }, // Date de livraison souhaitée
    remarques: { type: String }, // Remarques supplémentaires
  },

  // Champs spécifiques au ticket de maintenance
  maintenance: {
    lieu: { type: String }, // Lieu ou emplacement de l'équipement concerné
    equipement: { type: String }, // Nom ou description de l'équipement
    numeroSerie: { type: String }, // Numéro de série de l'équipement
    natureIncident: { type: String }, // Description de l'incident ou du problème
    actionsTentees: { type: String }, // Actions déjà entreprises pour résoudre le problème
    personneContact: { type: String }, // Nom ou coordonnées de la personne à contacter
    observations: { type: String }, // Observations ou commentaires supplémentaires
    piecesDemandees: [{ type: String }], // Liste des pièces nécessaires pour la réparation
  },
});

const Ticket = mongoose.model("Tickets", ticketsSchema);

export default Ticket;
