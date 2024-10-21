import React, { Children } from "react";
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
import Ticket from "./pages/ticket/Ticket";
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

// import Gestion from "./pages/gestion/Gestion";
// import Interventions from "./pages/Interventions/Interventions";
// import Calendrier from "./pages/calendrier/Calendrier";
// import Tickets from "./pages/Ticket/Tickets";
// import Stocks from "./pages/Stocks/Stocks";
// import Profil from "./pages/profil/Profil";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="actifs" element={<Actifs />} />
        <Route path="Intervention" element={<Intervention />} />
        <Route path="Calendrier" element={<Calandar />} />
        <Route path="Profils" element={<Profils />} />
        <Route path="Stocks" element={<Stocks />} />
        <Route path="test" element={<Test />} />
        <Route path="ticket" element={<Ticket />} />
        <Route path="Suivi" element={<TempReel />} />
        <Route path="Capteur" element={<Capteur />} />
        <Route path="HomePageCapteur" element={<HomePageCapteur />} />
        <Route path="Livraison" element={<Livraison />} />
        <Route path="Formations" element={<Formations />} />
        <Route path="/Presentation" element={<Presentation />} />
        <Route path="/ChatBot" element={<ChatBot />} />
        <Route path="/Rapports" element={<Rapports />} />
        <Route path="/RapportIntervention" element={<RapportIntervention />} />

        {/* <Route path="interventions" element={<Interventions />} />
      <Route path="Calendrier" element={<Calendrier />} />
      <Route path="Tickets" element={<Tickets />} />
      <Route path="Stocks" element={<Stocks />} />
      <Route path="Calendrier" element={<Calendrier />} />
      <Route path="Profil" element={<Profil />} /> */}
      </Route>
      <Route path="login" element={<Login />} />

      <Route path="*" element={<Notfound />}></Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
