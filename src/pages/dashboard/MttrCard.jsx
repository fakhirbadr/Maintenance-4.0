import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import "./MttrCard.css"; // Importez le fichier CSS

const MttrCard = () => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Sales",
        data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
      },

      forecastDataPoints: {
        count: 7,
      },
      stroke: {
        width: 5,
        curve: "smooth",
      },

      xaxis: {
        type: "datetime",
        categories: [
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
        ],
        tickAmount: 17,
        labels: {
          style: {
            colors: "#FFFFFF", // Change the color of the x-axis date labels here
            fontSize: "12px",
          },
          formatter: function (value, timestamp, opts) {
            return opts.dateFormatter(new Date(timestamp), "dd MMM");
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#FFFFFF", // Change the color of the y-axis labels here
            fontSize: "12px",
          },
        },
      },
      title: {
        text: "Temps moyen de réparation",
        align: "center",
        style: {
          fontSize: "19px",
          color: "white",
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#FDD835"],
          shadeIntensity: 1,
          type: "horizontal",
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100],
        },
      },
      tooltip: {
        theme: "dark", // Change the tooltip to dark theme
        style: {
          fontSize: "12px",
          color: "#FFFFFF", // Change tooltip text color
        },
      },
      legend: {
        labels: {
          colors: "#000000", // Change the text color of the legend
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#FF5733"], // Change the color of the data labels (numbers) here
        },
      },
    },
  });

  return (
    <div className="p-4   text-white w-[100%]  bg-gray-700 rounded-3xl">
      <div id="chart" className="w-[100%] h-[100%]">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={480} // Ajuste la hauteur
          width={900} // Ajuste la largeur
        />
      </div>
    </div>
  );
};

export default MttrCard;
