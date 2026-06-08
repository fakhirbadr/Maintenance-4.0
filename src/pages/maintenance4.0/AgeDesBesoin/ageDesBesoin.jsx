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
  useTheme
} from '@mui/material';
import axios from 'axios';

const AgeDesBesoin = () => {
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

  const calculateAgeGroups = (items) => {
    const now = new Date();
    const ageGroups = {
      lessThan10: 0,
      between10And20: 0,
      between20And30: 0,
      moreThan30: 0
    };

    items.forEach(item => {
      const createdAt = new Date(item.createdAt);
      const diffInDays = (now - createdAt) / (1000 * 60 * 60 * 24);
      
      if (diffInDays < 10) {
        ageGroups.lessThan10++;
      } else if (diffInDays >= 10 && diffInDays < 20) {
        ageGroups.between10And20++;
      } else if (diffInDays >= 20 && diffInDays < 30) {
        ageGroups.between20And30++;
      } else {
        ageGroups.moreThan30++;
      }
    });

    return ageGroups;
  };

  const ageGroups = calculateAgeGroups(data);
  const total = data.length;

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
        Âge des Besoins
      </Typography>
      
      <TableContainer 
        component={Paper} 
        sx={{ 
          backgroundColor: theme.palette.mode === 'dark' ? '#1e1e2f' : '#fff',
          borderRadius: '12px',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 8px 16px 0 rgba(0,0,0,0.4)' 
            : '0 2px 8px rgba(0,0,0,0.1)'
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
                Tranche d'âge
              </TableCell>
              <TableCell align="right" sx={{ 
                fontWeight: 'bold', 
                color: theme.palette.mode === 'dark' ? '#fff' : '#333'
              }}>
                Nombre de tickets
              </TableCell>
              <TableCell align="right" sx={{ 
                fontWeight: 'bold', 
                color: theme.palette.mode === 'dark' ? '#fff' : '#333'
              }}>
                Pourcentage
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#a5b4fc' : '#6366f1' }}>
                Moins de 10 jours
              </TableCell>
              <TableCell align="right" sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#333' }}>
                {ageGroups.lessThan10}
              </TableCell>
              <TableCell align="right" sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#333' }}>
                {total > 0 ? ((ageGroups.lessThan10 / total * 100).toFixed(1) + '%') : '0%'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#a5b4fc' : '#6366f1' }}>
                Entre 10 et 20 jours
              </TableCell>
              <TableCell align="right" sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#333' }}>
                {ageGroups.between10And20}
              </TableCell>
              <TableCell align="right" sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#333' }}>
                {total > 0 ? ((ageGroups.between10And20 / total * 100).toFixed(1) + '%') : '0%'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#a5b4fc' : '#6366f1' }}>
                Entre 20 et 30 jours
              </TableCell>
              <TableCell align="right" sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#333' }}>
                {ageGroups.between20And30}
              </TableCell>
              <TableCell align="right" sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#333' }}>
                {total > 0 ? ((ageGroups.between20And30 / total * 100).toFixed(1) + '%') : '0%'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#a5b4fc' : '#6366f1' }}>
                Plus de 30 jours
              </TableCell>
              <TableCell align="right" sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#333' }}>
                {ageGroups.moreThan30}
              </TableCell>
              <TableCell align="right" sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#333' }}>
                {total > 0 ? ((ageGroups.moreThan30 / total * 100).toFixed(1) + '%') : '0%'}
              </TableCell>
            </TableRow>
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
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AgeDesBesoin;