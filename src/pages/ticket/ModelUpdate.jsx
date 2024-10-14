import React, { useState, useEffect } from "react";

const ModelUpdate = ({ rowData, setModelUpdateOpen }) => {
  const [formData, setFormData] = useState({
    Site: rowData.site || "",
    date: rowData.date || "",
    technicien: rowData.technicien || "",
    typeIntervention: rowData.typeIntervention || "",
    statut: rowData.statut || "",
    description: rowData.description || "",
    heureDebut: rowData.heureDebut || "",
    heureFin: rowData.heureFin || "",
    commentaires: rowData.commentaires || "",
  });

  useEffect(() => {
    if (rowData) {
      setFormData(rowData); // Mettre à jour le state avec les données de la ligne
    }
  }, [rowData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Affichez formData pour vérifier sa structure
    setModelUpdateOpen(false); // Fermer le modal après la soumission
  };

  return (
    <div>
      <h2 className="text-4xl font-extrabold dark:text-white pb-4">
        Modifier un ticket
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-y-6  ">
          <div className="flex flex-row gap-x-4">
            <div className="flex-1">
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="date"
              >
                Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div className="flex-1">
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="site"
              >
                Site
              </label>
              <input
                type="text"
                name="site"
                id="site"
                value={formData.Site}
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex flex-row gap-x-4">
            <div className="flex-1">
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="technicien"
              >
                Technicien
              </label>
              <input
                type="text"
                name="technicien"
                id="technicien"
                value={formData.technicien}
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div className="flex-1">
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="typeIntervention"
              >
                Type d'intervention
              </label>
              <select
                name="typeIntervention"
                id="typeIntervention"
                value={formData.typeIntervention}
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value={formData.typeIntervention}>
                  {formData.typeIntervention}
                </option>
                <option value="maintenance">Maintenance</option>
                <option value="réparation">Réparation</option>
                <option value="installation">Installation</option>
                <option value="inspection">Inspection</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>
          <div className="flex flex-row gap-x-4">
            <div className="flex-1">
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="dateDebut"
              >
                Date de début
              </label>
              <input
                type="datetime-local"
                id="dateDebut" // Make sure the id is descriptive
                name="heureDebut" // Change this to match your formData property
                value={formData.heureDebut}
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div className="flex-1">
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="dateDebut"
              >
                Date de fin
              </label>
              <input
                type="datetime-local"
                id="datefin"
                name="heureFin"
                value={formData.heureFin}
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex flex-row gap-x-4">
            <div className="flex-1">
              {" "}
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              ></textarea>
            </div>
            <div className="flex-1">
              {" "}
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="description"
              >
                Commentaire
              </label>
              <textarea
                name="Commentaire"
                id="Commentaire"
                value={formData.commentaires}
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              ></textarea>
            </div>
          </div>
          {/* Ajoutez d'autres champs ici pour technicien, type d'intervention, etc. */}
          <div className="flex justify-end gap-x-4 mt-6">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Soumettre
            </button>
            <button
              type="button"
              onClick={() => setModelUpdateOpen(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Annuler
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ModelUpdate;
