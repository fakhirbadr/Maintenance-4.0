import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import axios from "axios";
import "./GlobalGraph.css"; // Importation du fichier CSS
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import { useEffect, useState } from "react";
import DialogListEquipment from "./DialogListEquipment";
import DialogListEquipmentInfo from "./DialogListEquipmentInfo";
import DialogListEquipmentGeneraux from "./DialogListEquipmentGeneraux";
import DialogListEquipmentStructure from "./DialogListEquipmentStructure";

const GlobalGraph = ({ region, province, startDate, endDate }) => {
  const [data, setData] = React.useState([]); // Store the actual data
  const [fournitures, setFournitures] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalClosed, setTotalClosed] = useState(0);
  const [closedCategoryCounts, setClosedCategoryCounts] = useState([]);
  const [closureRate, setClosureRate] = useState(0);
  const [inclosedCategoryCounts, setInclosedCategoryCounts] = useState([]);
  const [totalInclosed, setTotalInclosed] = useState([]);
  const [open, setOpen] = useState(false);
  const [openTwo, setOpenTwo] = useState(false);
  const [openthree, setOpenthree] = useState(false);
  const [openFour, setOpenFour] = useState(false);
  const [regions, setRegions] = useState([]); // Liste des régions depuis l'API

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenTwo = () => setOpenTwo(true);
  const handleCloseTwo = () => setOpenTwo(false);

  const handleOpenthree = () => setOpenthree(true);
  const handleClosethree = () => setOpenthree(false);

  const hundleOpenFour = () => setOpenFour(true);
  const hundleCloseFour = () => setOpenFour(false);

  // Fonction pour convertir les millisecondes en format dd:hh:mm
  const formatTime = (milliseconds) => {
    const totalMinutes = Math.floor(milliseconds / 60000); // Convertir en minutes
    const days = Math.floor(totalMinutes / 1440); // Nombre de jours
    const hours = Math.floor((totalMinutes % 1440) / 60); // Nombre d'heures
    const minutes = totalMinutes % 60; // Nombre de minutes restantes

    // Retourner le format sous forme de chaîne
    return `${days}:${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };
  // Fonction pour récupérer les données sans filtres
  // Fonction pour récupérer les données avec filtres
  const fetchData = async () => {
    try {
      const params = {
        region,
        province,
        startDate,
        endDate,
      };

      const response = await axios.get(
        "https://backend-v1-1.onrender.com/api/v1/fournitureRoutes",
        { params } // Envoyer les filtres comme paramètres d'URL
      );

      // Mettez à jour l'état avec les données récupérées
      setFournitures(response.data.fournitures);
      setCategoryCounts(response.data.categoryCounts);
      setTotal(response.data.total);
      setTotalClosed(response.data.totalClosed);
      setClosureRate(response.data.closureRate);
      setInclosedCategoryCounts(response.data.inclosedCategoryCounts);
      setTotalInclosed(response.data.totalInclosed);
      setClosedCategoryCounts(response.data.closedCategoryCounts);
      setData(response.data); // Store the actual response data
      console.log("API Responsewwwwwww:", response.data.categoryCounts);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  // useEffect pour appeler fetchData chaque fois que les filtres changent
  useEffect(() => {
    fetchData();
  }, [region, province, startDate, endDate]);

  // Appeler la fonction fetchData au montage du composant
  React.useEffect(() => {
    fetchData(); // Fetch without filters
  }, []);

  // Create rows dynamically based on the filtered data
  const rows = [
    {
      name: "besoin exprimé",
      data: [
        [
          data.length,
          categoryCounts.find((cat) => cat._id === "Dispositif Médicaux")
            ?.count || 0,
        ], // Dispositif Médicaux
        [
          data.length,
          categoryCounts.find((cat) => cat._id === "Matériel Informatique")
            ?.count || 0,
        ], // Matériel Informatique
        [
          data.length,
          categoryCounts.find((cat) => cat._id === "équipement généreaux")
            ?.count || 0,
        ], // Équipement généraux
        [
          data.length,
          categoryCounts.find((cat) => cat._id === "Structure Bâtiment")
            ?.count || 0,
        ], // Structure Bâtiment
        ["", total || 0],
      ],
    },
    {
      name: "besoin satisfait",
      data: [
        [
          formatTime(
            categoryCounts.find((cat) => cat._id === "Dispositif Médicaux")
              ?.averageResolutionTime
          ), // Format time

          closedCategoryCounts.find((cat) => cat._id === "Dispositif Médicaux")
            ?.count || 0,
        ], // Dispositif Médicaux
        [
          formatTime(
            categoryCounts.find((cat) => cat._id === "Matériel Informatique")
              ?.averageResolutionTime
          ), // Format time,
          closedCategoryCounts.find(
            (cat) => cat._id === "Matériel Informatique"
          )?.count || 0,
        ], // Matériel Informatique
        [
          formatTime(
            categoryCounts.find((cat) => cat._id === "équipement généreaux")
              ?.averageResolutionTime
          ),
          closedCategoryCounts.find((cat) => cat._id === "équipement généreaux")
            ?.count || 0,
        ], // Équipement généraux
        ,
        [
          formatTime(
            categoryCounts.find((cat) => cat._id === "Structure Bâtiment")
              ?.averageResolutionTime
          ),
          closedCategoryCounts.find((cat) => cat._id === "Structure Bâtiment")
            ?.count || 0,
        ], // Structure Bâtiment
        ,
        ["", totalClosed || 0],
      ],
    },
    {
      name: "taux de satisfaction",
      data: [
        [
          data.length,
          `${
            categoryCounts.find((cat) => cat._id === "Dispositif Médicaux")
              ?.closedPercentage || 0
          } %`,
        ], // Dispositif Médicaux
        [
          data.length,
          `${
            categoryCounts.find((cat) => cat._id === "Matériel Informatique")
              ?.closedPercentage || 0
          } %`,
        ], // Matériel Informatique
        [
          data.length,
          `${
            categoryCounts.find((cat) => cat._id === "équipement généreaux")
              ?.closedPercentage || 0
          } %`,
        ], // Équipement généraux
        [
          data.length,
          `${
            categoryCounts.find((cat) => cat._id === "Structure Bâtiment")
              ?.closedPercentage || 0
          } %`,
        ], // Structure Bâtiment
        ["", `${closureRate} %` || 0],
      ],
    },
    {
      name: "besoins restants",
      data: [
        [
          data.length,
          inclosedCategoryCounts.find(
            (cat) => cat._id === "Dispositif Médicaux"
          )?.count || 0,
        ], // Dispositif Médicaux
        [
          data.length,
          inclosedCategoryCounts.find(
            (cat) => cat._id === "Matériel Informatique"
          )?.count || 0,
        ], // Matériel Informatique
        [
          data.length,
          inclosedCategoryCounts.find(
            (cat) => cat._id === "équipement généreaux"
          )?.count || 0,
        ], // Équipement généraux
        [
          data.length,
          inclosedCategoryCounts.find((cat) => cat._id === "Structure Bâtiment")
            ?.count || 0,
        ], // Structure Bâtiment
        ["", totalInclosed || 0],
      ],
    },
  ];

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 450 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="center">Dispositif Médicaux</TableCell>
              <TableCell align="center">Matériel Informatique</TableCell>
              <TableCell align="center">Équipement généraux</TableCell>
              <TableCell align="center">Structure Bâtiment</TableCell>
              <TableCell align="center">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                {row.data.map(([value2, value1], index) => (
                  <TableCell key={index} align="center">
                    <div>{value1}</div>
                    <div style={{ fontSize: "0.8em", color: "gray" }}>
                      {value2}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {/* Row for icons */}
            <TableRow className="icon-row">
              <TableCell></TableCell>
              <TableCell align="center">
                <IconButton onClick={handleOpen}>
                  <RemoveRedEyeIcon color="primary" />
                </IconButton>
              </TableCell>
              <TableCell align="center">
                <IconButton onClick={handleOpenTwo}>
                  <RemoveRedEyeIcon color="primary" />
                </IconButton>
              </TableCell>
              <TableCell align="center">
                <IconButton onClick={handleOpenthree}>
                  <RemoveRedEyeIcon color="primary" />
                </IconButton>
              </TableCell>
              <TableCell align="center">
                <IconButton onClick={hundleOpenFour}>
                  <RemoveRedEyeIcon color="primary" />
                </IconButton>
              </TableCell>
              <TableCell align="center"></TableCell> {/* Empty for Total */}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <DialogListEquipment
        // @ts-ignore
        region={region} // Already passing selectedRegion
        province={province} // Passing selectedProvince to ClotureNonCloture
        startDate={startDate} // Passing startDate
        endDate={endDate}
        open={open}
        handleClose={handleClose}
      />
      <DialogListEquipmentInfo
        openTwo={openTwo}
        handleCloseTwo={handleCloseTwo}
        region={region} // Already passing selectedRegion
        province={province} // Passing selectedProvince to ClotureNonCloture
        startDate={startDate} // Passing startDate
        endDate={endDate}
      />
      <DialogListEquipmentGeneraux
        openthree={openthree}
        handleClosethree={handleClosethree}
        region={region} // Already passing selectedRegion
        province={province} // Passing selectedProvince to ClotureNonCloture
        startDate={startDate} // Passing startDate
        endDate={endDate}
      />
      <DialogListEquipmentStructure
        openFour={openFour}
        hundleCloseFour={hundleCloseFour}
        region={region} // Already passing selectedRegion
        province={province} // Passing selectedProvince to ClotureNonCloture
        startDate={startDate} // Passing startDate
        endDate={endDate}
      />
    </>
  );
};

export default GlobalGraph;
