import React, { useEffect, useState } from "react";
import axios from "axios";

const ConfigurationAsset = () => {
  const [actifs, setActifs] = useState([]);

  // Charger les actifs
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Configuration des Actifs</h2>
      {actifs.map((actif) => (
        <div key={actif._id} className="border p-4 mb-4 rounded shadow">
          <h3 className="text-lg font-semibold">{actif.name}</h3>
          <p className="text-sm text-gray-500">{actif.region}</p>

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
                        {eq.name} —
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
    </div>
  );
};

export default ConfigurationAsset;
