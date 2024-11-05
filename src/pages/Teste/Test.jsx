import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const Test = () => {
  const [unites, setUnites] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnites = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/unite");
        // Vérifiez que nous avons bien le tableau sous la clé `data.unites`
        if (Array.isArray(response.data.data.unites)) {
          setUnites(response.data.data.unites);
        } else {
          setError("La réponse de l'API n'est pas un tableau.");
        }
      } catch (err) {
        setError("Erreur lors de la récupération des données.");
      }
    };

    fetchUnites();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>État</TableCell>
            <TableCell>Nom</TableCell>
            <TableCell>Région</TableCell>
            <TableCell>Province</TableCell>
            <TableCell>Coordinateur</TableCell>
            <TableCell>Charge de Suivi</TableCell>
            <TableCell>Technicien</TableCell>
            <TableCell>Docteur</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Téléphone</TableCell>
            <TableCell>Latitude</TableCell>
            <TableCell>Longitude</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {unites.map((unite) => (
            <TableRow key={unite._id}>
              <TableCell>{unite._id}</TableCell>
              <TableCell>{unite.etat ? "Actif" : "Inactif"}</TableCell>
              <TableCell>{unite.name}</TableCell>
              <TableCell>{unite.region}</TableCell>
              <TableCell>{unite.province}</TableCell>
              <TableCell>{unite.coordinateur}</TableCell>
              <TableCell>{unite.chargeSuivi}</TableCell>
              <TableCell>{unite.technicien}</TableCell>
              <TableCell>{unite.docteur}</TableCell>
              <TableCell>{unite.mail}</TableCell>
              <TableCell>{unite.num}</TableCell>
              <TableCell>{unite.lat}</TableCell>
              <TableCell>{unite.long}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Test;
