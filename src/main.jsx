import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import Dashboard from "./pages/dashboard/Dashboard";
import Actifs from "./pages/actifs/Actifs";
import Intervention from "./pages/Intervention/Intervention";
import Calandar from "./pages/Caledrier/Calandar";
import Profils from "./pages/Profil/Profils";
import Test from "./pages/Teste/Test";
import Stocks from "./pages/Stocks/Stocks";
import Login from "./pages/Login/Login";
import Ticket from "./pages/ticket_maitenance/ticketMaintenance";
import Tickets from "./pages/demande_ticket/Ticket";
import Besoin from "./pages/besoin/listeBesoin";
import HistoriqueIntervention from "./pages/historique_Intervention/historiqueIntervention";
import TempReel from "./pages/IOT/TempReel";
import Capteur from "./pages/IOT/Capteur";
import HomePageCapteur from "./pages/IOT/HomePageCapteur";
import Livraison from "./pages/IOT/Livraison/Livraison";
import Formations from "./pages/Formations/Formations";
import Presentation from "./pages/Formations/FormationFils/Presentation";
import ChatBot from "./pages/ChatBot/ChatBot";
import Notfound from "./pages/not found/Notfound";
import Rapports from "./pages/Rapport/Rapports";
import RapportIntervention from "./pages/Rapport/Intervention_Rapports/RapportIntervention";
import Info from "./pages/Informations/Info";
import HistoriqueBesoin from "./pages/historique_besoin/historiqueBesoin";
import ProtectedRoute from "./ProtectedRoute";

// Création des routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        {/* Routes publiques */}
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />

        {/* Routes protégées */}
        <Route
          path="actifs"
          element={<ProtectedRoute element={<Actifs />} />}
        />
        <Route
          path="Intervention"
          element={<ProtectedRoute element={<Intervention />} />}
        />
        <Route
          path="ticket"
          element={<ProtectedRoute element={<Ticket />} />}
        />
        <Route
          path="tickets"
          element={<ProtectedRoute element={<Tickets />} />}
        />
        <Route
          path="besoin"
          element={<ProtectedRoute element={<Besoin />} />}
        />
        <Route
          path="HistoriqueIntervention"
          element={<ProtectedRoute element={<HistoriqueIntervention />} />}
        />
        <Route
          path="HistoriqueBesoin"
          element={<ProtectedRoute element={<HistoriqueBesoin />} />}
        />

        {/* Routes non protégées */}
        {/* Other public routes can be listed here */}
      </Route>

      {/* Route pour la page 404 */}
      <Route path="*" element={<Notfound />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
