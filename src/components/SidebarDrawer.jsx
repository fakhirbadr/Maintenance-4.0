import React, { useState } from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, IconButton, Box, Typography, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LocalPharmacyIcon from "../icons/LocalPharmacyIcon.jsx";
import HistoryIcon from "@mui/icons-material/History";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useNavigate } from "react-router-dom";

const modules = [
  {
    label: "Gestion Pharmaceutique",
    icon: <AssignmentIcon color="primary" />, // ou <LocalPharmacyIcon />
    path: "/pharmaceutique/gestion"
  },
  {
    label: "Historique Pharmaceutique",
    icon: <HistoryIcon color="secondary" />, // ou <LocalPharmacyIcon />
    path: "/pharmaceutique/historique"
  },
  // Ajoutez d'autres modules ici si besoin
];

const SidebarDrawer = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{ position: "fixed", top: 24, right: 24, zIndex: 1300, bgcolor: "background.paper", boxShadow: 3, borderRadius: 2 }}
        size="large"
        aria-label="Ouvrir le menu pharmacie"
      >
        <MenuIcon fontSize="inherit" />
      </IconButton>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 320,
            bgcolor: "#181c24",
            color: "#fff",
            borderTopLeftRadius: 24,
            borderBottomLeftRadius: 24,
            boxShadow: 8,
          },
        }}
      >
        <Box
          sx={{ p: 3, display: "flex", alignItems: "center", gap: 1 }}
          onMouseLeave={handleClose}
        >
          <LocalPharmacyIcon style={{ fontSize: 32, color: "#90caf9" }} />
          <Typography variant="h6" fontWeight={700}>
            Pharmacie
          </Typography>
        </Box>
        <Divider sx={{ bgcolor: "#333" }} />
        <List>
          {modules.map((mod) => (
            <ListItemButton
              key={mod.label}
              onClick={() => handleNavigate(mod.path)}
              sx={{
                borderRadius: 2,
                my: 1,
                transition: "background 0.2s",
                '&:hover': { bgcolor: "#23293a" },
              }}
            >
              <ListItemIcon sx={{ color: "#90caf9" }}>{mod.icon}</ListItemIcon>
              <ListItemText primary={mod.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default SidebarDrawer;
