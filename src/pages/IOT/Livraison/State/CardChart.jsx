import React, { useState, Fragment } from "react";
import clone from "clone";
import { Card } from "@mui/material";

const CardChart = (props) => {
  const [options, setOptions] = useState({
    title: {
      text: "Performance des Livraisons : Taux de Réussite et Échecs",
    },

    subtitle: {
      text: "",
    },
    data: getData(),
    series: [
      {
        type: "line",
        xKey: "month",
        xName: "Month",
        yKey: "min",
        yName: "Échouées",
        interpolation: { type: "smooth" },
      },
      {
        type: "line",
        xKey: "month",
        xName: "Month",
        yKey: "max",
        yName: "Réussite",
        interpolation: { type: "smooth" },
      },
    ],
  });

  const lineStyleLinear = () => {
    const nextOptions = clone(options);

    nextOptions.series?.forEach((series) => {
      series.interpolation = { type: "linear" };
    });

    setOptions(nextOptions);
  };

  const lineStyleSmooth = () => {
    const nextOptions = clone(options);

    nextOptions.series?.forEach((series) => {
      series.interpolation = { type: "smooth" };
    });

    setOptions(nextOptions);
  };

  const lineStyleStepStart = () => {
    const nextOptions = clone(options);

    nextOptions.series?.forEach((series) => {
      series.interpolation = { type: "step", position: "start" };
    });

    setOptions(nextOptions);
  };

  const lineStyleStepMiddle = () => {
    const nextOptions = clone(options);

    nextOptions.series?.forEach((series) => {
      series.interpolation = { type: "step", position: "middle" };
    });

    setOptions(nextOptions);
  };

  const lineStyleStepEnd = () => {
    const nextOptions = clone(options);

    nextOptions.series?.forEach((series) => {
      series.interpolation = { type: "step", position: "end" };
    });

    setOptions(nextOptions);
  };

  return (
    <Card {...props}>
      <div className="flex justify-center items-center uppercase ">
        Taux de Réussite
      </div>
      {/* Chart rendering here */}
      <AgCharts options={options} />
      <div className="toolbar  justify-evenly flex">
        <button onClick={lineStyleLinear}>Linear</button>
        <button onClick={lineStyleSmooth}>Smooth</button>
        <button onClick={lineStyleStepStart}>Step (Start)</button>
        <button onClick={lineStyleStepMiddle}>Step (Middle)</button>
        <button onClick={lineStyleStepEnd}>Step (End)</button>
      </div>
      <div className="flex justify-center">
        Le taux de Réussite:{"    "}
        <label className=" font-bold text-green-600 " htmlFor="">
          99%
        </label>
      </div>
    </Card>
  );
};

// Mock getData function (replace with your actual data fetching logic)
const getData = () => {
  return [
    { month: "Jan", min: 2, max: 7 },
    { month: "Feb", min: 3, max: 8 },
    { month: "Mar", min: 5, max: 12 },
    { month: "Apr", min: 7, max: 15 },
    { month: "May", min: 10, max: 18 },
    { month: "Jun", min: 13, max: 21 },
    { month: "Jul", min: 15, max: 24 },
    { month: "Aug", min: 14, max: 23 },
    { month: "Sep", min: 12, max: 20 },
    { month: "Oct", min: 9, max: 16 },
    { month: "Nov", min: 5, max: 10 },
    { month: "Dec", min: 3, max: 7 },
  ];
};

export default CardChart;
