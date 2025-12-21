import React, { useState } from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LocalPharmacyIcon from "../icons/LocalPharmacyIcon.jsx";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HistoryIcon from "@mui/icons-material/History";
import { useNavigate, useLocation } from "react-router-dom";

const PharmaSidebarMenu = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const menuItems = [
    {
      label: "Gestion Pharmaceutique",
      icon: <AssignmentIcon fontSize="small" />,
      path: "/pharmaceutique/gestion"
    },
    {
      label: "Historique Pharmaceutique",
      icon: <HistoryIcon fontSize="small" />,
      path: "/pharmaceutique/historique"
    }
  ];

  return (
    <Box sx={{ width: 260, bgcolor: "#181c24", color: "#fff", borderRadius: 3, p: 1, boxShadow: 4 }}>
      <List component="nav" disablePadding>
        <ListItemButton
          onClick={handleClick}
          sx={{
            bgcolor: "#23293a",
            borderRadius: 2,
            mb: 0.5,
            '&:hover': { bgcolor: "#2a3142" },
            transition: "background 0.2s"
          }}
        >
          <ListItemIcon sx={{ color: "#90caf9" }}>
            <LocalPharmacyIcon style={{ fontSize: 22 }} />
          </ListItemIcon>
          <ListItemText
            primary={<Typography fontWeight={600}>Pharmacie</Typography>}
          />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ ml: 3, borderLeft: "2px solid #23293a", pl: 2 }}>
            {menuItems.map((item) => {
              const selected = location.pathname === item.path;
              return (
                <ListItemButton
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  selected={selected}
                  sx={{
                    borderRadius: 2,
                    my: 0.5,
                    bgcolor: selected ? "#23293a" : "transparent",
                    '&:hover': { bgcolor: "#23293a" },
                    transition: "background 0.2s"
                  }}
                >
                  <ListItemIcon sx={{ color: "#90caf9" }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              );
            })}
          </Box>
        </Collapse>
      </List>
    </Box>
  );
};

export default PharmaSidebarMenu;
