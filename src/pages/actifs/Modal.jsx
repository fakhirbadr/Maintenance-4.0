import React, { useState } from "react";

const regionsProvinces = {
  "Grand Casablanca-Settat": [
    "Casablanca",
    "Mohammedia",
    "El Jadida",
    "Settat",
    "Berrchid",
  ],
  "Rabat-Salé-Kénitra": [
    "Rabat",
    "Salé",
    "Kénitra",
    "Sidi Kacem",
    "Sidi Slimane",
  ],
  "Marrakech-Safi": [
    "Marrakech",
    "El Kelaa des Sraghna",
    "Chichaoua",
    "Safi",
    "Youssoufia",
  ],
  "Fès-Meknès": ["Fès", "Meknès", "Taza", "Ifrane", "El Hajeb"],
  "Souss-Massa": [
    "Agadir",
    "Tiznit",
    "Taroudant",
    "Chtouka Ait Baha",
    "Inezgane",
  ],
  "Béni Mellal-Khénifra": [
    "Béni Mellal",
    "Khénifra",
    "Azilal",
    "Khouribga",
    "Fqih Bensalah",
  ],
  "Drâa-Tafilalet": ["Errachidia", "Ouarzazate", "Zagora", "Midelt", "Tinghir"],

  "Tanger-Tetouan-Al Hoceima": [
    "Tanger",
    "Tetouan",
    "Al Hoceima",
    "Chefchaouen",
    "Larache",
  ],
  "Eddakhla-Oued Eddahab": ["Dakhla", "Oued Eddahab"],
  "Guelmim-Oued Noun": [
    "Guelmim",
    "Tan-Tan",
    "Sidi Ifni",
    "Tata",
    "Ouarzazate",
  ],
  Oriental: ["Oujda", "Nador", "Driouch", "Berkane", "Taourirt"],
  "Laayoune-Sakia El Hamra": ["Laayoune", "Boujdour", "Tarfaya", "Smara"],
};

const Modal = ({ setModelIsOpen }) => {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [provinces, setProvinces] = useState([]);

  const handleRegionChange = (event) => {
    const region = event.target.value;
    setSelectedRegion(region);
    setProvinces(regionsProvinces[region] || []);
  };

  return (
    <div className="p-4 ">
      {/* Titre */}
      <h2 className="text-4xl font-extrabold dark:text-white pb-4">
        Ajouter une nouvelle installation
      </h2>
      {/* Form */}
      <form action="">
        <div className="flex flex-col gap-y-6">
          {/* Ligne 1 */}
          <div className="flex   md:flex-row sm:flex-col gap-x-4">
            {/* Nom */}
            <div className="flex-1">
              <label
                htmlFor="Nom"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Nom <span className="text-red-700">*</span>
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
                Coordinateur <span className="text-red-700">*</span>
              </label>
              <select
                id="countries"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option disabled hidden selected>
                  Choisissez le coordinateur
                </option>
                <option value="US">Oumaima LALLALEN</option>
                <option value="CA">Mohamed RAZIN</option>
                <option value="FR">Ismail BELGHITI</option>
                <option value="DE">Abderahmen AKRAN</option>
              </select>
            </div>
          </div>
          {/* Ligne 2 */}
          <div className="flex flex-row gap-x-4">
            {/* Région */}
            <div className="flex-1">
              {" "}
              <label
                htmlFor="countries"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Région <span className="text-red-700">*</span>
              </label>
              <select
                id="countries"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={selectedRegion}
                onChange={handleRegionChange}
              >
                <option hidden selected>
                  Choisissez La région
                </option>
                {Object.keys(regionsProvinces).map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            {/* Province */}
            <div className="flex-1">
              {" "}
              <label
                htmlFor="province"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Province <span className="text-red-700">*</span>
              </label>
              <select
                id="province"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                disabled={!selectedRegion}
              >
                <option disabled hidden selected>
                  Choisissez La province
                </option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>
            {/* Adresse */}

            {/* Latitude  */}
            <div className="flex-1">
              <label
                htmlFor="Latitude "
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Latitude <span className="text-red-700">*</span>
              </label>
              <input
                type="number"
                id="Latitude "
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Latitude"
                required
              />
            </div>
            {/* longitude  */}
            <div className="flex-1">
              <label
                htmlFor="longitude "
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                longitude <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                id="longitude "
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="longitude "
                required
              />
            </div>
          </div>
          {/* ligne 3 */}

          <div className="flex flex-row gap-x-4">
            {/* Chargé_de_suivie  */}
            <div className="flex-1">
              <label
                htmlFor="Nom"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Chargé_de_suivie <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
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
                Technicien <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
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
                Docteur <span className="text-red-700">*</span>
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
                Adresse mail <span className="text-red-700">*</span>
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
                Télephone <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                id="Télephone"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="123-456-7890"
                required
              />
            </div>
          </div>
          {/* ligne 5 */}
          {/* Photo  */}
          <div className="flex justify-center items-center gap-x-4">
            <div className="flex items-center justify-center ">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" />
              </label>
            </div>
          </div>
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
            onClick={() => setModelIsOpen(false)}
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
