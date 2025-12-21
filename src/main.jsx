import ReclamationsReseauGestion from "./pages/reclamations/ReclamationsReseauGestion";

// ...existing code...

// Ajout de la route dans le tableau children de la route principale (voir plus bas dans le fichier)
// {
//   path: "reclamations-reseau",
//   element: <ProtectedRoute element={<ReclamationsReseauGestion />} />,
// },
import React, { Children } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import Dashboard from "./pages/maintenance4.0/Dashboard";
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

import Formations from "./pages/Formations/Formations";
import Presentation from "./pages/Formations/FormationFils/Presentation";
import ChatBot from "./pages/ChatBot/ChatBot";
import Notfound from "./pages/not found/Notfound";
import Rapports from "./pages/Rapport/Rapports";
import RapportIntervention from "./pages/Rapport/Intervention_Rapports/RapportIntervention";
import Info from "./pages/Informations/Info";
import HistoriqueBesoin from "./pages/historique_besoin/historiqueBesoin";
import ProtectedRoute from "./ProtectedRoute";
import BesoinVehicule from "./pages/besoin_vehicule/besoinVehicule";
import TicketSi from "./pages/TicketSi/GestionTicketSi";
import Inventaire from "./pages/Inventaire des actifs/Inventaire";
import HistoriqueVehicule from "./pages/historique_vehicule/HistoriqueVehicule";
import HistoriqueSi from "./pages/historiqueSi/HistoriqueSi";
import HistoriqueDesRejets from "./pages/demandeRejet/DemandeRejat";

import Parametre from "./pages/parametre/Parametre";
import ProfilUser from "./pages/ProfilUser/ProfilUser";
import SuiviDemandeTechnicien from "./pages/SuiviTechnicien/SuiviDemandeTechnicien";
import Alerte from "./pages/Alertes/Alerte";
import ConfigurationAsset from "./pages/configActif/ConfigurationAsset";
import Validation from "./pages/ValidationTicket/Validation";
import Homepage from "./pages/Homepage/Homepage";
import ModuleAchat from "./pages/Interface_Achat/ModuleAchat";
import InventiaireMAJ from "./pages/Inventaire des actifs/InventiaireMAJ";
import Hr from "./pages/HR/Hr";
import DemandeCongé from "./pages/HR/DemandeCongé";
import Index from "./pages/checkListe/Index";
import ListeDemandes from "./pages/HR/ListeDemandes";
import Reclamation from "./pages/HR/Reclamation";
import NetworkPatientData from "./pages/NetworkPatientData/NetworkPatientData";
import NetworkPatient from "./pages/NetworkPatientData/NetworkPatient";
import GestionPharmaceutique from "./pages/pharmaceutique/GestionPharmaceutique";
import HistoriquePharmaceutique from "./pages/pharmaceutique/HistoriquePharmaceutique";

const router = createBrowserRouter([
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Tickets />,
      },
      {
        path: "Inventaire",
        element: <ProtectedRoute element={<InventiaireMAJ />} />,
      },
      {
        path: "dashboard",
        element: <ProtectedRoute element={<Dashboard />} />,
      },
      {
        path: "ticket",
        element: <ProtectedRoute element={<Ticket />} />,
      },
      {
        path: "tickets",
        element: <ProtectedRoute element={<Tickets />} />,
      },
      {
        path: "Validation",
        element: <ProtectedRoute element={<Validation />} />,
      },
      {
        path: "Achat",
        element: <ProtectedRoute element={<ModuleAchat />} />,
      },
      {
        path: "besoin",
        element: <ProtectedRoute element={<Besoin />} />,
      },

      {
        path: "BesoinVehicule",
        element: <ProtectedRoute element={<BesoinVehicule />} />,
      },
      {
        path: "TicketSI",
        element: <ProtectedRoute element={<TicketSi />} />,
      },
      {
        path: "HistoriqueIntervention",
        element: <ProtectedRoute element={<HistoriqueIntervention />} />,
      },
      {
        path: "HistoriqueBesoin",
        element: <ProtectedRoute element={<HistoriqueBesoin />} />,
      },
      {
        path: "HistoriqueVehicule",
        element: <ProtectedRoute element={<HistoriqueVehicule />} />,
      },
      {
        path: "HistoriqueSI",
        element: <ProtectedRoute element={<HistoriqueSi />} />,
      },
      {
        path: "HistoriqueDesRejets",
        element: <ProtectedRoute element={<HistoriqueDesRejets />} />,
      },
      {
        path: "parametres",
        element: <ProtectedRoute element={<Parametre />} />,
      },
      {
        path: "chatbot",
        element: <ProtectedRoute element={<ChatBot />} />,
      },
      {
        path: "SuiviDemande",
        element: <ProtectedRoute element={<SuiviDemandeTechnicien />} />,
      },
      {
        path: "utilisateur",
        element: <ProtectedRoute element={<ProfilUser />} />,
      },
      {
        path: "Alerte",
        element: <ProtectedRoute element={<Alerte />} />,
      },
      {
        path: "HomePage",
        element: <ProtectedRoute element={<Homepage />} />,
      },
      {
        path: "checkListe",
        element: <ProtectedRoute element={<Index />} />,
      },
      {
        path: "NetworkPatientData",
        element: <ProtectedRoute element={<NetworkPatientData />} />,
      },
      {
        path: "NetworkPatient",
        element: <ProtectedRoute element={<NetworkPatient />} />,
      },
      {
        path: "ConfigurationAsset",
        element: <ProtectedRoute element={<ConfigurationAsset />} />,
      },
      {
        path: "GestionPharmaceutique",
        element: <ProtectedRoute element={<GestionPharmaceutique />} />,
      },
      {
        path: "HistoriquePharmaceutique",
        element: <ProtectedRoute element={<HistoriquePharmaceutique />} />,
      },
    ],
  },
  {
    path: "test",
    element: <ProtectedRoute element={<Test />} />,
  },
  {
    path: "hr",
    element: <ProtectedRoute element={<Hr />} />,
  },
  {
    path: "DemandeCongé",
    element: <ProtectedRoute element={<DemandeCongé />} />,
  },
  {
    path: "listeDemandes",
    element: <ProtectedRoute element={<ListeDemandes />} />,
  },
  {
    path: "Reclamation",
    element: <ProtectedRoute element={<Reclamation />} />,
  },

  // {
  //   path: "test",
  //   element: <ProtectedRoute element={<Test />} />,
  // },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
