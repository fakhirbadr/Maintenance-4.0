import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import {
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
} from "@mui/material";
import "./MttrCard.css";
import { rows } from "./dataMttr";

const MttrCard = () => {
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [filteredRows, setFilteredRows] = useState(rows);

  const theme = useTheme();

  // Fonction pour convertir "X heures" en nombre (parseFloat)
  const convertMttr = (mttrString) => parseFloat(mttrString.split(" ")[0]);

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
      );
    }
    setFilteredRows(filtered);
  }, [selectedUnit, selectedMonth, selectedYear]);

  const mttrData = filteredRows.map((row) => convertMttr(row.mttr));
  const datesReparation = filteredRows.map((row) => row.dateReparation);
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
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
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

  useEffect(() => {
    setChartData((prevData) => ({
      ...prevData,
      options: {
        ...prevData.options,
        xaxis: {
          ...prevData.options.xaxis,
          labels: {
            style: {
              colors: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
              fontSize: "12px",
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
              fontSize: "12px",
            },
          },
        },
        title: {
          ...prevData.options.title,
          text: `Temps moyen de réparation (MTTR): ${averageMttr.toFixed(
            2
          )} heures`,
          style: {
            fontSize: "19px",
            colors: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
          },
        },
      },
    }));
  }, [filteredRows, theme.palette.mode]);

  const uniqueUnits = Array.from(new Set(rows.map((row) => row.nomUnite)));
  const uniqueMonths = Array.from(
    new Set(
      rows.map((row) =>
        new Date(row.dateReparation).toLocaleString("default", {
          month: "long",
        })
      )
    )
  );
  const uniqueYears = Array.from(new Set(rows.map((row) => row.annee))).sort();

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.mode === "dark" ? "" : "#b6d9fc",
        width: "100% ",
        borderRadius: "12px",
      }}
      className="  text-white w-full"
    >
      <div className="flex justify-between ">
        <FormControl
          variant="outlined"
          size="small"
          style={{ margin: "10px", minWidth: "200px" }}
        >
          <InputLabel>Filtrer par nom d'unité</InputLabel>
          <Select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)} // Mettre à jour l'unité sélectionnée en cas de changement
            label="Filtrer par nom d'unité"
          >
            <MenuItem value="">Tous les unités</MenuItem>{" "}
            {/* Option pour montrer toutes les unités */}
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
            onChange={(e) => setSelectedMonth(e.target.value)} // Mettre à jour le mois sélectionné en cas de changement
            label="Filtrer par mois"
          >
            <MenuItem value="">Tous les mois</MenuItem>{" "}
            {/* Option pour montrer tous les mois */}
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
              console.log("Année sélectionnée :", e.target.value); // Afficher l'année sélectionnée
            }} // Mettre à jour l'année sélectionnée en cas de changement
            label="Filtrer par année"
          >
            <MenuItem value="">Toutes les années</MenuItem>{" "}
            {/* Option pour montrer toutes les années */}
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
