import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const Card = () => {
  const data1 = [
    { label: "Group A", value: 400, color: "#FF6384" }, // Rouge
    { label: "x3", value: 100, color: "rgba(255, 206, 86, 0)" }, // Jaune transparent
  ];

  const data2 = [
    { label: "B1", value: 100, color: "#9966FF" }, // Violet
    { label: "x3", value: 100, color: "rgba(255, 206, 86, 0)" }, // Jaune transparent
  ];

  const data3 = [
    { label: "x2", value: 300, color: "#36A2EB" }, // Bleu
    { label: "x3", value: 100, color: "rgba(255, 206, 86, 0)" }, // Jaune transparent
  ];

  return (
    <div className=" p-4   text-white w-[100%]  bg-gray-700 rounded-3xl">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row gap-x-5 justify-between">
          <div className="flex  sm:h-[6%] w-full text-ellipsis overflow-hidden sm:justify-center ">
            Temps de Disponibilité des Équipements
          </div>
          <div className="flex  justify-end">
            <button>...</button>
          </div>
        </div>
        <div className="flex sm:justify-center gap-x-3">
          <span className=" font-extrabold sm:justify-center flex">OEE </span>
          tous les unité
        </div>
        <div className="flex flex-row ">
          <div className="flex justify-center items-center w-[80%]  ">
            <PieChart
              className="flex justify-center items-center"
              series={[
                {
                  innerRadius: 100,
                  outerRadius: 80,
                  data: data1,
                },
                {
                  innerRadius: 100,
                  outerRadius: 120,
                  data: data2,
                },
                {
                  innerRadius: 120,
                  outerRadius: 140,
                  data: data3,
                },
              ]}
              width={400}
              height={300}
              slotProps={{
                legend: { hidden: true },
              }}
              sx={{
                display: "", // Ensure the PieChart is treated as a block element
              }}
            />
          </div>
          <div className="flex  w-[20%] font-extrabold text-2xl md:text-3xl sm:px-5 justify-center items-center p-8 md:w-[5%] sm:w-[5%]  ">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 font-extrabold">
              70%
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-wrap md:flex-row justify-evenly sm:gap-y-2 ">
          <div className="flex justify-center items-center flex-col text-green-500 border border-white px-3 py-1 rounded-lg h-[10%] w-[80%] md:w-[45%]">
            <div>Target</div>
            <div>80%</div>
          </div>

          <div className="flex  justify-center items-center flex-col text-red-500 border border-white px-3 py-1 rounded-lg h-[10%] w-[80%] md:w-[45%]">
            <div>Disponibilité</div>
            <div>60%</div>
          </div>

          <div className="flex justify-center items-center flex-col text-blue-500 border border-white px-3 py-1 rounded-lg h-[10%] w-[80%] md:w-[45%]">
            <div>Performance</div>
            <div>55%</div>
          </div>

          <div className="flex justify-center items-center flex-col text-amber-600 border border-white px-3 py-1 rounded-lg h-[10%] w-[80%] md:w-[45%]">
            <div>Qualité</div>
            <div>66%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
