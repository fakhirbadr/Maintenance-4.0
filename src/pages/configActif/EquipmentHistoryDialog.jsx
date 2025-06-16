import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import jsPDF from "jspdf";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString();
};

const EquipmentHistoryDialog = ({ open, onClose, equipment }) => {
  if (!equipment) return null;

  // Génération du PDF
const handleDownloadPdf = () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Couleurs
  const primaryColor = [33, 150, 243]; // Bleu
  const secondaryColor = [76, 175, 80]; // Vert
  const accentColor = [255, 152, 0]; // Orange
  const grayColor = [158, 158, 158]; // Gris

  // Titre principal avec fond coloré
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 30, 'F');
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("HISTORIQUE DE L'ÉQUIPEMENT", pageWidth / 2, 20, { align: "center" });

  // Infos générales avec icônes simulées
  doc.setTextColor(...grayColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("INFORMATIONS GÉNÉRALES", 20, 45);
  
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.3);
  doc.line(20, 47, 70, 47);

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  
  // Encadré info
  doc.setDrawColor(...primaryColor);
  doc.setFillColor(240, 248, 255); // Bleu très clair
  doc.roundedRect(20, 50, pageWidth - 40, 25, 3, 3, 'FD');
  
  doc.text(`🔹 Nom : ${equipment.name || "Non spécifié"}`, 25, 58);
  doc.text(`🔹 ID : ${equipment._id || "Non spécifié"}`, 25, 66);
  
  const statusText = `🔹 État : ${equipment.isFunctionel ? "Fonctionnel" : "Défectueux"}`;
  const statusColor = equipment.isFunctionel ? secondaryColor : [244, 67, 54]; // Vert ou Rouge
  doc.setTextColor(...statusColor);
  doc.text(statusText, pageWidth - 100, 66);

  // Section Mouvements
  doc.setTextColor(...grayColor);
  doc.setFont("helvetica", "bold");
  doc.text("MOUVEMENTS", 20, 85);
  doc.setDrawColor(...primaryColor);
  doc.line(20, 87, 60, 87);

  // Historique ou message si vide
  if (equipment.history && equipment.history.length > 0) {
    let yPosition = 95;
    
    equipment.history
      .slice()
      .reverse()
      .forEach((h, i) => {
        // Nouvelle page si nécessaire
        if (yPosition > doc.internal.pageSize.getHeight() - 50) {
          doc.addPage();
          yPosition = 30;
        }

        // En-tête de mouvement
        doc.setFillColor(...primaryColor);
        doc.roundedRect(20, yPosition, pageWidth - 40, 10, 3, 3, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text(`Mouvement #${equipment.history.length - i}`, 25, yPosition + 7);

        // Corps du mouvement
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(20, yPosition + 12, pageWidth - 40, 30, 3, 3, 'FD');
        
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        
        // Icône flèche avec couleur
        doc.setTextColor(...accentColor);
        doc.text("➤", 25, yPosition + 23);
        doc.setTextColor(0, 0, 0);
        doc.text(`De : ${h.fromActifName} / ${h.fromCategoryName}`, 32, yPosition + 23);
        
        doc.setTextColor(...accentColor);
        doc.text("➤", 25, yPosition + 31);
        doc.setTextColor(0, 0, 0);
        doc.text(`Vers : ${h.toActifName} / ${h.toCategoryName}`, 32, yPosition + 31);
        
        doc.setTextColor(...grayColor);
        doc.setFontSize(10);
        doc.text(`Date : ${formatDate(h.movedAt)}`, pageWidth - 30, yPosition + 31, { align: "right" });

        yPosition += 45;
      });
  } else {
    doc.setFontSize(12);
    doc.setTextColor(grayColor);
    doc.setFont("helvetica", "italic");
    doc.text("Aucun mouvement enregistré pour cet équipement.", 20, 95);
  }

  // Pied de page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setTextColor(...grayColor);
    doc.setFontSize(10);
    doc.text(`Page ${i} / ${totalPages}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10, { align: "right" });
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 20, doc.internal.pageSize.getHeight() - 10);
  }

  doc.save(`historique_${equipment.name || "equipement"}.pdf`);
};


  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Historique de l'équipement :{" "}
        <span className="font-bold">{equipment.name}</span>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          size="large"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <div className="mb-4">
          <div>
            <span className="font-semibold">ID :</span>{" "}
            <span className="text-xs break-all">{equipment._id}</span>
          </div>
          <div>
            <span className="font-semibold">État actuel :</span>{" "}
            <span className={equipment.isFunctionel ? "text-green-600" : "text-red-600"}>
              {equipment.isFunctionel ? "Fonctionnel" : "Défectueux"}
            </span>
          </div>
          {equipment.description && (
            <div>
              <span className="font-semibold">Code à barre :</span>{" "}
              <span className="text-xs">{equipment.description}</span>
            </div>
          )}
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleDownloadPdf}
          >
            Télécharger en PDF
          </Button>
        </div>
        <hr className="mb-4" />
        {equipment.history && equipment.history.length > 0 ? (
          <ul className="space-y-2">
            {equipment.history
              .slice()
              .reverse()
              .map((h) => (
                <li key={h._id} className="border-b pb-2">
                  <div>
                    <span className="font-semibold">De :</span>{" "}
                    {h.fromActifName} / {h.fromCategoryName}
                  </div>
                  <div>
                    <span className="font-semibold">Vers :</span>{" "}
                    {h.toActifName} / {h.toCategoryName}
                  </div>
                  <div>
                    <span className="font-semibold">Date :</span>{" "}
                    {formatDate(h.movedAt)}
                  </div>
                </li>
              ))}
          </ul>
        ) : (
          <div>Aucun historique pour cet équipement.</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentHistoryDialog;