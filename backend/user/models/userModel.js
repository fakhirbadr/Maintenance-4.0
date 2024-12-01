import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Définition du schéma utilisateur
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"], // Les rôles possibles
      default: "user",
    },
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt
  }
);

// Middleware pour hasher le mot de passe avant de sauvegarder
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Comparaison du mot de passe
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Exportation du modèle
const User = mongoose.model("User", userSchema);

export default User;
