import {
  alpha,
  Box,
  IconButton,
  InputBase,
  Stack,
  styled,
  Toolbar,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
// import ExitToAppIcon from "@mui/icons-material/ExitToAppIcon";
import { useNavigate } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import GradingOutlinedIcon from "@mui/icons-material/GradingOutlined";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import myImage from "../../public/scx.png"; // Ajustez le chemin en fonction de votre structure
import { motion } from "framer-motion"; // Import Framer Motion pour les animations

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

const drawerWidth = 240;

export default function TopBar({ open, handleDrawerOpen, setMode }) {
  const theme = useTheme();
  const navigate = useNavigate();

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
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

        {/* Logo Centré */}
        <Box flexGrow={8} display="flex" justifyContent="center">
          <motion.img
            src={myImage}
            alt="Your description"
            style={{ height: "40px", width: "98px" }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        </Box>

        <Box flexGrow={1} />

        {/* Icônes de droite */}
        <Stack direction={"row"} spacing={1}>
          {/* {theme.palette.mode === "light" ? (
            <IconButton
              onClick={() => {
                localStorage.setItem(
                  "currentMode",
                  theme.palette.mode === "dark" ? "light" : "dark"
                );
                setMode((prevMode) =>
                  prevMode === "light" ? "dark" : "light"
                );
              }}
              color={"inherit"}
            >
              <LightModeOutlinedIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => {
                localStorage.setItem(
                  "currentMode",
                  theme.palette.mode === "dark" ? "light" : "dark"
                );
                setMode((prevMode) =>
                  prevMode === "light" ? "dark" : "light"
                );
              }}
              color={"inherit"}
            >
              <DarkModeOutlinedIcon />
            </IconButton>
          )} */}

          <IconButton color="inherit" component={Link} to="/homepage">
            <HomeRoundedIcon />
          </IconButton>

          <IconButton
            sx={{ color: "inherit" }}
            component={Link}
            to="/NetworkPatient"
          >
            <SpeedRoundedIcon sx={{ fontSize: 25 }} />
          </IconButton>

          <IconButton
            sx={{ color: "inherit" }}
            component={Link}
            to="/checkListe"
          >
            <GradingOutlinedIcon />
          </IconButton>

          <IconButton color={"inherit"}>
            <SettingsOutlinedIcon />
          </IconButton>

          <IconButton color={"inherit"}>
            <PersonOutlineOutlinedIcon />
          </IconButton>

          {/* Icône de déconnexion */}
          <IconButton color={"error"} onClick={handleLogout}>
            <PowerSettingsNewOutlinedIcon />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
