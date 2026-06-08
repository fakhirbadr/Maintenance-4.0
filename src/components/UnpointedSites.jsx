import React from 'react';
import {
  Typography, CircularProgress, Table, TableBody, TableCell, TableHead,
  TableRow, Alert, Card, CardContent, Paper, TableContainer
} from "@mui/material";

const UnpointedSites = ({ sites, loading }) => {
  if (loading) {
    return (
      <Card sx={{ mt: 4, backgroundColor: 'background.paper', border: '1px solid #444' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <CircularProgress size={30} />
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Calcul des unités manquantes...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mt: 4, backgroundColor: 'background.paper', border: '1px solid #444' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Unités n'ayant pas fait le pointage ({sites.length})
        </Typography>
        {sites.length > 0 ? (
          <TableContainer component={Paper} sx={{ maxHeight: '40vh', backgroundColor: 'background.default' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: 'secondary.dark', fontWeight: 'bold' }}>Site</TableCell>
                  <TableCell sx={{ backgroundColor: 'secondary.dark', fontWeight: 'bold' }}>Région</TableCell>
                  <TableCell sx={{ backgroundColor: 'secondary.dark', fontWeight: 'bold' }}>Province</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sites.map(site => (
                  <TableRow key={site._id} hover>
                    <TableCell>{site.name}</TableCell>
                    <TableCell>{site.region}</TableCell>
                    <TableCell>{site.province}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="success" sx={{ mt: 2 }}>
            Toutes les unités pour les filtres sélectionnés ont fait leur pointage.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default UnpointedSites;