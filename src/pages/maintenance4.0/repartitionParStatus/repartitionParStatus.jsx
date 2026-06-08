import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  useTheme,
  Chip
} from '@mui/material';
import axios from 'axios';

const RepartitionParStatus = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // On utilise la variable d'environnement ici
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/v1/merged-data?isClosed=false&isDeleted=false`;
        const response = await axios.get(apiUrl);
        
        setData(response.data.mergedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateStatusDistribution = (items) => {
    const statusCounts = {};
    
    items.forEach(item => {
      const status = item.status || 'Non spécifié';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return statusCounts;
  };

  const statusDistribution = calculateStatusDistribution(data);
  const total = data.length;

  // Créer un tableau trié par nombre décroissant
  const sortedStatuses = Object.entries(statusDistribution)
    .map(([status, count]) => ({
      status,
      count,
      percentage: total > 0 ? (count / total * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  // Couleurs pour les différents statuts
  const statusColors = {
    'créé': theme.palette.mode === 'dark' ? '#4c51bf' : '#6366f1',
    'en cours': theme.palette.mode === 'dark' ? '#d69e2e' : '#ecc94b',
    'résolu': theme.palette.mode === 'dark' ? '#38a169' : '#48bb78',
    'fermé': theme.palette.mode === 'dark' ? '#718096' : '#a0aec0',
    'Non spécifié': theme.palette.mode === 'dark' ? '#e53e3e' : '#f56565'
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">Erreur: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        color: theme.palette.mode === 'dark' ? '#fff' : '#333',
        mb: 3,
        fontWeight: 'bold'
      }}>
        Répartition par Statut
      </Typography>
      
      <TableContainer 
        component={Paper} 
        sx={{ 
          backgroundColor: theme.palette.mode === 'dark' ? '#1e1e2f' : '#fff',
          borderRadius: '12px',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 8px 16px 0 rgba(0,0,0,0.4)' 
            : '0 2px 8px rgba(0,0,0,0.1)',
          mb: 3
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ 
              backgroundColor: theme.palette.mode === 'dark' ? '#2d3748' : '#f5f5f5'
            }}>
              <TableCell sx={{ 
                fontWeight: 'bold', 
                color: theme.palette.mode === 'dark' ? '#fff' : '#333'
              }}>
                Statut
              </TableCell>
              <TableCell align="right" sx={{ 
                fontWeight: 'bold', 
                color: theme.palette.mode === 'dark' ? '#fff' : '#333'
              }}>
                Nombre
              </TableCell>
              <TableCell align="right" sx={{ 
                fontWeight: 'bold', 
                color: theme.palette.mode === 'dark' ? '#fff' : '#333'
              }}>
                Pourcentage
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold', 
                color: theme.palette.mode === 'dark' ? '#fff' : '#333'
              }}>
                Visualisation
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedStatuses.map(({ status, count, percentage }) => (
              <TableRow key={status}>
                <TableCell>
                  <Chip 
                    label={status} 
                    sx={{ 
                      backgroundColor: statusColors[status] || 
                        (theme.palette.mode === 'dark' ? '#4a5568' : '#cbd5e0'),
                      color: '#fff',
                      fontWeight: 'bold',
                      minWidth: '100px'
                    }} 
                  />
                </TableCell>
                <TableCell align="right" sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#333' }}>
                  {count}
                </TableCell>
                <TableCell align="right" sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#333' }}>
                  {percentage.toFixed(1)}%
                </TableCell>
                <TableCell>
                  <Box 
                    sx={{
                      height: '20px',
                      borderRadius: '4px',
                      backgroundColor: theme.palette.mode === 'dark' ? '#2d3748' : '#edf2f7',
                      overflow: 'hidden'
                    }}
                  >
                    <Box 
                      sx={{
                        height: '100%',
                        width: `${percentage}%`,
                        backgroundColor: statusColors[status] || 
                          (theme.palette.mode === 'dark' ? '#4a5568' : '#cbd5e0'),
                        transition: 'width 0.5s ease'
                      }}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ 
              backgroundColor: theme.palette.mode === 'dark' ? '#2d3748' : '#f5f5f5',
              '& td': {
                fontWeight: 'bold',
                color: theme.palette.mode === 'dark' ? '#fff' : '#333'
              }
            }}>
              <TableCell>Total</TableCell>
              <TableCell align="right">{total}</TableCell>
              <TableCell align="right">100%</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="body2" sx={{ 
        color: theme.palette.mode === 'dark' ? '#a0aec0' : '#718096',
        fontStyle: 'italic'
      }}>
        * Données basées sur {total} tickets non clôturés et non supprimés
      </Typography>
    </Box>
  );
};

export default RepartitionParStatus;