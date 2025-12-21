import NetworkStatus from "./NetworkStatus";
import React, { useState } from "react";
import {
  alpha,
  Box,
  IconButton,
  InputBase,
  Stack,
  styled,
  Toolbar,
  useTheme,
  Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import GradingOutlinedIcon from "@mui/icons-material/GradingOutlined";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import myImage from "../../public/scx.png";
import { motion } from "framer-motion";
import UniteEtatModal from "./UniteEtatModal";
import UniteEtatAdminModal from "./UniteEtatAdminModal";
import PointageTechnicienModal from "./pointageTechnicienModel";
import PointagevFinalAdmin from "./PointagevFinalAdmin";
import NotificationBell from "./NotificationBell";
import AIChatBot from "./AIChatBot";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  backgroundColor: theme.palette.mode === "dark" ? "#1e1e2d" : "#ffffff",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function TopBar({ open, handleDrawerOpen, setMode }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [openTechnicienModal, setOpenTechnicienModal] = useState(false);
  const [openChatBot, setOpenChatBot] = useState(false);

  let role = "user";
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo && userInfo.role) {
      role = userInfo.role;
    }
  } catch (e) {
    // si parsing échoue, role reste "user"
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  // Pour le modal "Pointagevfinal"
  const handleOpenPointagevfinal = () => {
    setOpenTechnicienModal(true);
  };
  const handleClosePointagevfinal = () => {
    setOpenTechnicienModal(false);
  };

  // Rôles pour afficher le composant admin
  const isAdminRole =
    role === "superviseur" ||
    role === "admin" ||
    role === "chargés de performance";
  const isTechRole = role === "technicien" || role === "user";

  return (
    <>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
              "&:hover": {
                transform: "rotate(180deg)",
                color: theme.palette.primary.main,
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>

          <Box flexGrow={8} display="flex" justifyContent="center">
            <motion.img
              src={myImage}
              alt="Logo"
              style={{ height: "40px", width: "98px" }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </Box>

          <Box flexGrow={1} />

          <Stack direction={"row"} spacing={1}>
            {/* <Button
              color="primary"
              variant="outlined"
              onClick={() => setOpenModal(true)}
              sx={{
                borderRadius: 2,
                borderColor:
                  theme.palette.mode === "dark" ? "#90caf9" : "#1976d2",
                color: theme.palette.mode === "dark" ? "#90caf9" : "#1976d2",
                fontWeight: 600,
                textTransform: "none",
                px: 2,
                boxShadow: "none",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  background: alpha(theme.palette.primary.light, 0.08),
                },
              }}
            >
              Pointage
            </Button> */}
            <Button
              color="primary"
              variant="outlined"
              onClick={handleOpenPointagevfinal}
              sx={{
                borderRadius: 2,
                borderColor:
                  theme.palette.mode === "dark" ? "#90caf9" : "#1976d2",
                color: theme.palette.mode === "dark" ? "#90caf9" : "#1976d2",
                fontWeight: 600,
                textTransform: "none",
                px: 2,
                boxShadow: "none",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  background: alpha(theme.palette.primary.light, 0.08),
                },
              }}
            >
              Pointage
            </Button>
            <IconButton color="inherit" component={Link} to="/homepage">
              <HomeRoundedIcon />
            </IconButton>
            {/* Icône réseau pour test et réclamation */}
            <NetworkStatus />
            {/* <IconButton
              sx={{ color: "inherit" }}
              component={Link}
              to="/NetworkPatient"
            >
              <SpeedRoundedIcon sx={{ fontSize: 25 }} />
            </IconButton> */}
            <IconButton
              sx={{ color: "inherit" }}
              component={Link}
              to="/checkListe"
            >
              <GradingOutlinedIcon />
            </IconButton>

            {/* Notification Bell */}
            <NotificationBell />

            {/* AI ChatBot - superviseurs seulement */}
            {/* {role === "superviseur" && <AIChatBot />} */}

            <IconButton color={"inherit"}>
              <SettingsOutlinedIcon />
            </IconButton>
            <IconButton color={"inherit"}>
              <PersonOutlineOutlinedIcon />
            </IconButton>
            <IconButton color={"error"} onClick={handleLogout}>
              <PowerSettingsNewOutlinedIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Modal classique */}
      {role === "user" ? (
        <UniteEtatModal open={openModal} onClose={() => setOpenModal(false)} />
      ) : (
        <UniteEtatAdminModal
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      )}

      {/* Modal Pointagevfinal/Technicien ou Admin */}
      {isTechRole && (
        <PointageTechnicienModal
          open={openTechnicienModal}
          onClose={handleClosePointagevfinal}
        />
      )}
      {isAdminRole && (
        <PointagevFinalAdmin
          open={openTechnicienModal}
          onClose={handleClosePointagevfinal}
        />
      )}
    </>
  );
}
