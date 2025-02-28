import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  Skeleton,
} from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;
const CategorieMaintenance = React.memo(
  ({ region, province, startDate, endDate }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
      try {
        let url = `${apiUrl}/api/v1/ticketMaintenance/CategorieEquipment?isClosed=true`;

        if (region) url += `&region=${region}`;
        if (province) url += `&province=${province}`;
        if (startDate) url += `&startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;

        const response = await axios.get(url);

        if (response.data) {
          const chartData = Object.entries(response.data).map(
            ([category, percentage]) => ({
              label: `${category} (${percentage})`,
              value: parseFloat(percentage),
            })
          );
          setData(chartData);
        } else {
          setError("Les données retournées ne sont pas au bon format.");
        }
      } catch (err) {
        console.error("Erreur API:", err);
        setError("Erreur lors de la récupération des données.");
      } finally {
        setLoading(false);
      }
    }, [region, province, startDate, endDate]);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    if (loading) return <Skeleton variant="rounded" width="100%" height={90} />;
    if (error) return <div>{error}</div>;
    if (!data || data.length === 0) return <div>Aucune donnée disponible.</div>;

    const chartData = {
      labels: data.map((item) => item.label),
      datasets: [
        {
          data: data.map((item) => item.value),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#C9CBCF",
            "#8BFFF9",
          ],
        },
      ],
    };

    const options = {
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    const theme = createTheme({
      palette: {
        mode: "dark",
      },
    });

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="left"
          alignItems="center"
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "#1E1E1E",
          }}
        >
          <Box
            sx={{
              width: "50%",
              height: "240px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "12px",
            }}
          >
            <Pie data={chartData} options={options} width={400} height={200} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              ml: 4,
            }}
          >
            <Typography
              variant="h6"
              color="textPrimary"
              sx={{
                mb: 1,
                my: 1,
                mr: 3,
                fontSize: "0.72rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Tickets de Maintenance par Catégorie d'équipment
            </Typography>
            {chartData.datasets[0].backgroundColor.map((color, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                sx={{ mb: 1, ml: 2 }}
              >
                <Box
                  sx={{
                    width: 15,
                    height: 15,
                    backgroundColor: color,
                    borderRadius: "50%",
                    marginRight: 1,
                  }}
                />
                <Typography variant="body2" color="textPrimary">
                  {chartData.labels[index]}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </ThemeProvider>
    );
  }
);

export default CategorieMaintenance;
