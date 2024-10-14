import React from "react";
import CardFormations from "./CardFormations";
import WelcomeImage from "../../../public/images/Formations/welcome.jpg";
import SchemasImage from "../../../public/images/Formations/schemas.jpg";
import FormationImage from "../../../public/images/Formations/formation3.jpg";
import MaterielImage from "../../../public/images/Formations/materiel.png";
import TutoImage from "../../../public/images/Formations/tuto.jpg";
import NotificationImage from "../../../public/images/Formations/notification.jpg";
import Location from "../../components/Location";

const Formations = () => {
  const formations = [
    {
      image: "/images/Formations/welcome.jpg",
      title: "Vidéo de présentation",
      description:
        "Une vidéo qui présente les différentes formations disponibles.",
      path: "/Presentation",
    },
    {
      image: SchemasImage,
      title: "Schémas de circuits",
      description:
        "Schémas de circuits détaillés pour aider à la compréhension.",
    },
    {
      image: FormationImage,
      title: "Vidéos de Formation",
      description:
        "Une série de vidéos qui couvrent les concepts de base et avancés.",
    },
    {
      image: MaterielImage,
      title: "Matériel de Référence",
      description: "Documents et ressources pour un apprentissage approfondi.",
    },
    {
      image: TutoImage,
      title: "Tutoriel",
      description: "Tutoriel pour renforcer les connaissances.",
    },
    {
      image: NotificationImage,
      title: "Notifications et Rappels",
      description:
        "Recevez des notifications pour rester à jour avec vos formations.",
    },
  ];

  return (
    <>
      <Location />
      <div className="flex flex-col gap-3 justify-center items-center">
        <div className="flex flex-row gap-3 flex-wrap justify-center">
          {formations.map((formation, index) => (
            <CardFormations
              key={index}
              image={formation.image}
              title={formation.title}
              description={formation.description}
              path={formation.path}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Formations;
