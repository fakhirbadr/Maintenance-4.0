import React from "react";
import ReactApexChart from "react-apexcharts";

const Pathologie = () => {
  const [state, setState] = React.useState({
    series: [
      {
        name: "Pathologies",
        data: [20, 25, 30, 45, 60, 80, 120, 150, 110, 70, 40, 30, 30],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 400,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 5,
          barHeight: "50%",
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + "%";
        },
        style: {
          fontSize: "12px",
          colors: ["#304758"],
        },
      },
      xaxis: {
        categories: [
          "HTA",
          "Suivi de Grossesse",
          "Lombalgies",
          "Arthrose",
          "RGO",
          "Amygdalite",
          "Goitre",
          "Pharyngite",
          "Bronchite",
          "Conjonctivite",
          "Grippe",
          "Dysthyroïdie",
          "Angines",
        ],
        labels: {
          formatter: function (val) {
            return val + "%";
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "14px",
          },
        },
      },
      // title: {
      //   text: "Répartition des pathologies en %",
      //   align: "center",
      //   style: {
      //     fontSize: "18px",
      //     fontWeight: "bolder",
      //     color: "#444",
      //   },
      // },
    },
  });

  return (
    <div className="px-4">
      <h2 className="text-xl font-bold text-gray-700 uppercase">
        Répartition des pathologies en %
      </h2>

      <ReactApexChart
        options={state.options}
        series={state.series}
        type="bar"
        height={310}
      />
    </div>
  );
};

export default Pathologie;
