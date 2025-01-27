import React from "react";
import "./style.css"; // Assurez-vous d'avoir le fichier CSS pour l'animation
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// Sample data for the table
function createData(region, province, unite, tauxTeleExpertise) {
  return { region, province, unite, tauxTeleExpertise };
}

const rows = [
  createData("Casablanca", "Ain Diab", "Unité 1", 75),
  createData("Casablanca", "Mers Sultan", "Unité 2", 80),
  createData("Casablanca", "Mohammédia", "Unité 3", 85),
  createData("Casablanca", "Hay Hassani", "Unité 4", 70),
  createData("Casablanca", "Berkane", "Unité 5", 65),
  createData("Rabat", "Agdal", "Unité 6", 90),
  createData("Rabat", "Salé", "Unité 7", 60),
  createData("Fès", "Boujloud", "Unité 8", 50),
  createData("Marrakech", "Guéliz", "Unité 9", 95),
  createData("Tangier", "Boulevard", "Unité 10", 55),
];

// Sort the rows based on "tauxTeleExpertise" in descending order
const sortedRows = rows.sort(
  (a, b) => b.tauxTeleExpertise - a.tauxTeleExpertise
);

const TauxTeleExpertise = () => {
  return (
    <div className="px-4">
      <div className="flex justify-center">
        <h2 className="text-xl font-bold text-gray-700 flex items-center">
          TAUX DE TELEEXPERTISE PAR UNITE
          <img
            src="../../../public/images/teleExpertise/telemedecine (1).png"
            alt="Breast Screening"
            className="ml-2 w-6 h-6 animate-resize"
          />
        </h2>
      </div>

      {/* Table with transparent background */}
      <TableContainer
        component={Paper}
        className="mt-4"
        sx={{ backgroundColor: "transparent" }} // Make background transparent
      >
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Region</TableCell>
              <TableCell align="right">Province</TableCell>
              <TableCell align="right">Unité</TableCell>
              <TableCell align="right">Taux Tele Expertise</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.map((row) => (
              <TableRow
                key={row.region}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.region}
                </TableCell>
                <TableCell align="right">{row.province}</TableCell>
                <TableCell align="right">{row.unite}</TableCell>
                <TableCell align="right">{row.tauxTeleExpertise}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TauxTeleExpertise;
