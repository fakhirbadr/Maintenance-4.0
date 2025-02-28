import React, { useRef, useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  styled,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { toPng } from "html-to-image";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[200],
  "& .MuiLinearProgress-bar": {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "dark" ? "#308fe8" : "#1a90ff",
  },
}));

const serviceIcons = {
  Consultation: "consultation.png",
  Soins: "soin.png",
  Vaccination: "vaccine (2).png",
  DepistageDiabete: "injection.png",
  DepistageHTA: "hypertension.png",
  DepistageCancerDuSein: "breast-cancer.png",
  Teleexpertises: "ultrasound.png",
  Transfert: "emergency-services.png",
  Urgence: "siren.png",
};

const RepartitionParServices = ({ servicesData }) => {
  const tableRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (servicesData && servicesData.length > 0) {
      const mappedServices = servicesData.map((service) => ({
        name: service.serviceName,
        percentage: parseFloat(service.serviceRate),
        cases: service.cases,
        icon: (
          <img
            src={`/images/teleExpertise/${
              serviceIcons[service.serviceName] || "default.png"
            }`}
            alt={service.serviceName}
            width={17}
          />
        ),
      }));

      setServices(mappedServices);
    }
  }, [servicesData]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const downloadPng = () => {
    if (tableRef.current) {
      toPng(tableRef.current, { cacheBust: true })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = "repartition_par_services.png";
          link.href = dataUrl;
          link.click();
        })
        .catch(console.error);
    }
    handleMenuClose();
  };

  return (
    <div className="px-4">
      <div className="flex justify-between items-center">
        <div className="flex-grow text-center mb-10">
          <h2 className="text-xl font-bold text-gray-700">
            RÉPARTITION DES PATIENTS PAR SERVICES
          </h2>
        </div>
        <div>
          <IconButton
            onClick={handleMenuOpen}
            color="gray"
            aria-controls="menu"
            aria-haspopup="true"
            sx={{ mt: 2 }}
          >
            <MenuRoundedIcon sx={{ fontSize: 19 }} />
          </IconButton>

          <Menu
            id="menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={downloadPng}>Télécharger au format PNG</MenuItem>
          </Menu>
        </div>
      </div>

      <TableContainer
        component={Paper}
        ref={tableRef}
        sx={{ backgroundColor: "transparent", boxShadow: "none" }}
      >
        <Table
          aria-label="simple table"
          sx={{ "& .MuiTableCell-root": { padding: "4px" } }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Services</TableCell>
              <TableCell align="center">Pourcentage</TableCell>
              <TableCell align="right">Nombres de cas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow
                key={service.name}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  height: "30px",
                }}
              >
                <TableCell component="th" scope="row">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {service.icon}
                    {service.name}
                  </div>
                </TableCell>
                <TableCell align="center">
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <BorderLinearProgress
                      variant="determinate"
                      value={service.percentage}
                      style={{ width: "100%" }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        color: "#000",
                      }}
                    >
                      {`${service.percentage}%`}
                    </span>
                  </div>
                </TableCell>
                <TableCell align="right">{service.cases}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RepartitionParServices;
