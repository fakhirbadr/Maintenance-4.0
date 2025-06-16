import React, { useEffect, useState } from "react";
import axios from "axios";
import AddActifDialog from "./AddActifDialog";
import EquipmentHistoryDialog from "./EquipmentHistoryDialog"; // Import du nouveau composant

const ConfigurationAsset = () => {
  const [actifs, setActifs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  useEffect(() => {
    const fetchActifs = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/actifs");
        setActifs(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des actifs :", error);
      }
    };

    fetchActifs();
  }, []);

  const handleAddActif = async (newActif) => {
    try {
      const res = await axios.post("http://localhost:3000/api/actifs", {
        name: newActif.name,
        region: newActif.region,
        province: newActif.province,
        categories: [],
      });
      setActifs([...actifs, res.data]);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'actif :", error);
      alert(
        "Erreur lors de la création: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const handleAddCategory = async (actifId) => {
    const name = prompt("Nom de la nouvelle catégorie :");
    if (!name) return;

    try {
      const res = await axios.post(
        `http://localhost:3000/api/actifs/${actifId}/categories`,
        { category: { name, equipments: [] } }
      );
      setActifs(actifs.map((a) => (a._id === actifId ? res.data : a)));
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie :", error);
    }
  };

  const handleAddEquipment = async (actifId, categoryId) => {
    const name = prompt("Nom de l'équipement :");
    if (!name) return;

    try {
      const res = await axios.post(
        `http://localhost:3000/api/actifs/${actifId}/categories/${categoryId}/equipments`,
        { equipment: { name, isFunctionel: true, description: "" } }
      );

      setActifs(actifs.map((a) => (a._id === actifId ? res.data : a)));
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'équipement :", error);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;

      alert(`Échec de l'ajout : ${errorMessage}`);
    }
  };

  const handleUpdateEquipment = async (
    actifId,
    categoryId,
    equipmentId,
    currentEquipment
  ) => {
    const newName = prompt(
      "Nouveau nom de l'équipement :",
      currentEquipment.name
    );
    const newStatus = confirm(
      `L'équipement est-il fonctionnel ? (OK = Oui, Annuler = Non)\nActuel: ${
        currentEquipment.isFunctionel ? "Fonctionnel" : "Défectueux"
      }`
    );
    const newDescription = prompt(
      "Description de l'équipement :",
      currentEquipment.description || ""
    );

    if (!newName) return;

    try {
      await axios.put(
        `http://localhost:3000/api/actifs/${actifId}/categories/${categoryId}/equipments/${equipmentId}`,
        {
          name: newName,
          isFunctionel: newStatus,
          description: newDescription,
        }
      );

      setActifs(
        actifs.map((actif) => {
          if (actif._id === actifId) {
            return {
              ...actif,
              categories: actif.categories.map((category) => {
                if (category._id === categoryId) {
                  return {
                    ...category,
                    equipments: category.equipments.map((equipment) => {
                      if (equipment._id === equipmentId) {
                        return {
                          ...equipment,
                          name: newName,
                          isFunctionel: newStatus,
                          description: newDescription,
                        };
                      }
                      return equipment;
                    }),
                  };
                }
                return category;
              }),
            };
          }
          return actif;
        })
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'équipement :", error);
    }
  };

  // Ouvrir le dialog d'historique
  const handleShowHistory = (equipment) => {
    setSelectedEquipment(equipment);
    setHistoryDialogOpen(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Configuration des Actifs</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setOpenDialog(true)}
        >
          ➕ Ajouter un Actif
        </button>
      </div>

      <AddActifDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onAddActif={handleAddActif}
      />

      {actifs.map((actif) => (
        <div key={actif._id} className="border p-4 mb-4 rounded shadow">
          <h3 className="text-lg font-semibold">{actif.name}</h3>
          <p className="text-sm text-gray-500">
            {actif.region} {actif.province && `- ${actif.province}`}
          </p>

          <button
            className="mt-2 mb-4 px-3 py-1 bg-blue-500 text-white rounded"
            onClick={() => handleAddCategory(actif._id)}
          >
            ➕ Ajouter une Catégorie
          </button>

          {actif.categories?.map((cat) => (
            <div key={cat._id} className="ml-4 mt-2 border-l pl-4">
              <h4 className="font-medium">{cat.name}</h4>

              <button
                className="mt-1 mb-2 px-2 py-1 bg-green-500 text-white rounded"
                onClick={() => handleAddEquipment(actif._id, cat._id)}
              >
                ➕ Ajouter Équipement
              </button>

              <ul className="ml-2 list-disc">
                {cat.equipments?.map((eq) => (
                  <li
                    key={eq._id}
                    className="text-sm flex items-center gap-2 mb-1"
                  >
                    <div className="flex flex-col">
                      <span>
                        <button
                          className="text-blue-700 underline font-medium hover:text-blue-900"
                          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                          onClick={() => handleShowHistory(eq)}
                          title="Voir l'historique de l'équipement"
                        >
                          {eq.name}
                        </button>
                        {" — "}
                        <span
                          className={
                            eq.isFunctionel ? "text-green-600" : "text-red-500"
                          }
                        >
                          {eq.isFunctionel ? "Fonctionnel" : "Défectueux"}
                        </span>
                      </span>
                      {eq.description && (
                        <span className="text-xs text-gray-500">
                          code a barre : {eq.description}
                        </span>
                      )}
                    </div>
                    <button
                      className="text-blue-500 text-xs hover:underline"
                      onClick={() =>
                        handleUpdateEquipment(actif._id, cat._id, eq._id, eq)
                      }
                    >
                      ✏️ Modifier
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}

      <EquipmentHistoryDialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        equipment={selectedEquipment}
      />
    </div>
  );
};

export default ConfigurationAsset;