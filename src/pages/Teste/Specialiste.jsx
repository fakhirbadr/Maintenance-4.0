import React from "react";
import { Chart } from "react-google-charts";

const Specialiste = () => {
  const data = [
    ["Task", "Hours per Day"],
    ["Cardiologie", 11],
    ["Gynécologie", 8],
    ["Ophtalmologie", 2],
    ["ORL", 2],
    ["Endocrinologie", 7],
    ["Dermatologie", 7],
    ["Pédiatrie", 7],
    ["Néphrologue", 7],
    ["Pneumologie", 7],
  ];

  const options = {
    pieHole: 0.4, // Creates a Donut Chart. Does not do anything when is3D is enabled
    is3D: true, // Enables 3D view
    pieStartAngle: 100, // Rotates the chart
    sliceVisibilityThreshold: 0.02, // Hides slices smaller than 2%
    legend: {
      position: "left",
      alignment: "center",
      textStyle: {
        color: "#233238",
        fontSize: 12,
      },
    },
    colors: ["#8AD1C2", "#9F8AD1", "#D18A99", "#BCD18A", "#D1C28A"],
    backgroundColor: "transparent", // Make the background transparent
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-700 mb-4">
        LES SPECIALITES LES PLUS SOLLICITEES
      </h2>
      <div className="flex justify-center py-auto">
        <Chart
          chartType="PieChart"
          data={data}
          options={options}
          width={"500px"}
          height={"300px"}
        />
      </div>
    </div>
  );
};

export default Specialiste;
