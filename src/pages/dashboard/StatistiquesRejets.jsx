import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import axios from "axios";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";

const apiUrl = import.meta.env.VITE_API_URL;

const COLORS = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4'];

const StatistiquesRejets = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/api/v1/fournitureRoutes/stats/rejections`);
        setStats(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent>
          <Typography color="error">Erreur lors du chargement des statistiques</Typography>
        </CardContent>
      </Card>
    );
  }

  const { topReasons, rejectsByCategory, rejectsByUser, rejectsByProvince, rejectsByMonth, globalStats } = stats;

  // Préparer les données pour le graphique des raisons
  const topReasonsData = topReasons.slice(0, 5).map(item => ({
    raison: item._id.length > 30 ? item._id.substring(0, 30) + '...' : item._id,
    count: item.count,
    fullReason: item._id
  }));

  // Préparer les données pour le pie chart des catégories
  const categoryData = rejectsByCategory.slice(0, 6).map(item => ({
    name: item._id || 'Non spécifié',
    value: item.count
  }));

  // Préparer les données pour les rejets par mois
  const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  const monthlyData = rejectsByMonth.map(item => ({
    month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
    count: item.count
  }));

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="error" sx={{ mb: 3 }}>
        📊 Statistiques des Rejets de Commandes
      </Typography>

      {/* Statistiques globales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: theme.palette.mode === 'dark' ? '#1e1e2d' : '#fff3e0' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <ErrorOutlineIcon sx={{ color: '#f44336', fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="#f44336">
                    {globalStats.totalRejected}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total rejetées
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: theme.palette.mode === 'dark' ? '#1e1e2d' : '#e8f5e9' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingUpIcon sx={{ color: '#4caf50', fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="#4caf50">
                    {globalStats.rejectionRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Taux de rejet
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: theme.palette.mode === 'dark' ? '#1e1e2d' : '#e3f2fd' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <CategoryIcon sx={{ color: '#2196f3', fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="#2196f3">
                    {rejectsByCategory.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Catégories impactées
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: theme.palette.mode === 'dark' ? '#1e1e2d' : '#fce4ec' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <ErrorOutlineIcon sx={{ color: '#e91e63', fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="#e91e63">
                    {globalStats.recentRejections}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cette semaine
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Graphiques */}
      <Grid container spacing={3}>
        {/* Top 5 Raisons de rejet */}
        <Grid item xs={12} lg={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                🔝 Top 5 Motifs de Rejet
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topReasonsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="raison" angle={-15} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <Box sx={{ bgcolor: 'background.paper', p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
                            <Typography variant="body2" fontWeight="bold">
                              {payload[0].payload.fullReason}
                            </Typography>
                            <Typography variant="body2" color="error">
                              {payload[0].value} rejets
                            </Typography>
                          </Box>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#f44336" name="Nombre de rejets" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Rejets par catégorie (Pie Chart) */}
        <Grid item xs={12} lg={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                📦 Rejets par Catégorie
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Évolution mensuelle */}
        {monthlyData.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  📈 Évolution des Rejets (6 derniers mois)
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#f44336" strokeWidth={2} name="Rejets" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Liste des responsables ayant rejeté */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                👤 Rejets par Responsable
              </Typography>
              <List>
                {rejectsByUser.slice(0, 5).map((user, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <PersonIcon sx={{ color: '#2196f3' }} />
                            <Typography fontWeight="medium">{user._id || 'Non spécifié'}</Typography>
                          </Box>
                        }
                        secondary={
                          <Box display="flex" gap={1} mt={0.5}>
                            <Chip label={`${user.count} rejets`} size="small" color="error" />
                            {user.categories && user.categories.map((cat, i) => (
                              <Chip key={i} label={cat} size="small" variant="outlined" />
                            ))}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < rejectsByUser.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Rejets par province */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                📍 Rejets par Province
              </Typography>
              <List>
                {rejectsByProvince.slice(0, 5).map((prov, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={prov._id || 'Non spécifié'}
                        secondary={
                          <Chip label={`${prov.count} rejets`} size="small" color="error" sx={{ mt: 0.5 }} />
                        }
                      />
                    </ListItem>
                    {index < rejectsByProvince.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatistiquesRejets;
