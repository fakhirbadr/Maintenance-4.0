import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import {
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material"; // Import Select and other necessary components
import "./MttrCard.css"; // Import CSS file
import { rows } from "./dataMttr"; // Import repair data

const MttrCard = () => {
  const [selectedUnit, setSelectedUnit] = useState(""); // State for the selected unit
  const [selectedMonth, setSelectedMonth] = useState(""); // State for the selected month
  const [selectedYear, setSelectedYear] = useState(""); // State for the selected year
  const [filteredRows, setFilteredRows] = useState(rows); // State for filtered rows

  // Function to convert "X heures" to a number (parseFloat)
  const convertMttr = (mttrString) => parseFloat(mttrString.split(" ")[0]);

  // UseEffect to update filteredRows based on the selected unit, month, and year
  useEffect(() => {
    let filtered = rows;

    if (selectedUnit) {
      filtered = filtered.filter((row) => row.nomUnite === selectedUnit);
    }

    if (selectedMonth) {
      filtered = filtered.filter((row) => {
        const month = new Date(row.dateReparation).toLocaleString("default", {
          month: "long",
        });
        return month === selectedMonth;
      });
    }

    if (selectedYear) {
      filtered = filtered.filter(
        (row) => row.annee.toString() === selectedYear
      ); // Filter by year using the annee property
    }

    setFilteredRows(filtered);
  }, [selectedUnit, selectedMonth, selectedYear]);

  // Extract MTTR and repair dates from filteredRows
  const mttrData = filteredRows.map((row) => convertMttr(row.mttr));
  const datesReparation = filteredRows.map((row) => row.dateReparation);

  // Calculate average MTTR
  const averageMttr =
    mttrData.reduce((acc, curr) => acc + curr, 0) / mttrData.length || 0;

  const [chartData, setChartData] = useState({
    series: [
      {
        name: "MTTR (heures)",
        data: mttrData,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
      },
      stroke: {
        width: 5,
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: datesReparation,
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
            fontSize: "12px",
          },
        },
      },
      title: {
        text: `Temps moyen de réparation (MTTR): ${averageMttr.toFixed(
          2
        )} heures`,
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
          stops: [0, 100],
        },
      },
      tooltip: {
        theme: "dark",
      },
      legend: {
        labels: {
          colors: "#FFFFFF",
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#FF5733"],
        },
      },
    },
  });

  // Update chart data whenever filteredRows change
  useEffect(() => {
    setChartData({
      series: [
        {
          name: "MTTR (heures)",
          data: mttrData,
        },
      ],
      options: {
        ...chartData.options,
        xaxis: {
          ...chartData.options.xaxis,
          categories: datesReparation,
        },
        title: {
          ...chartData.options.title,
          text: `Temps moyen de réparation (MTTR): ${averageMttr.toFixed(
            2
          )} heures`,
        },
      },
    });
  }, [filteredRows, mttrData, datesReparation, averageMttr]);

  // Create a unique list of unit names
  const uniqueUnits = Array.from(new Set(rows.map((row) => row.nomUnite)));

  // Create a unique list of months from dateReparation
  const uniqueMonths = Array.from(
    new Set(
      rows.map((row) =>
        new Date(row.dateReparation).toLocaleString("default", {
          month: "long",
        })
      )
    )
  );

  // Create a unique list of years from the annee property
  const uniqueYears = Array.from(new Set(rows.map((row) => row.annee))).sort(); // Sorting for better UX

  return (
    <Card className="bg-gray-700 text-white w-full">
      <div className="flex justify-between">
        <FormControl
          variant="outlined"
          size="small"
          style={{ margin: "10px", minWidth: "200px" }}
        >
          <InputLabel>Filtrer par nom d'unité</InputLabel>
          <Select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)} // Update selected unit on change
            label="Filtrer par nom d'unité"
          >
            <MenuItem value="">Tous les unités</MenuItem>{" "}
            {/* Option to show all units */}
            {uniqueUnits.map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          variant="outlined"
          size="small"
          style={{ margin: "10px", minWidth: "200px" }}
        >
          <InputLabel>Filtrer par mois</InputLabel>
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)} // Update selected month on change
            label="Filtrer par mois"
          >
            <MenuItem value="">Tous les mois</MenuItem>{" "}
            {/* Option to show all months */}
            {uniqueMonths.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          variant="outlined"
          size="small"
          style={{ margin: "10px", minWidth: "200px" }}
        >
          <InputLabel>Filtrer par année</InputLabel>
          <Select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              console.log("Selected Year:", e.target.value); // Log the selected year
            }} // Update selected year on change
            label="Filtrer par année"
          >
            <MenuItem value="">Toutes les années</MenuItem>{" "}
            {/* Option to show all years */}
            {uniqueYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <CardContent>
        <div id="chart" className="w-[100%] h-[100%]">
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="line"
            height={480}
            width={900}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MttrCard;
