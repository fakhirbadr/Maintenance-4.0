import React, { useRef, useState } from "react";
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
import MenuRoundedIcon from "@mui/icons-material/MenuRounded"; // Import de l'icône
import { toPng } from "html-to-image"; // Importation de html-to-image

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${LinearProgress.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${LinearProgress.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#1a90ff",
    ...theme.applyStyles("dark", {
      backgroundColor: "#308fe8",
    }),
  },
}));

function createData(name, percentage, cases, icon) {
  return { name, percentage, cases, icon };
}

const rows = [
  createData(
    "Consultation médicale",
    100,
    159,
    <img
      src="../../../public/images/teleExpertise/consultation.png"
      alt="Consultation"
      width={17}
    />
  ),
  createData(
    "Activité de soins",
    50,
    237,
    <img
      src="../../../public/images/teleExpertise/soin.png"
      alt="Healthcare"
      width={17}
    />
  ),
  createData(
    "Vaccination",
    90,
    262,
    <img
      src="../../../public/images/teleExpertise/vaccine (2).png"
      alt="Vaccination"
      width={17}
    />
  ),
  createData(
    "Dépistage du Diabète",
    30,
    305,
    <img
      src="../../../public/images/teleExpertise/injection.png"
      alt="Diabetes"
      width={17}
    />
  ),
  createData(
    "Dépistage HTA",
    80,
    356,
    <img
      src="../../../public/images/teleExpertise/hypertension.png"
      alt="HTA"
      width={17}
    />
  ),
  createData(
    "Dépistage nodule du sein",
    60,
    186,
    <img
      src="../../../public/images/teleExpertise/breast-cancer.png"
      alt="Breast Screening"
      width={17}
    />
  ),
  createData(
    "Télé-expertise",
    40,
    44,
    <img
      src="../../../public/images/teleExpertise/ultrasound.png"
      alt="Tele-expertise"
      width={17}
    />
  ),
  createData(
    "Transfert",
    20,
    44,
    <img
      src="../../../public/images/teleExpertise/emergency-services.png"
      alt="Transfer"
      width={17}
    />
  ),
  createData(
    "Urgence",
    95,
    356,
    <img
      src="../../../public/images/teleExpertise/siren.png"
      alt="Emergency"
      width={17}
    />
  ),
];

const RepartitionParServices = () => {
  const tableRef = useRef(null); // Référence pour capturer la table
  const [anchorEl, setAnchorEl] = useState(null); // État pour le menu

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Fonction pour télécharger la table en PNG
  const downloadPng = () => {
    if (tableRef.current) {
      toPng(tableRef.current, { cacheBust: true })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = "repartition_par_services.png";
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error("Erreur lors du téléchargement de l'image:", err);
        });
    }
    handleMenuClose();
  };

  return (
    <div className="px-4">
      <div className="flex justify-between items-center">
        {/* Section title */}
        <div className="flex-grow text-center mb-10">
          <h2 className="text-xl font-bold text-gray-700">
            REPARTITION DES PATIENTS PAR SERVICES
          </h2>
        </div>
        <div>
          {/* Bouton icône avec menu */}
          <IconButton
            onClick={handleMenuOpen}
            color="gray"
            aria-controls="menu"
            aria-haspopup="true"
            sx={{ mt: 2 }}
          >
            <MenuRoundedIcon sx={{ fontSize: 19 }} />
          </IconButton>

          {/* Menu contextuel */}
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

      {/* Table container */}
      <TableContainer
        component={Paper}
        ref={tableRef} // Ajout de la référence ici
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <Table
          aria-label="simple table"
          sx={{
            "& .MuiTableCell-root": {
              padding: "4px",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Services</TableCell>
              <TableCell align="center">Pourcentage</TableCell>
              <TableCell align="right">Nombres de cas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
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
                    {row.icon}
                    {row.name}
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
                      value={row.percentage}
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
                      {`${row.percentage}%`}
                    </span>
                  </div>
                </TableCell>
                <TableCell align="right">{row.cases}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RepartitionParServices;
