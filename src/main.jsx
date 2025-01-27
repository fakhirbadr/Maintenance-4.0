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
import BesoinVehicule from "./pages/besoin_vehicule/besoinVehicule";
import Inventaire from "./pages/Inventaire des actifs/Inventaire";
import HistoriqueVehicule from "./pages/historique_vehicule/HistoriqueVehicule";
import Parametre from "./pages/parametre/Parametre";
import ProfilUser from "./pages/ProfilUser/ProfilUser";
import SuiviDemandeTechnicien from "./pages/SuiviTechnicien/SuiviDemandeTechnicien";
import Alerte from "./pages/Alertes/Alerte";
import Validation from "./pages/ValidationTicket/Validation";
import Homepage from "./pages/Homepage/Homepage";
import ModuleAchat from "./pages/Interface_Achat/ModuleAchat";
import InventiaireMAJ from "./pages/Inventaire des actifs/InventiaireMAJ";
import Hr from "./pages/HR/Hr";
import DemandeCongé from "./pages/HR/DemandeCongé";
import Index from "./pages/checkListe/Index";
import ListeDemandes from "./pages/HR/ListeDemandes";
import Reclamation from "./pages/HR/Reclamation";

// Création des routes
// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Routes>
//       <Route path="login" element={<Login />} />
//       <Route path="/" element={<App />}>
//         {/* Routes publiques */}
//         {/* <Route path="login" element={<Login />} /> */}

//         {/* Routes protégées */}
//         {/* <Route
//           path="actifs"
//           element={<ProtectedRoute element={<Actifs />} />}
//         /> */}
//         <Route
//           path="Inventaire"
//           element={<ProtectedRoute element={<Inventaire />} />}
//         />

//         <Route
//           path="ticket"
//           element={<ProtectedRoute element={<Ticket />} />}
//         />
//         <Route
//           path="BesoinVehicule"
//           element={<ProtectedRoute element={<BesoinVehicule />} />}
//         />
//         <Route
//           // path="tickets"
//           index
//           element={<ProtectedRoute element={<Tickets />} />}
//         />
//         <Route
//           path="besoin"
//           element={<ProtectedRoute element={<Besoin />} />}
//         />
//         <Route
//           path="HistoriqueIntervention"
//           element={<ProtectedRoute element={<HistoriqueIntervention />} />}
//         />
//         <Route
//           path="HistoriqueBesoin"
//           element={<ProtectedRoute element={<HistoriqueBesoin />} />}
//         />
//         <Route
//           path="HistoriqueVehicule"
//           element={<ProtectedRoute element={<HistoriqueVehicule />} />}
//         />
//         <Route path="test" element={<ProtectedRoute element={<Test />} />} />

//         {/* Routes non protégées */}
//         {/* Other public routes can be listed here */}
//       </Route>

//       {/* Route pour la page 404 */}
//       <Route path="*" element={<Notfound />} />
//     </Routes>
//   )
// );

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
        path: "parametres",
        element: <ProtectedRoute element={<Parametre />} />,
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
