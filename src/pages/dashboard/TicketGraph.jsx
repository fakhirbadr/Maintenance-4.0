import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardContent, Typography, Grid, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { rows } from "../ticket/Data.js";

const ApexChart = () => {
  const theme = useTheme();
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [series, setSeries] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [options, setOptions] = useState({
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
              colors: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
            },
          },
        },
      },
    },
    xaxis: {
      type: "category",
      categories: [],
      labels: {
        style: {
          colors: theme.palette.mode === "dark" ? "#ebf1f7" : "#141414",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.mode === "dark" ? "#ebf1f7" : "#141414",
        },
      },
    },
    legend: {
      position: "right",
      offsetY: 40,
      labels: {
        colors: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
      },
    },
    fill: {
      opacity: 1,
    },
  });

  useEffect(() => {
    extractAvailableFilters();
    updateChartData();
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    // Update axis colors based on theme
    setOptions((prevOptions) => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        labels: {
          ...prevOptions.xaxis.labels,
          style: {
            colors: theme.palette.mode === "dark" ? "#ebf1f7" : "#141414",
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        ...prevOptions.yaxis,
        labels: {
          style: {
            colors: theme.palette.mode === "dark" ? "#ebf1f7" : "#141414",
          },
        },
      },
      legend: {
        ...prevOptions.legend,
        labels: {
          colors: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
        },
      },
    }));
  }, [theme]);

  const extractAvailableFilters = () => {
    const years = new Set();
    const months = new Set();

    rows.forEach((row) => {
      const date = new Date(row.date);
      years.add(date.getFullYear());
      months.add(date.getMonth() + 1);
    });

    setAvailableYears(Array.from(years).sort());
    setAvailableMonths(Array.from(months).sort((a, b) => a - b));
  };

  const updateChartData = () => {
    const filteredRows = rows.filter((row) => {
      const date = new Date(row.date);
      const yearMatches = selectedYear
        ? date.getFullYear() === parseInt(selectedYear)
        : true;
      const monthMatches = selectedMonth
        ? date.getMonth() + 1 === parseInt(selectedMonth)
        : true;
      return yearMatches && monthMatches;
    });

    const seriesData = prepareData(filteredRows);

    setSeries(seriesData.series);
    setOptions((prevOptions) => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        categories: seriesData.categories,
      },
    }));
  };

  const prepareData = (rows) => {
    const groupedData = {};
    rows.forEach((row) => {
      const date = row.date;
      const priority = row.priorité.toLowerCase();

      if (!groupedData[date]) {
        groupedData[date] = { basse: 0, moyenne: 0, élevée: 0, critique: 0 };
      }

      if (priority === "basse") groupedData[date].basse += 1;
      else if (priority === "moyenne") groupedData[date].moyenne += 1;
      else if (priority === "élevée") groupedData[date].élevée += 1;
      else if (priority === "critique") groupedData[date].critique += 1;
    });

    const categories = Object.keys(groupedData);
    const seriesData = {
      Basse: [],
      Moyenne: [],
      Élevée: [],
      Critique: [],
    };

    categories.forEach((date) => {
      seriesData.Basse.push(groupedData[date].basse);
      seriesData.Moyenne.push(groupedData[date].moyenne);
      seriesData.Élevée.push(groupedData[date].élevée);
      seriesData.Critique.push(groupedData[date].critique);
    });

    return {
      series: [
        { name: "Basse", data: seriesData.Basse },
        { name: "Moyenne", data: seriesData.Moyenne },
        { name: "Élevée", data: seriesData.Élevée },
        { name: "Critique", data: seriesData.Critique },
      ],
      categories: categories,
    };
  };

  return (
    <Card
      className="bg-gray-700 text-white h-full"
      sx={{
        backgroundColor: theme.palette.mode === "dark" ? "" : "#b6d9fc",
        width: "100%",
        borderRadius: "12px",
      }}
    >
      <CardContent>
        <Typography variant="h6" align="center" gutterBottom>
          Nombre de Tickets & Priorité ({rows.length})
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              select
              label="Année"
              name="selectedYear"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              fullWidth
              SelectProps={{
                native: true,
              }}
              variant="outlined"
            >
              <option value=""></option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              label="Mois"
              name="selectedMonth"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              fullWidth
              SelectProps={{
                native: true,
              }}
              variant="outlined"
            >
              <option value=""></option>
              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {month.toString().padStart(2, "0")}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <div id="chart">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ApexChart;
