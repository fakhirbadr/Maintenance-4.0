import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Typography,
  ThemeProvider,
  CssBaseline,
  createTheme,
  Skeleton,
} from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

ChartJS.register(ArcElement, Tooltip, Legend);

const TauxDisponibilité = () => {
  const [tauxDispo, setTauxDispo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/actifs/taux`, { signal });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTauxDispo(data);
        setError(null);
        hasFetchedRef.current = true;
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching data:", error);
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, []);

  const chartData = useMemo(() => {
    if (!tauxDispo) return null;

    const categories = Object.keys(tauxDispo);
    const taux = Object.values(tauxDispo).map((taux) =>
      parseFloat(taux.replace("%", ""))
    );

    return {
      labels: categories,
      datasets: [
        {
          label: "Disponibilité des équipements",
          data: taux,
          backgroundColor: [
            "#13678A",
            "#45C4B0",
            "#9AEBA3",
            "#DAFDBA",
            "#FFADAD",
            // "#A0C4FF",
          ],
          hoverOffset: 4,
        },
      ],
    };
  }, [tauxDispo]);

  if (loading) {
    return <Skeleton variant="rounded" width="100%" height={90} />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

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
            height: "240px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "12px",
          }}
        >
          {chartData && (
            <Pie
              data={chartData}
              options={{ plugins: { legend: { display: false } } }}
              width={400}
              height={200}
            />
          )}
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
              fontSize: "0.74rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Taux de Disponibilité par Catégorie d'équipement
          </Typography>
          {chartData?.datasets[0].backgroundColor.map((color, index) => (
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
                {chartData.labels[index]}: {chartData.datasets[0].data[index]}%
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default TauxDisponibilité;
