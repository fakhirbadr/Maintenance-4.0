import React, { useState, useEffect } from "react";
import {
 Dialog,
 DialogTitle,
 DialogContent,
 DialogActions,
 Button,
 TextField,
 IconButton,
 Typography,
 Box,
 Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

// --- MODIFICATION : Utilisation de la variable d'environnement ---
// On récupère l'URL de l'API depuis les variables d'environnement de Vite.
// @ts-ignore
const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function ConfigActifsDialog({ open, onClose }) {
 const [actifs, setActifs] = useState([]); // Liste complète des actifs (fusionnés avec personnel)
 const [selectedActif, setSelectedActif] = useState(null); // Actif en édition
 const [personnel, setPersonnel] = useState({
  medecin: "",
  infirmiere1: "",
  infirmiere2: "",
  technicien: "",
 });

 // Charger tous les actifs + personnels et fusionner
 const loadData = async () => {
  try {
   const [actifsRes, personnelRes] = await Promise.all([
        // --- MODIFICATION ---
    axios.get(`${API_BASE_URL}/api/actifs`),
    axios.get(`${API_BASE_URL}/api/personnel`),
   ]);

   const actifsData = actifsRes.data; // liste des actifs
   const personnelsData = personnelRes.data; // liste des personnels

   // Fusionner personnel dans actifs
   const merged = actifsData.map(actif => {
    const persoEntry = personnelsData.find(p => p.actifId?._id === actif._id);
    return {
     ...actif,
     personnel: persoEntry ? persoEntry.personnel : [],
    };
   });

   setActifs(merged);
  } catch (err) {
   console.error("Erreur lors du chargement des données:", err);
   setActifs([]);
  }
 };

 useEffect(() => {
  if (open) {
   loadData();
  }
 }, [open]);

 // Ouvrir édition d’un actif, pré-remplir personnel s’il existe
 const handleEdit = (actif) => {
  setSelectedActif(actif);
  setPersonnel({
   medecin: actif.personnel?.find(p => p.role === "medecin")?.nom || "",
   infirmiere1: actif.personnel?.find(p => p.role === "infirmiere1")?.nom || "",
   infirmiere2: actif.personnel?.find(p => p.role === "infirmiere2")?.nom || "",
   technicien: actif.personnel?.find(p => p.role === "technicien")?.nom || "",
  });
 };

 // Sauvegarder (create ou update) le personnel de l’actif sélectionné
 const handleSave = async () => {
  try {
      // --- MODIFICATION ---
   await axios.post(`${API_BASE_URL}/api/personnel`, {
    actifId: selectedActif._id,
    personnel: [
     { role: "medecin", nom: personnel.medecin },
     { role: "infirmiere1", nom: personnel.infirmiere1 },
     { role: "infirmiere2", nom: personnel.infirmiere2 },
     { role: "technicien", nom: personnel.technicien },
    ],
   });
   setSelectedActif(null);
   await loadData(); // rafraîchir la liste après sauvegarde
  } catch (err) {
   console.error("Erreur lors de la sauvegarde:", err);
  }
 };

 return (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
   <DialogTitle>Configuration du Personnel par Unité</DialogTitle>
   <DialogContent>
    {selectedActif ? (
     // Formulaire d'édition
     <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
       {selectedActif.name} - {selectedActif.region}
      </Typography>
      <TextField
       label="Médecin"
       fullWidth
       margin="dense"
       value={personnel.medecin}
      	 onChange={e => setPersonnel({ ...personnel, medecin: e.target.value })}
      />
      <TextField
       label="Infirmière 1"
      	 fullWidth
      	 margin="dense"
      	 value={personnel.infirmiere1}
      	 onChange={e => setPersonnel({ ...personnel, infirmiere1: e.target.value })}
      />
      <TextField
      	 label="Infirmière 2"
      	 fullWidth
      	 margin="dense"
      	 value={personnel.infirmiere2}
      	 onChange={e => setPersonnel({ ...personnel, infirmiere2: e.target.value })}
      />
      <TextField
      	 label="Technicien"
      	 fullWidth
      	 margin="dense"
      	 value={personnel.technicien}
      	 onChange={e => setPersonnel({ ...personnel, technicien: e.target.value })}
      />
     </Box>
    ) : (
     // Liste des actifs avec leur personnel (ou vide)
     actifs.map(actif => (
      <Box
       key={actif._id}
       display="flex"
       flexDirection="column"
       sx={{ py: 1, borderBottom: "1px solid #ddd" }}
      >
       <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">
         {actif.name} - {actif.region}
        </Typography>
        <IconButton onClick={() => handleEdit(actif)}>
         <EditIcon />
        </IconButton>
       </Box>
       {actif.personnel && actif.personnel.length > 0 ? (
        actif.personnel.map(p => (
         <Typography key={p.role} sx={{ ml: 2 }}>
          {p.role} : {p.nom || "Non assigné"}
         </Typography>
        ))
       ) : (
        <Typography sx={{ ml: 2, fontStyle: "italic" }}>
         Aucun personnel assigné
        </Typography>
       )}
      </Box>
     ))
    )}
    <Divider sx={{ my: 2 }} />
   </DialogContent>

   <DialogActions>
    {selectedActif ? (
     <>
      <Button onClick={() => setSelectedActif(null)}>Annuler</Button>
      <Button variant="contained" onClick={handleSave}>
       Enregistrer
      </Button>
     </>
    ) : (
     <Button onClick={onClose}>Fermer</Button>
    )}
   </DialogActions>
  </Dialog>
 );
}