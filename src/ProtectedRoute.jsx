import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("authToken"); // Vérifier si le token existe

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si authentifié, rendre le composant de la route
  return element;
};

export default ProtectedRoute;
