import React from "react";
import ReactApexChart from "react-apexcharts";

// TicketGraph component
const StatusTicket = () => {
  return <div style={{ color: "white" }}>TicketGraph</div>;
};

// ApexChart class component
class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "En cours",
          data: [44, 55, 41, 67, 22, 43],
        },
        {
          name: "En attente",
          data: [13, 23, 20, 8, 13, 27],
        },
        {
          name: "Clôturer",
          data: [11, 17, 15, 15, 21, 14],
        },
      ],
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
        colors: ["#0040ff", "#ffa6a6", "#00b300"], // Définissez ici les couleurs des barres
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
            borderRadiusApplication: "end",
            borderRadiusWhenStacked: "last",
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
          type: "datetime",
          categories: [
            "01/01/2011 GMT",
            "01/02/2011 GMT",
            "01/03/2011 GMT",
            "01/04/2011 GMT",
            "01/05/2011 GMT",
            "01/06/2011 GMT",
          ],
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
          text: "Status Ticket",
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

  render() {
    return (
      <div>
        <div id="chart">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="bar"
            height={350}
          />
        </div>

        {/* Render the TicketGraph component here */}
        <StatusTicket />
      </div>
    );
  }
}

export default ApexChart;

// Si vous utilisez ReactDOM, assurez-vous d'inclure la partie de rendu où nécessaire
// const domContainer = document.querySelector('#app');
// ReactDOM.render(React.createElement(ApexChart), domContainer);
