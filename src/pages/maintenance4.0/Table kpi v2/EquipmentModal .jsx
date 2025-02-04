import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const EquipmentModal = ({ open, onClose, category, data }) => {
  if (!category || !data) return null;

  const categoryData = data.countsByCategory[category] || {};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Détails de la catégorie : {category}</DialogTitle>
      <DialogContent>
        <List>
          {Object.entries(categoryData).map(([equipment, count]) => (
            <ListItem key={equipment}>
              <ListItemText
                primary={equipment}
                secondary={`Nombre de demandes : ${count}`}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};
