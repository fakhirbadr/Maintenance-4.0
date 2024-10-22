import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardContent, Typography } from "@mui/material"; // Import MUI components
import { rows } from "../ticket/Data.js"; // Import your ticket data

// ApexChart class component
class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    // Prepare data based on rows
    const seriesData = this.prepareData(rows);

    this.state = {
      series: seriesData.series,
      options: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: true,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 10,
            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: "13px",
                  fontWeight: 900,
                  color: "#FFFFFF", // Change color of data label total
                },
              },
            },
          },
        },
        xaxis: {
          type: "category",
          categories: seriesData.categories,
          labels: {
            style: {
              colors: "#FFFFFF", // Change x-axis labels color to white
              fontSize: "12px",
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: "#FFFFFF", // Change y-axis labels color to white
            },
          },
        },
        legend: {
          position: "right",
          offsetY: 40,
          labels: {
            colors: "#FFFFFF", // Change legend labels color to white
          },
        },
        title: {
          text: "",
          align: "center",
          style: {
            fontSize: "19px",
            color: "white",
          },
        },
        fill: {
          opacity: 1,
        },
      },
    };
  }

  prepareData(rows) {
    const categories = [];
    const seriesData = {
      Basse: [],
      Moyenne: [],
      Élevée: [],
      Critique: [],
    };

    rows.forEach((row) => {
      const date = row.date; // Extract date
      const priority = row.priorité.toLowerCase(); // Extract priority and convert to lowercase

      if (!categories.includes(date)) {
        categories.push(date);
      }

      // Increment the count for the corresponding priority
      if (priority === "basse") seriesData.Basse.push(1);
      else if (priority === "moyenne") seriesData.Moyenne.push(1);
      else if (priority === "élevée") seriesData.Élevée.push(1);
      else if (priority === "critique") seriesData.Critique.push(1);
      else {
        seriesData.Basse.push(0);
        seriesData.Moyenne.push(0);
        seriesData.Élevée.push(0);
        seriesData.Critique.push(0);
      }
    });

    // Pad the series data to ensure they all have the same length
    const maxLength = Math.max(
      ...Object.values(seriesData).map((arr) => arr.length)
    );
    for (const key in seriesData) {
      while (seriesData[key].length < maxLength) {
        seriesData[key].push(0); // Fill with zero for missing dates
      }
    }

    return {
      series: [
        { name: "Basse", data: seriesData.Basse },
        { name: "Moyenne", data: seriesData.Moyenne },
        { name: "Élevée", data: seriesData.Élevée },
        { name: "Critique", data: seriesData.Critique },
      ],
      categories: categories,
    };
  }

  render() {
    return (
      <Card className="bg-gray-700 text-white" sx={{}}>
        <CardContent>
          <Typography variant="h6" align="center" gutterBottom>
            Nombre de Tickets & Priorité
          </Typography>
          <div id="chart">
            <ReactApexChart
              options={this.state.options}
              series={this.state.series}
              type="bar"
              height={350}
            />
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default ApexChart;
