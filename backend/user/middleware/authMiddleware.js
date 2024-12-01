import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Extraire le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Vérifier le token
      req.user = decoded; // Ajouter l'utilisateur décodé à la requête
      next(); // Passer au middleware suivant
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default protect;
