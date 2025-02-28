import React, { useState, useEffect, useMemo, memo } from "react";
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
import { debounce } from "lodash";

// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const CategorieBesoin = memo(({ region, province, startDate, endDate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      let url = `${apiUrl}/api/v1/merged-data?isDeleted=false${
        region ? `&region=${region}` : ""
      }${province ? `&province=${province}` : ""}${
        startDate ? `&startDate=${startDate}` : ""
      }${endDate ? `&endDate=${endDate}` : ""}`;

      const response = await axios.get(url);

      if (response.data.categoryAnalysis) {
        const categoriesData = response.data.categoryAnalysis;
        const chartData = Object.entries(categoriesData).map(
          ([category, { rate }]) => ({
            label: `${category} (${rate})`,
            value: parseFloat(rate.replace("%", "")),
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
  };

  const debouncedFetchData = debounce(fetchData, 5);

  useEffect(() => {
    debouncedFetchData();
    return () => debouncedFetchData.cancel();
  }, [region, province, startDate, endDate]);

  const chartData = useMemo(() => {
    return {
      labels: data.map((item) => item.label),
      datasets: [
        {
          data: data.map((item) => item.value),
          backgroundColor: [
            "#F2DCC2",
            "#22CCF2",
            "#1EA4D9",
            "#1A80D9",
            "#A36CD9",
          ],
        },
      ],
    };
  }, [data]);

  if (loading) return <Skeleton variant="rounded" width="100%" height={90} />;
  if (error) return <div>Erreur : {error}</div>;
  if (!data || data.length === 0) return <div>Aucune donnée disponible.</div>;

  return (
    <ThemeProvider theme={createTheme({ palette: { mode: "dark" } })}>
      <CssBaseline />
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="left"
        alignItems="center"
        sx={{ width: "100%", height: "100%", backgroundColor: "#1E1E1E" }}
      >
        <Box
          sx={{
            width: "50%",
            height: "300px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingY: "12px",
            paddingLeft: "12px",
          }}
        >
          <Pie
            data={chartData}
            options={{ plugins: { legend: { display: false } } }}
            width={400}
            height={200}
          />
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
            sx={{ mb: 1, my: 1, fontSize: "0.77rem" }}
          >
            Analyse des Catégories de Besoins
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
});

export default CategorieBesoin;
