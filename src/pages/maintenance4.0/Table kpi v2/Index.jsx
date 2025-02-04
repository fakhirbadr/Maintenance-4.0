import React, { useEffect, useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useTheme } from "@mui/material/styles";
import DialogListEquipmentStructure from "./DialogListEquipmentStructure";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

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

const getMappedValue = (data, metric, column) => {
  if (column === "Non catégorisé") return data[metric]["Non catégorisé"] || 0;
  const categories = categoryMapping[column];
  return (
    categories?.reduce((sum, cat) => sum + (data[metric][cat] || 0), 0) || 0
  );
};

const EquipmentModal = ({ open, onClose, category, data }) => {
  if (!category || !data) return null;

  const categoryData = data.countsByCategory[category] || {};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Détails de la catégorie : {category}</DialogTitle>
      <DialogContent>
        <List>
          {Object.entries(categoryData).map(([equipment, count]) => (
            <ListItem key={equipment}>
              <ListItemText
                primary={equipment}
                secondary={`Nombre de demandes : ${count}`}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Index = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const [apiData, setApiData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/v1/merged-data?isDeleted=false`
        );
        const data = await response.json();
        setApiData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const formatValue = (value, isPercentage = false) => {
    if (typeof value === "string") return value;
    if (isPercentage) return `${value.toFixed(2)}%`;
    return Number.isInteger(value)
      ? value.toString()
      : value?.toFixed(1) || "-";
  };

  const handleEyeClick = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  if (!apiData) return <div>Loading...</div>;

  const rows = [
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

  return (
    <Box
      sx={{
        overflow: "auto",
        backgroundColor: theme.palette.background.default,
        p: 2,
      }}
    >
      <TableContainer
        component={Paper}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          "& .MuiTableCell-root": {
            px: 2,
            py: 1.5,
            color: theme.palette.text.primary,
          },
        }}
      >
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: isDarkMode
                  ? theme.palette.primary.dark
                  : theme.palette.primary.main,
                "& th": {
                  color: theme.palette.common.white,
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                },
              }}
            >
              <TableCell sx={{ borderRadius: "8px 0 0 0" }}>Métrique</TableCell>
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
                  "&:last-child td": { borderBottom: 0 },
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.primary.light,
                  }}
                >
                  {row.name}
                </TableCell>

                {row.data.map((value, index) => (
                  <TableCell key={index} align="center">
                    <Typography variant="body2" fontWeight="500">
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
                      "&:hover": {
                        backgroundColor: theme.palette.primary.light,
                      },
                    }}
                    onClick={() => handleEyeClick(columns[index])}
                  >
                    <RemoveRedEyeIcon
                      fontSize="small"
                      color="primary"
                      sx={{ opacity: 0.8 }}
                    />
                  </IconButton>
                </TableCell>
              ))}
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <DialogListEquipmentStructure
        openFour={isModalOpen}
        hundleCloseFour={() => setIsModalOpen(false)}
        category={selectedCategory} // Passer la catégorie sélectionnée
        region="" // Ajouter si nécessaire
        province="" // Ajouter si nécessaire
        startDate="" // Ajouter si nécessaire
        endDate="" // Ajouter si nécessaire
      />
    </Box>
  );
};

export default Index;
