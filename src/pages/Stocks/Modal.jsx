import { TextField } from "@mui/material";
import React from "react";

const Modal = ({ handleClose }) => {
  return (
    <div className="p-4 bg-blue-500 rounded-md shadow-lg w-[40%] ">
      {/* Titre */}
      <h2 className="text-4xl font-extrabold dark:text-white pb-4">
        Ajouter un nouveau stock
      </h2>
      {/* Form */}
      <form action="">
        <div className="flex flex-col gap-y-6">
          {/* Ligne 1 */}
          <div className="flex flex-row gap-x-4">
            {/* Nom */}
            <div className="flex-1">
              <label
                htmlFor="Nom"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Nom de la piéce <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                id="Nom"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="UMMC ABC"
                required
              />
            </div>
            {/* Coordinateur */}
            <div className="flex-1">
              <label
                htmlFor="countries"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Catégorie <span className="text-red-700">*</span>
              </label>
              <select
                id="countries"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option disabled hidden selected>
                  Choisissez le catégorie
                </option>
                <option value="US">Electrique</option>
                <option value="CA">Mécanique</option>
                <option value="FR">Matières premières</option>
                <option value="DE">Emballages</option>
                <option value="">Pièces de rechange</option>
              </select>
            </div>
          </div>
          {/* Ligne 2 */}
          {/* ligne 3 */}
          <div className="flex flex-row gap-x-4">
            {/* Chargé_de_suivie  */}
            <div className="flex-1">
              <label
                htmlFor="Nom"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Quantité <span className="text-red-700">*</span>
              </label>
              <input
                type="number"
                id="Chargé_de_suivie"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Fakhir Badr"
                required
              />
            </div>
            {/* Technicien  */}
            <div className="flex-1">
              <label
                htmlFor="Technicien"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Date d'Entrée <span className="text-red-700">*</span>
              </label>
              <input
                type="date"
                id="Technicien"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Fakhir Badr"
                required
              />
            </div>
            {/* Docteur  */}
            <div className="flex-1">
              <label
                htmlFor="Docteur"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Emplacement <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                id="Docteur"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Fakhir Badr"
                required
              />
            </div>
          </div>
          {/* ligne 4 */}
          <div className="flex flex-row gap-x-4">
            {/* adresse mail  */}
            <div className="flex-1">
              <label
                htmlFor="mail"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Réferance <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                id="mail"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="mediot@mediot.ma"
                required
              />
            </div>
            {/* Téléphone  */}
            <div className="flex-1">
              <label
                htmlFor="Télephone"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Responsable <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                id="Télephone"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="...."
                required
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="Télephone"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Compatibilité <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                id="Télephone"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="...."
                required
              />
            </div>
          </div>
          <div className="flex flex-row gap-x-4">
            <div className="flex-1">
              <label
                htmlFor="Télephone"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Observations <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                id="Télephone"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="...."
                required
              />
            </div>
          </div>
          {/* ligne 5 */}
          {/* Photo  */}
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
            onClick={() => handleClose(true)}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default Modal;
