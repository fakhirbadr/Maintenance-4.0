import express from "express";
import {
  getAllUnite,
  createUnite,
  getUnite,
  updateUnite,
  deleteUnite,
  checkID,
  checkBody,
} from "./../controllers/uniteController.js";

// Créer le routeur express
const router = express.Router();

router.param("id", checkID);

// Routes pour toutes les unités et pour créer une unité
router.route("/").get(getAllUnite).post(checkBody, createUnite);

// Routes pour une unité spécifique avec ID pour lire, mettre à jour et supprimer
router.route("/:id").get(getUnite).patch(updateUnite).delete(deleteUnite);

export default router;
