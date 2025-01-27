import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const EquipmentDialog = ({ open, onClose, equipmentData }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Details des équipements</DialogTitle>
      <DialogContent>
        {equipmentData && equipmentData.length > 0 ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nom de l'équipement</TableCell>
                <TableCell>Quantité</TableCell>
                <TableCell>Fonctionnel</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equipmentData.map((equipment, index) => (
                <TableRow key={index}>
                  <TableCell>{equipment.name}</TableCell>
                  <TableCell>{equipment.quantite}</TableCell>
                  <TableCell>{equipment.fonctionnel}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>Aucun équipement disponible pour cette entrée.</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EquipmentDialog;
