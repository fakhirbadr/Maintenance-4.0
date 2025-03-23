import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  Fade,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useTheme, alpha } from "@mui/material/styles";
import DialogListEquipmentStructure from "./DialogListEquipmentStructure";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

// Memoized category mapping
const categoryMapping = {
  "Dispositif Médicaux": ["Dispositif Médicaux"],
  "Matériel Informatique": ["Matériel Informatique"],
  "équipement généreaux": ["équipement généreaux"],
  "Structure Bâtiment": ["Structure Bâtiment", "Structure"],
  Connexion: ["Connexion", "SATELITE"],
  Fourniture: ["Fourniture"],
};

const columns = [
  "Dispositif Médicaux",
  "Matériel Informatique",
  "équipement généreaux",
  "Structure Bâtiment",
  "Connexion",
  "Fourniture",
];

// Memoized utility function
const getMappedValue = (data, metric, column) => {
  if (column === "Non catégorisé") return data[metric]["Non catégorisé"] || 0;
  const categories = categoryMapping[column];
  return (
    categories?.reduce((sum, cat) => sum + (data[metric][cat] || 0), 0) || 0
  );
};

const Index = ({ region, province, startDate, endDate, onTotalClosed }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [apiData, setApiData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized URL params to prevent unnecessary re-renders
  const urlParams = useMemo(() => {
    const params = new URLSearchParams();
    params.append("isDeleted", "false");
    if (region) params.append("region", region);
    if (province) params.append("province", province);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return params.toString();
  }, [region, province, startDate, endDate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${apiUrl}/api/v1/merged-data?${urlParams}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setApiData(data);

        // Appeler la fonction de rappel pour passer totalClosed au parent
        if (data.globalStats && onTotalClosed) {
          onTotalClosed(data.globalStats.totalClosed);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [urlParams, onTotalClosed]);

  const formatValue = useCallback((value, isPercentage = false) => {
    if (typeof value === "string") return value;
    if (isPercentage) return `${value.toFixed(2)}%`;
    return Number.isInteger(value)
      ? value.toString()
      : value?.toFixed(1) || "-";
  }, []);

  const handleEyeClick = useCallback((category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  }, []);

  // Memoized rows calculation to prevent recalculation on each render
  const rows = useMemo(() => {
    if (!apiData) return [];

    return [
      {
        name: "Besoin exprimé",
        data: columns.map((col) =>
          getMappedValue(apiData, "countsByCategory", col)
        ),
        total: apiData.globalStats.totalTickets,
      },
      {
        name: "Besoin satisfait",
        data: columns.map((col) =>
          getMappedValue(apiData, "closedCountsByCategory", col)
        ),
        total: apiData.globalStats.totalClosed,
      },
      {
        name: "Delai en jours (Besoin satisfait)",
        data: columns.map(
          (col) => apiData.avgResolutionTimeByCategory[col] || "-"
        ),
        total: apiData.globalStats.avgResolutionTime,
      },
      {
        name: "Taux de satisfaction",
        data: columns.map((col) => {
          const closed = getMappedValue(apiData, "closedCountsByCategory", col);
          const total = getMappedValue(apiData, "countsByCategory", col);
          return total > 0 ? `${((closed / total) * 100).toFixed(2)}%` : "-";
        }),
        total: apiData.globalStats.satisfactionRate,
      },
      {
        name: "Besoins restants",
        data: columns.map((col) =>
          getMappedValue(apiData, "openCountsByCategory", col)
        ),
        total: apiData.globalStats.totalOpen,
      },
      {
        name: "Âge moyen (Besoins restants)",
        data: columns.map((col) => apiData.avgAgeByCategory[col] || "-"),
        total: apiData.globalStats.avgOpenAge,
      },
    ];
  }, [apiData]);

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: "center", color: theme.palette.error.main }}>
        <Typography variant="h6">
          Erreur de chargement des données: {error}
        </Typography>
      </Box>
    );
  }

  // Loading skeletons for better UX
  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={50}
          sx={{ mb: 1, borderRadius: 1 }}
        />
        {[1, 2, 3, 4, 5, 6].map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width="100%"
            height={40}
            sx={{
              mb: 0.5,
              borderRadius: 1,
              opacity: 1 - i * 0.1,
            }}
          />
        ))}
      </Box>
    );
  }

  return (
    <Fade in={!loading} timeout={500}>
      <Box
        sx={{
          overflow: "auto",
          backgroundColor: theme.palette.background.default,
          p: 2,
          transition: "all 0.3s ease-in-out",
        }}
      >
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            transition: "box-shadow 0.3s ease",
            "&:hover": {
              boxShadow: `0 6px 12px ${alpha(
                theme.palette.primary.main,
                0.15
              )}`,
            },
            "& .MuiTableCell-root": {
              px: { xs: 1, sm: 2 },
              py: 1.5,
              color: theme.palette.text.primary,
              transition: "background-color 0.2s ease",
            },
          }}
        >
          <Table sx={{ minWidth: 800 }} size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: isDarkMode
                    ? theme.palette.primary.dark
                    : theme.palette.primary.main,
                  "& th": {
                    color: theme.palette.common.white,
                    fontWeight: "bold",
                    fontSize: { xs: "0.85rem", sm: "0.95rem" },
                    whiteSpace: "nowrap",
                  },
                }}
              >
                <TableCell sx={{ borderRadius: "8px 0 0 0" }}>
                  Métrique
                </TableCell>
                {columns.map((col) => (
                  <TableCell key={col} align="center">
                    {col}
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ borderRadius: "0 8px 0 0" }}>
                  Total
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow
                  key={row.name}
                  sx={{
                    backgroundColor:
                      rowIndex % 2 === 0
                        ? theme.palette.action.hover
                        : "transparent",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.light, 0.05),
                    },
                    "&:last-child td": { borderBottom: 0 },
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.primary.light,
                      borderLeft: `3px solid ${theme.palette.primary.main}`,
                    }}
                  >
                    {row.name}
                  </TableCell>

                  {row.data.map((value, index) => (
                    <TableCell key={index} align="center">
                      <Typography
                        variant="body2"
                        fontWeight="500"
                        sx={{
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        {formatValue(value, row.name.includes("Taux"))}
                      </Typography>
                      {typeof value === "number" &&
                        row.name !== "Taux de satisfaction" && (
                          <Typography
                            variant="caption"
                            display="block"
                            color="text.secondary"
                          >
                            ({formatValue((value / row.total) * 100, true)})
                          </Typography>
                        )}
                    </TableCell>
                  ))}

                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: theme.palette.grey[700],
                      fontWeight: "bold",
                      color: theme.palette.common.white,
                    }}
                  >
                    {formatValue(row.total, row.name.includes("Taux"))}
                  </TableCell>
                </TableRow>
              ))}

              <TableRow
                sx={{
                  "& td": {
                    borderTop: `2px solid ${theme.palette.divider}`,
                    py: 0.5,
                  },
                }}
              >
                <TableCell />
                {columns.map((_, index) => (
                  <TableCell key={index} align="center">
                    <IconButton
                      size="small"
                      sx={{
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.1
                          ),
                          transform: "scale(1.1)",
                        },
                      }}
                      onClick={() => handleEyeClick(columns[index])}
                    >
                      <RemoveRedEyeIcon
                        fontSize="small"
                        color="primary"
                        sx={{
                          opacity: 0.8,
                          transition: "opacity 0.2s",
                          "&:hover": {
                            opacity: 1,
                          },
                        }}
                      />
                    </IconButton>
                  </TableCell>
                ))}
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {isModalOpen && (
          <DialogListEquipmentStructure
            openFour={isModalOpen}
            hundleCloseFour={() => setIsModalOpen(false)}
            categorie={selectedCategory}
            region={region}
            province={province}
            startDate={startDate}
            endDate={endDate}
          />
        )}
      </Box>
    </Fade>
  );
};

export default React.memo(Index);
