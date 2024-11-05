import Location from "../../components/Location";
import MttrCard from "./MttrCard";
import TicketGraph from "./TicketGraph";
import StatusTicket from "./StatusTicket";
import TauxDePannes from "./TauxDePannes";
import InterventionsPlanifiées from "./InterventionsPlanifiées";
import "./Card.css";
import CustomCard from "./Card";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@mui/material";
import { ScrollText } from "lucide-react";
import imageBase64 from "./image.txt";

const Dashboard = () => {
  const generatePDF = () => {
    const pdf = new jsPDF();

    // Créer une instance de la date actuelle
    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString("default", {
      month: "long",
    })} ${now.getFullYear()}`;

    // Dimensions du contour
    const margin = 10;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pageWidth - 2 * margin;
    const contentHeight = pageHeight - 2 * margin;

    // Dessiner le contour
    pdf.setDrawColor(0);
    pdf.rect(margin, margin, contentWidth, contentHeight);

    // Ajouter le titre principal au centre
    pdf.setFontSize(22);
    pdf.text("Rapport de l'état de maintenance", pageWidth / 2, margin + 20, {
      align: "center",
    });

    // Ajouter la date formatée en dessous du titre
    pdf.setFontSize(16);
    pdf.text(formattedDate, pageWidth / 2, margin + 30, { align: "center" });

    // Ajouter les paragraphes
    pdf.setFontSize(12);
    const paragraphText =
      "Ce document comprend des indicateurs de performance pour les unités mobiles et la logistique";

    pdf.text(paragraphText, pageWidth / 2, margin + 50, {
      align: "center",
      maxWidth: contentWidth - 10,
    });

    // Centrer chaque paragraphe
    const paragraphX = pageWidth / 2; // Position X pour le centrage

    const paragraphs = [
      "--- Efficacité globale de l'équipement ---",
      "--- Le temps moyen de réparation ---",
      "--- Nombre de Tickets & Priorité ---",
      "--- Statut des Tickets ---",
      "--- Suivi du Taux de Pannes ---",
      "--- Suivi des Interventions Planifiées ---",
    ];

    // Afficher chaque paragraphe avec un espacement vertical
    paragraphs.forEach((text, index) => {
      pdf.text(text, paragraphX, margin + 60 + index * 10, {
        align: "center",
        maxWidth: contentWidth - 10,
      });
    });

    // Ajouter une nouvelle page
    pdf.addPage();

    // Ajouter du contenu sur la nouvelle page
    pdf.setFontSize(22);
    pdf.text("Efficacité globale de l'équipement", pageWidth / 2, margin + 20, {
      align: "center",
    });

    pdf.setFontSize(12);
    pdf.text(
      "Informations supplémentaires sur l'efficacité de l'équipement...",
      pageWidth / 2,
      margin + 40,
      {
        align: "center",
        maxWidth: contentWidth - 10,
      }
    );

    // Enregistrer le PDF
    pdf.save("rapport_maintenance.pdf");
  };

  return (
    <>
      <Location />

      <div className="flex flex-col px-2 w-[99%] justify-center gap-y-3">
        <div className="text-lg font-semibold">
          Performance de Disponibilité des Équipements
        </div>

        <div className="flex md:flex-row gap-x-8 sm:flex-col  sm:gap-y-4">
          <CustomCard className=" md:w-1/2  " />
          <MttrCard className=" md:w-1/2" />
        </div>

        <div className="text-lg font-semibold">Backlog de Maintenance</div>
        <div className="flex md:flex-row gap-x-8 sm:flex-col sm:gap-y-4">
          <div className="md:w-1/2 overflow-hidden" id="ticketGraph">
            <TicketGraph />
          </div>
          <div className="md:w-1/2 overflow-hidden" id="statusTicket">
            <StatusTicket />
          </div>
        </div>

        <div className="text-lg font-semibold">Performance de Maintenance</div>
        <div className="flex md:flex-row gap-x-8 sm:flex-col sm:gap-y-4">
          <div className="md:w-1/2 overflow-hidden" id="tauxDePannes">
            <TauxDePannes />
          </div>
          <div
            className="md:w-1/2 overflow-hidden"
            id="interventionsPlanifiées"
          >
            <InterventionsPlanifiées />
          </div>
        </div>
        <div className="flex justify-center items-center">
          {" "}
          {/* Bouton pour générer le PDF */}
          <Button
            variant="outlined"
            endIcon={<ScrollText />}
            onClick={generatePDF}
            className="md:w-[10%] w-[20%]  mt-4 bg-blue-500 text-white p-2 rounded"
          >
            Générer PDF
          </Button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
