// @ts-nocheck
import React from "react";
import CardStats from "./CardStats";
import image1 from "../../../../../public/images/IOT/Livraison/1.png"; // Importation de l'image
import image2 from "../../../../../public/images/IOT/Livraison/2.png"; // Importation de l'image

import image3 from "../../../../../public/images/IOT/Livraison/3.png"; // Importation de l'image
import image4 from "../../../../../public/images/IOT/Livraison/4.png"; // Importation de l'image
import { Rating } from "@mui/material";
import CardChart from "./CardChart";

const Stats = () => {
  return (
    <div className="flex flex-col gap-y-3">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6  text-black [&>*]:p-3">
        <CardStats
          imageSrc={image1} // Utilisation de l'image importée
          title="Nombre des livraisons"
          description={
            <div>
              <div>
                Livraisons effectuées: <strong>150</strong>
              </div>
              <div>
                Livraisons en cours: <strong>3</strong>
              </div>
            </div>
          }
          link="#"
        />
        <CardStats
          imageSrc={image2} // Utilisation de l'image importée
          title="Moyenne des Satisfaction client "
          description={
            <div>
              <div className="flex flex-col">
                <div className="flex flex-row gap-6">
                  <Rating
                    name="read-only"
                    value={5}
                    readOnly
                    sx={{ fontSize: "20px" }}
                  />
                  <label htmlFor="">355</label>
                </div>
                <div className="flex flex-row gap-6">
                  <Rating
                    name="read-only"
                    value={4}
                    readOnly
                    sx={{ fontSize: "20px" }}
                  />
                  <label htmlFor="">266</label>
                </div>
                <div className="flex flex-row gap-6">
                  <Rating
                    name="read-only"
                    value={3}
                    readOnly
                    sx={{ fontSize: "20px" }}
                  />
                  <label htmlFor="">111</label>
                </div>
                <div className="flex flex-row gap-6">
                  <Rating
                    name="read-only"
                    value={2}
                    readOnly
                    sx={{ fontSize: "20px" }}
                  />
                  <label htmlFor="">30</label>
                </div>
                <div className="flex flex-row gap-6">
                  <Rating
                    name="read-only"
                    value={1}
                    readOnly
                    sx={{ fontSize: "20px" }}
                  />
                  <label htmlFor="">7</label>
                </div>
              </div>
              <div className="flex flex-row gap-6 justify-center pt-5">
                <label htmlFor=""> moyenne :</label>
                <Rating
                  name="read-only"
                  value={4}
                  readOnly
                  sx={{ fontSize: "20px", color: "green" }}
                />
                <label htmlFor="">4.21</label>
              </div>
            </div>
          }
          link="#"
        />
        <CardStats
          imageSrc={image3} // Utilisation de l'image importée
          title="Taux de livraison a temps"
          description={
            <div className="flex flex-col gap-y-3">
              <div className=" flex flex-row gap-x-4">
                <label htmlFor="">T.L.T:</label>
                <label className="text-green-700 font-bold" htmlFor="">
                  88%
                </label>
              </div>
              <div>
                <div className=" underline font-semibold uppercase">
                  analyse de retard
                </div>
                <div className="flex flex-row gap-x-4">
                  <label htmlFor="">meteo</label>
                  <label htmlFor="">6%</label>
                </div>
                <div className="flex flex-row gap-x-4">
                  <label htmlFor="">cerculation:</label>
                  <label htmlFor="">4%</label>
                </div>
                <div className="flex flex-row gap-x-4">
                  <label htmlFor="">panne de voiture</label>
                  <label htmlFor="">2%</label>
                </div>
              </div>
            </div>
          }
          link="#"
        />
        <CardStats
          imageSrc={image4} // Utilisation de l'image importée
          title="Temps moyenne de livraison"
          description={
            <div className="flex flex-col">
              <div className="flex flex-row gap-3 mb-2">
                <label className="text-black font-bold w-24" htmlFor="">
                  1H &gt; :
                </label>
                <label className="bg-green-200 rounded-lg p-1" htmlFor="">
                  140
                </label>
              </div>
              <div className="flex flex-row gap-3 mb-2">
                <label className="text-black font-bold w-24" htmlFor="">
                  1H &gt; X &gt; 2H :
                </label>
                <label className="bg-green-200 rounded-lg p-1" htmlFor="">
                  255
                </label>
              </div>
              <div className="flex flex-row gap-3 mb-2">
                <label className="text-black font-bold w-24" htmlFor="">
                  2H &gt; X &gt; 3H :
                </label>
                <label className="bg-green-200 rounded-lg p-1" htmlFor="">
                  332
                </label>
              </div>
              <div className="flex flex-row gap-3 mb-2">
                <label className="text-black font-bold w-24" htmlFor="">
                  Plus de 3H :
                </label>
                <label className="bg-green-200 rounded-lg p-1" htmlFor="">
                  55
                </label>
              </div>
              <div className="font-bold flex items-start justify-center">
                Moyenne :
              </div>
              <label
                className="bg-green-200 rounded-lg flex p-1 items-center justify-center"
                htmlFor=""
              >
                2H55min
              </label>
            </div>
          }
          link="#"
        />
        <CardChart className="sm:col-span-2  space-y-2 !px-0" />
      </div>
      <div className=" text-black flex  flex-row">
        <div className="flex-1 px-4  "></div>
        <div className="flex-1">Graphe 2</div>
        <div className="flex-1">Graphe 3</div>
      </div>
      <div className="bg-blue-100 text-black">
        <div>Satisfaction client par véhicule</div>
        <div>Réclamation</div>
      </div>
    </div>
  );
};

export default Stats;
