import React from "react";
import ReactApexChart from "react-apexcharts";

// TicketGraph component
const TicketGraph = () => {
  return <div style={{ color: "white" }}>TicketGraph</div>;
};

// ApexChart class component
class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Basse  ",
          data: [44, 55, 41, 67, 22, 43],
        },
        {
          name: "Moyenne",
          data: [13, 23, 20, 8, 13, 27],
        },
        {
          name: "Élevée",
          data: [11, 17, 15, 15, 21, 14],
        },
        {
          name: "Critique",
          data: [21, 7, 25, 13, 22, 8],
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
          text: "Nombre de Tickets & Priorité ",
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
        <div id="html-dist"></div>
        {/* Render the TicketGraph component here */}
        <TicketGraph />
      </div>
    );
  }
}

export default ApexChart;

// If you are using ReactDOM, ensure to include the rendering part where needed
// const domContainer = document.querySelector('#app');
// ReactDOM.render(React.createElement(ApexChart), domContainer);
