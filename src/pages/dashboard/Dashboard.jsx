import React from "react";
import Location from "../../components/Location";
import Card from "./Card";
import MttrCard from "./MttrCard";
import TicketGraph from "./TicketGraph";
import StatusTicket from "./StatusTicket";
import TauxDePannes from "./TauxDePannes";
import InterventionsPlanifiées from "./InterventionsPlanifiées";
import "./Card.css"; // Assurez-vous d'importer votre fichier CSS
import CustomCard from "./Card";

const Dashboard = () => {
  const seriesData = [
    4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5,
  ];
  const categories = [
    "1/11/2000",
    "2/11/2000",
    "3/11/2000",
    "4/11/2000",
    "5/11/2000",
    "6/11/2000",
    "7/11/2000",
    "8/11/2000",
    "9/11/2000",
    "10/11/2000",
    "11/11/2000",
    "12/11/2000",
    "1/11/2001",
    "2/11/2001",
    "3/11/2001",
    "4/11/2001",
    "5/11/2001",
    "6/11/2001",
  ];

  return (
    <>
      <Location />

      <div className="flex flex-col px-2 w-[99%] justify-center gap-y-3">
        <div className="text-lg font-semibold">
          Performance de Disponibilité des Équipements
        </div>

        <div className="flex md:flex-row gap-x-8 sm:flex-col sm:gap-y-4">
          <CustomCard className=" md:w-1/2" /> {/* Passez la classe ici */}
          <MttrCard className=" md:w-1/2" />
        </div>
        <div className="text-lg font-semibold">Backlog de Maintenance</div>
        <div className="flex md:flex-row gap-x-8 sm:flex-col sm:gap-y-4">
          <div className=" md:w-1/2   overflow-hidden">
            <TicketGraph />
          </div>
          <div className=" md:w-1/2  overflow-hidden">
            <StatusTicket />
          </div>
        </div>

        <div className="text-lg font-semibold">Performance de Maintenance</div>
        <div className="flex md:flex-row gap-x-8 sm:flex-col sm:gap-y-4">
          <div className=" md:w-1/2  overflow-hidden">
            <TauxDePannes />
          </div>
          <div className=" md:w-1/2 overflow-hidden">
            <InterventionsPlanifiées />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
