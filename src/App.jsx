import * as React from "react";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { Outlet, useLocation } from "react-router-dom";
import TopBar from "./components/TopBar";
import SideBar from "./components/SidBar";
import { getDesignTokens } from "./theme";
import "./index.css";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export default function MiniDrawer() {
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState(
    localStorage.getItem("currentMode")
      ? localStorage.getItem("currentMode")
      : "dark"
  );
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const location = useLocation();
  const isLoginPage = location.pathname === "/login"; // Check if on the Login page

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className="">
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />

          {/* Conditionally render TopBar and SideBar based on current route */}
          {!isLoginPage && (
            <>
              <TopBar
                open={open}
                handleDrawerOpen={handleDrawerOpen}
                setMode={setMode}
              />
              <SideBar open={open} handleDrawerClose={handleDrawerClose} />
            </>
          )}

          <Box component="main" className="" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            <div className=" mx-auto">
              <Outlet />
            </div>
          </Box>
        </Box>
      </ThemeProvider>
    </div>
  );
}
