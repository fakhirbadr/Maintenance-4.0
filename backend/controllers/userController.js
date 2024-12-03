import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Ajout de bcryptjs pour hacher et vérifier les mots de passe

// Fonction pour générer un token JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Contrôleur pour enregistrer un utilisateur
export const registerUser = async (req, res) => {
  const { email, password, role, province, site, nomComplet } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "L'utilisateur existe déjà." });
    }

    // Hacher le mot de passe avant de le sauvegarder
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer un nouvel utilisateur
    const newUser = await User.create({
      email,
      password: hashedPassword, // Sauvegarder le mot de passe haché
      role,
      province,
      site,
      nomComplet,
    });

    res.status(201).json({
      message: "Utilisateur créé avec succès.",
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        province: newUser.province,
        site: newUser.site,
        nomComplet: newUser.nomComplet,
      },
      token: generateToken(newUser._id, newUser.role),
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};

// Contrôleur pour connecter un utilisateur
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    console.log("User found:", user.email);
    console.log("Password from request:", password); // Afficher le mot de passe en clair

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(password, user.password);
    console.log("Password comparison result:", isPasswordValid); // Afficher le résultat de la comparaison

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    // Générer un token JWT
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: "Connexion réussie.",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        province: user.province,
        site: user.site,
        nomComplet: user.nomComplet,
      },
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};

// Contrôleur pour récupérer les informations de l'utilisateur connecté
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};
