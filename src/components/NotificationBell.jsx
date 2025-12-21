import React, { useState, useEffect } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoIcon from "@mui/icons-material/Info";
import axios from "axios";

// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const open = Boolean(anchorEl);

  // Récupérer les notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        console.error("Pas de token d'authentification");
        return;
      }

      const response = await axios.get(`${apiUrl}/api/v1/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer le nombre de notifications non lues toutes les 30 secondes
  useEffect(() => {
    fetchNotifications();
    
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    try {
      const token = localStorage.getItem("authToken");
      
      // Marquer comme lue
      await axios.patch(
        `${apiUrl}/api/v1/notifications/${notification.id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Pas de navigation automatique - juste fermer le menu
      handleClose();
      fetchNotifications(); // Rafraîchir
    } catch (error) {
      console.error("Erreur lors du marquage de la notification:", error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "error":
        return <ErrorOutlineIcon sx={{ color: "#f44336" }} />;
      case "warning":
        return <WarningAmberIcon sx={{ color: "#ff9800" }} />;
      case "info":
      default:
        return <InfoIcon sx={{ color: "#2196f3" }} />;
    }
  };

  const getChipColor = (type) => {
    switch (type) {
      case "error":
        return "error";
      case "warning":
        return "warning";
      case "info":
      default:
        return "info";
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return notifDate.toLocaleDateString("fr-FR");
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          color="inherit"
          onClick={handleClick}
          aria-controls={open ? "notification-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        id="notification-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            overflow: "auto",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="h6" fontWeight="bold">
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Typography variant="caption" color="text.secondary">
              {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
            </Typography>
          )}
        </Box>
        <Divider />

        {loading ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              Chargement...
            </Typography>
          </MenuItem>
        ) : notifications.length === 0 ? (
          <MenuItem disabled>
            <Box sx={{ textAlign: "center", py: 3, width: "100%" }}>
              <NotificationsIcon sx={{ fontSize: 48, color: "text.disabled" }} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Aucune notification
              </Typography>
            </Box>
          </MenuItem>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  button
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {notification.title}
                        </Typography>
                        <Chip
                          label={notification.categorie}
                          size="small"
                          color={getChipColor(notification.type)}
                          sx={{ height: 20, fontSize: "0.7rem" }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          {notification.message}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 0.5,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            📍 {notification.site}
                          </Typography>
                          <Typography variant="caption" color="primary">
                            {formatDate(notification.createdAt)}
                          </Typography>
                        </Box>
                      </>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}

        <Divider />
        <Box sx={{ p: 1, textAlign: "center" }}>
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer", fontWeight: "medium" }}
            onClick={() => {
              navigate("/Validation");
              handleClose();
            }}
          >
            Voir toutes les notifications
          </Typography>
        </Box>
      </Menu>
    </>
  );
};

export default NotificationBell;
