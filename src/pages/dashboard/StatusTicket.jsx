import React from "react";
import ReactApexChart from "react-apexcharts";
import {
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { rows } from "../ticket/Data.js";

class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [],
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
        colors: ["#0040ff", "#ffa6a6", "#00b300"],
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
                  color: "#FFFFFF",
                },
              },
            },
          },
        },
        xaxis: {
          type: "datetime",
          categories: [],
          labels: {
            style: {
              colors: "#FFFFFF",
              fontSize: "12px",
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: "#FFFFFF",
            },
          },
        },
        legend: {
          position: "right",
          offsetY: 40,
          labels: {
            colors: "#FFFFFF",
          },
        },
        fill: {
          opacity: 1,
        },
      },
      selectedStatus: "all",
      selectedYear: "all",
      selectedMonth: "all",
      selectedDay: "all",
      selectedTechnician: "all",
    };
  }

  componentDidMount() {
    this.updateChartData();
  }

  prepareData(rows) {
    const {
      selectedStatus,
      selectedYear,
      selectedMonth,
      selectedDay,
      selectedTechnician,
    } = this.state;

    const groupedData = {};

    rows.forEach((row) => {
      const date = new Date(row.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // Jan is 0, Dec is 11
      const day = date.getDate();
      const status = row.statut.toLowerCase();
      const technician = row.technicien;

      const matchesFilters =
        (selectedStatus === "all" || status === selectedStatus) &&
        (selectedYear === "all" || year.toString() === selectedYear) &&
        (selectedMonth === "all" || month.toString() === selectedMonth) &&
        (selectedDay === "all" || day.toString() === selectedDay) &&
        (selectedTechnician === "all" || technician === selectedTechnician);

      if (matchesFilters) {
        const dateString = date.toISOString().split("T")[0]; // Format YYYY-MM-DD
        if (!groupedData[dateString]) {
          groupedData[dateString] = {
            Terminé: 0,
            "En cours": 0,
            "En attente": 0,
            Clôturé: 0,
          };
        }
        // Increment the appropriate status
        if (status === "terminé") groupedData[dateString]["Terminé"] += 1;
        else if (status === "en cours")
          groupedData[dateString]["En cours"] += 1;
        else if (status === "en attente")
          groupedData[dateString]["En attente"] += 1;
        else if (status === "clôturé") groupedData[dateString]["Clôturé"] += 1;
      }
    });

    const categories = Object.keys(groupedData);
    const seriesData = {
      Terminé: [],
      "En cours": [],
      "En attente": [],
      Clôturé: [],
    };

    categories.forEach((date) => {
      seriesData["Terminé"].push(groupedData[date]["Terminé"]);
      seriesData["En cours"].push(groupedData[date]["En cours"]);
      seriesData["En attente"].push(groupedData[date]["En attente"]);
      seriesData["Clôturé"].push(groupedData[date]["Clôturé"]);
    });

    return {
      series: [
        { name: "Terminé", data: seriesData["Terminé"] },
        { name: "En cours", data: seriesData["En cours"] },
        { name: "En attente", data: seriesData["En attente"] },
        { name: "Clôturé", data: seriesData["Clôturé"] },
      ],
      categories: categories,
    };
  }

  updateChartData() {
    const seriesData = this.prepareData(rows);

    this.setState({
      series: seriesData.series,
      options: {
        ...this.state.options,
        xaxis: {
          ...this.state.options.xaxis,
          categories: seriesData.categories,
        },
      },
    });
  }

  handleFilterChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value }, () => this.updateChartData());
  };

  render() {
    const years = [
      ...new Set(rows.map((row) => new Date(row.date).getFullYear())),
    ];
    const technicians = [...new Set(rows.map((row) => row.technicien))];

    return (
      <Card className="bg-gray-700 text-white">
        <CardContent>
          <Typography variant="h6" align="center" gutterBottom>
            Statut des Tickets
          </Typography>

          <div className="flex flex-row gap-x-3">
            <FormControl
              fullWidth
              margin="normal"
              variant="filled"
              sx={{ mb: 2 }}
            >
              <InputLabel style={{ color: "#FFFFFF" }}>
                Filtrer par Statut
              </InputLabel>
              <Select
                name="selectedStatus"
                value={this.state.selectedStatus}
                onChange={this.handleFilterChange}
                style={{ color: "#FFFFFF", backgroundColor: "#333333" }}
              >
                <MenuItem value="all">Tous</MenuItem>
                <MenuItem value="terminé">Terminé</MenuItem>
                <MenuItem value="en cours">En cours</MenuItem>
                <MenuItem value="en attente">En attente</MenuItem>
                <MenuItem value="clôturé">Clôturé</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              margin="normal"
              variant="filled"
              sx={{ mb: 2 }}
            >
              <InputLabel style={{ color: "#FFFFFF" }}>
                Filtrer par Année
              </InputLabel>
              <Select
                name="selectedYear"
                value={this.state.selectedYear}
                onChange={this.handleFilterChange}
                style={{ color: "#FFFFFF", backgroundColor: "#333333" }}
              >
                <MenuItem value="all">Toutes</MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              margin="normal"
              variant="filled"
              sx={{ mb: 2 }}
            >
              <InputLabel style={{ color: "#FFFFFF" }}>
                Filtrer par Mois
              </InputLabel>
              <Select
                name="selectedMonth"
                value={this.state.selectedMonth}
                onChange={this.handleFilterChange}
                style={{ color: "#FFFFFF", backgroundColor: "#333333" }}
              >
                <MenuItem value="all">Tous</MenuItem>
                {[...Array(12).keys()].map((month) => (
                  <MenuItem key={month + 1} value={month + 1}>
                    {month + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              margin="normal"
              variant="filled"
              sx={{ mb: 2 }}
            >
              <InputLabel style={{ color: "#FFFFFF" }}>
                Filtrer par Jour
              </InputLabel>
              <Select
                name="selectedDay"
                value={this.state.selectedDay}
                onChange={this.handleFilterChange}
                style={{ color: "#FFFFFF", backgroundColor: "#333333" }}
              >
                <MenuItem value="all">Tous</MenuItem>
                {[...Array(31).keys()].map((day) => (
                  <MenuItem key={day + 1} value={day + 1}>
                    {day + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              margin="normal"
              variant="filled"
              sx={{ mb: 2 }}
            >
              <InputLabel style={{ color: "#FFFFFF" }}>
                Filtrer par Technicien
              </InputLabel>
              <Select
                name="selectedTechnician"
                value={this.state.selectedTechnician}
                onChange={this.handleFilterChange}
                style={{ color: "#FFFFFF", backgroundColor: "#333333" }}
              >
                <MenuItem value="all">Tous</MenuItem>
                {technicians.map((technician) => (
                  <MenuItem key={technician} value={technician}>
                    {technician}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="bar"
            height={350}
          />
        </CardContent>
      </Card>
    );
  }
}

export default ApexChart;
