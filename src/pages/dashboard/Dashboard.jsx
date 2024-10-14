import React from "react";
import Location from "../../components/Location";
import Card from "./Card";
import MttrCard from "./MttrCard";
import TicketGraph from "./TicketGraph";
import StatusTicket from "./StatusTicket";
import TauxDePannes from "./TauxDePannes";
import InterventionsPlanifiées from "./InterventionsPlanifiées";

const Dashboard = () => {
  return (
    <>
      <div className="overflow-hidden">
        <Location />
      </div>

      <div className="flex flex-col px-2 w-[99%] justify-center gap-y-3">
        <div className="flex md:flex-row gap-x-8 sm:flex-col sm:gap-y-4">
          <Card className="w-full md:w-1/2" />
          <MttrCard className="w-full md:w-1/2" />
        </div>
        <div className="text-lg font-semibold">Backlog de Maintenance</div>
        <div className="flex md:flex-row gap-x-8 sm:flex-col sm:gap-y-4">
          <div className="w-full md:w-1/2 bg-slate-700 rounded-3xl p-4 overflow-hidden">
            <TicketGraph />
          </div>
          <div className="w-full md:w-1/2 bg-slate-700 rounded-3xl p-4 overflow-hidden">
            <StatusTicket />
          </div>
        </div>

        <div className="text-lg font-semibold">Performance de Maintenance</div>
        <div className="flex md:flex-row gap-x-8 sm:flex-col sm:gap-y-4">
          <div className="w-full md:w-1/2 bg-slate-700 rounded-3xl p-4 overflow-hidden">
            <TauxDePannes />
          </div>
          <div className="w-full md:w-1/2 bg-slate-700 rounded-3xl p-4 overflow-hidden">
            <InterventionsPlanifiées />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
