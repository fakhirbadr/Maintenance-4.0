import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/userController.js";
import protect from "../user/middleware/authMiddleware.js";

const router = express.Router();

// Route pour l'enregistrement d'un utilisateur
router.post("/register", registerUser);

// Route pour la connexion d'un utilisateur
router.post("/login", loginUser);

// Route pour récupérer les informations du profil utilisateur (protégée)
router.get("/profile", protect, getUserProfile);

export default router;
