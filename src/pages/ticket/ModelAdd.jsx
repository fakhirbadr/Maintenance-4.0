import React, { useState } from "react";

const ModelAdd = ({ setModelAddIsOpen }) => {
  // State to manage form data
  const [selectedRowData, setSelectedRowData] = useState(null);

  const [formData, setFormData] = useState({
    date: "",
    site: "",
    technicien: "",
    typeIntervention: "",
    status: "",
    dateDebut: "",
    description: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Process formData (e.g., send it to an API)
    console.log(formData);
  };

  return (
    <div>
      {/* Title */}
      <h2 className="text-4xl font-extrabold dark:text-white pb-4">
        Ajouter un ticket
      </h2>
      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-y-6">
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
            <div className="flex-1 ">
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
                value={formData.site}
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
                <option value="">Sélectionnez un type d'intervention</option>
                <option value="maintenance">Maintenance</option>
                <option value="réparation">Réparation</option>
                <option value="installation">Installation</option>
                <option value="inspection">Inspection</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div className="flex-1">
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="status"
              >
                Status
              </label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Sélectionnez un statut</option>
                <option value="en_cours">En cours</option>
                <option value="terminé">Terminé</option>
                <option value="annulé">Annulé</option>
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
                id="dateDebut"
                name="dateDebut"
                value={formData.dateDebut}
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex-1">
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
          {/* Buttons */}
          <div className="flex justify-end gap-x-4 mt-6">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Soumettre
            </button>
            <button
              type="button"
              onClick={() => setModelAddIsOpen(false)}
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

export default ModelAdd;
