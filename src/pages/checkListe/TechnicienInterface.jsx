import React from "react";
import Formulaire from "./Formulaire";

const TechnicienInterface = () => {
  return (
    <div>
      <div className="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl uppercase text-orange-500">
        Inventaire hebdomadaire
      </div>
      <div>
        <h2 className="flex flex-row flex-nowrap items-center ">
          <span className="flex-grow block border-t border-black"></span>
          <span className="flex-none block mx-4 px-4 py-2.5 text-xl rounded leading-none font-medium bg-orange-400 text-black">
            Merci de remplire le formulaire
          </span>
          <span className="flex-grow block border-t border-black"></span>
        </h2>
      </div>
      <div className="pt-32">
        <Formulaire />
      </div>
    </div>
  );
};

export default TechnicienInterface;
