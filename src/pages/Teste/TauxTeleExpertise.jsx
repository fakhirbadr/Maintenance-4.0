import React, { useState, useEffect } from "react";
import "./style.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const TauxTeleExpertise = ({
  selectedRegion,
  selectedProvince,
  selectedActif,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRegion, setExpandedRegion] = useState(null);
  const [expandedProvince, setExpandedProvince] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/ummcperformance/tele"
        );
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data
    .filter(
      (regionData) => !selectedRegion || regionData.region === selectedRegion
    )
    .map((regionData) => ({
      ...regionData,
      provinces: regionData.provinces
        .filter(
          (provinceData) =>
            !selectedProvince || provinceData.province === selectedProvince
        )
        .map((provinceData) => ({
          ...provinceData,
          unites: provinceData.unites.filter(
            (uniteData) => !selectedActif || uniteData.unite === selectedActif
          ),
        })),
    }));

  const handleRegionClick = (region) => {
    setExpandedRegion(expandedRegion === region ? null : region);
    setExpandedProvince(null);
  };

  const handleProvinceClick = (province) => {
    setExpandedProvince(expandedProvince === province ? null : province);
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-4">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-4">
        Erreur de chargement: {error}
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="flex justify-center">
        <h2 className="text-xl font-bold text-gray-700 flex items-center">
          TAUX DE TELEEXPERTISE PAR UNITE
          <img
            src="/images/teleExpertise/telemedecine (1).png"
            alt="Icône téléexpertise"
            className="ml-2 w-6 h-6 animate-resize"
          />
        </h2>
      </div>

      <TableContainer
        component={Paper}
        className="mt-4 shadow-lg"
        sx={{ backgroundColor: "transparent" }}
      >
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                Région
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
              >
                Taux Téléexpertise
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((regionData, regionIndex) => (
              <React.Fragment key={regionIndex}>
                <TableRow
                  onClick={() => handleRegionClick(regionData.region)}
                  style={{ cursor: "pointer" }}
                  hover
                  sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                >
                  <TableCell component="th" scope="row">
                    <div className="flex items-center">
                      {regionData.provinces.length > 0 &&
                        (expandedRegion === regionData.region ? (
                          <KeyboardArrowUpIcon className="text-blue-500" />
                        ) : (
                          <KeyboardArrowDownIcon className="text-blue-500" />
                        ))}
                      <span className="ml-2 font-medium">
                        {regionData.region}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell align="right" className="font-medium">
                    {regionData.tauxTeleexpertiseRegion}%
                  </TableCell>
                </TableRow>

                {expandedRegion === regionData.region &&
                  regionData.provinces.map((provinceData, provinceIndex) => (
                    <React.Fragment key={provinceIndex}>
                      <TableRow
                        onClick={() =>
                          handleProvinceClick(provinceData.province)
                        }
                        style={{ cursor: "pointer" }}
                        hover
                        sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                      >
                        <TableCell component="th" scope="row">
                          <div className="flex items-center pl-8">
                            {provinceData.unites.length > 0 &&
                              (expandedProvince === provinceData.province ? (
                                <KeyboardArrowUpIcon className="text-blue-500" />
                              ) : (
                                <KeyboardArrowDownIcon className="text-blue-500" />
                              ))}
                            <span className="ml-2 font-medium">
                              {provinceData.province}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="right" className="font-medium">
                          {provinceData.tauxTeleexpertiseProvince}%
                        </TableCell>
                      </TableRow>

                      {expandedProvince === provinceData.province &&
                        provinceData.unites.map((uniteData, uniteIndex) => (
                          <TableRow key={uniteIndex}>
                            <TableCell component="th" scope="row">
                              <div className="pl-16 font-medium">
                                {uniteData.unite}
                              </div>
                            </TableCell>
                            <TableCell align="right" className="font-medium">
                              {uniteData.tauxTeleexpertise}%
                            </TableCell>
                          </TableRow>
                        ))}
                    </React.Fragment>
                  ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TauxTeleExpertise;
