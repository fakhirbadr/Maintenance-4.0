import Layout from "./Layout";
import React from "react";

const Hr = () => {
  // Données exemple
  const absences = [
    { id: 1, type: "Congé annuel", date: "2024-03-01", statut: "Approuvé" },
    { id: 2, type: "Maladie", date: "2024-03-05", statut: "En attente" },
    { id: 3, type: "Congé parental", date: "2024-03-10", statut: "Approuvé" },
    { id: 4, type: "Congé sans solde", date: "2024-03-15", statut: "Refusé" },
  ];

  const reclamations = [
    {
      id: 1,
      sujet: "Problème de paie",
      date: "2024-02-28",
      statut: "En cours",
    },
    {
      id: 2,
      sujet: "Conditions de travail",
      date: "2024-03-02",
      statut: "Résolu",
    },
    { id: 3, sujet: "Harcèlement", date: "2024-03-07", statut: "En cours" },
    {
      id: 4,
      sujet: "Erreur de contrat",
      date: "2024-03-12",
      statut: "Nouveau",
    },
  ];

  const actualites = [
    { id: 1, titre: "Nouvelle politique RH", date: "2024-03-01" },
    { id: 2, titre: "Atelier de formation", date: "2024-03-05" },
    { id: 3, titre: "Mise à jour des avantages", date: "2024-03-10" },
    { id: 4, titre: "Événement d'équipe", date: "2024-03-15" },
  ];
  return (
    <>
      <Layout />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="grid grid-cols-2 grid-rows-2 gap-8 w-full h-[470px] max-w-8xl">
          {/* Section 1 - Hero */}
          <div className="bg-blue-100 rounded-xl shadow-lg flex">
            <div
              className="w-1/2 bg-cover rounded-l-xl"
              style={{
                backgroundImage:
                  "url('https://zagrebglobal.com/wp-content/uploads/2024/08/hr-trends-shaping-2024-and-beyond.jpg')",
              }}
            ></div>
            <div className="w-1/2 p-6 flex flex-col justify-center">
              <h1 className="text-2xl font-bold text-blue-600 mb-4">
                SCX Technology RH Portal
              </h1>
              <p className="text-gray-600 mb-6 text-sm">
                Gestion centralisée des ressources humaines
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm w-fit">
                Accéder au dashboard
              </button>
            </div>
          </div>

          {/* Section 2 - Absences */}
          <div className="bg-blue-100 rounded-xl shadow-lg p-6 overflow-auto">
            <h2 className="text-lg font-bold text-blue-600 mb-4">Absences</h2>
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-2 text-left text-sm">Type</th>
                  <th className="p-2 text-left text-sm">Date</th>
                  <th className="p-2 text-left text-sm">Statut</th>
                </tr>
              </thead>
              <tbody>
                {absences.map((absence) => (
                  <tr key={absence.id} className="border-t">
                    <td className="p-2 text-sm">{absence.type}</td>
                    <td className="p-2 text-sm">{absence.date}</td>
                    <td className="p-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          absence.statut === "Approuvé"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {absence.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 3 - Réclamations */}
          <div className="bg-blue-100 rounded-xl shadow-lg p-6 overflow-auto">
            <h2 className="text-lg font-bold text-blue-600 mb-4">
              Réclamations
            </h2>
            <div className="space-y-3">
              {reclamations.map((reclamation) => (
                <div
                  key={reclamation.id}
                  className="border-l-4 border-blue-600 pl-3 py-2"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-sm">
                      {reclamation.sujet}
                    </h3>
                    <span className="text-xs text-blue-600">
                      {reclamation.statut}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs mt-1">
                    Déposée le {reclamation.date}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4 - Nouveautés */}
          <div className="bg-blue-100 rounded-xl shadow-lg p-6 overflow-auto">
            <h2 className="text-lg font-bold text-blue-600 mb-4">Nouveautés</h2>
            <div className="space-y-4">
              {actualites.map((actu) => (
                <div
                  key={actu.id}
                  className="border rounded-lg p-3 hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-sm">{actu.titre}</h3>
                  <p className="text-gray-600 text-xs mt-1">
                    Publié le {actu.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hr;
