import React, { useState, useEffect } from "react";

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
  "Laâyoune-Sakia El Hamra": ["Laâyoune", "Boujdour", "Tarfaya", "Smara"],
};

const UpdateModal = ({
  setUpdateModalIsOpen,
  isOpen,
  rowData,
  data,
  onClose,
}) => {
  const [selectedRegion, setSelectedRegion] = useState(rowData.Région || "");
  const [provinces, setProvinces] = useState(
    regionsProvinces[selectedRegion] || []
  );
  const [formData, setFormData] = useState({
    Nom: rowData.Nom || "",
    Région: rowData.Région || "",
    Province: rowData.province || "",
    Latitude: rowData.Latitude || "",
    Longitude: rowData.Longitude || "",
    Chargé_de_suivie: rowData.Chargé_de_suivie || "",
    Technicien: rowData.Technicien || "",
    Docteur: rowData.Docteur || "",
    mail: rowData.Mail || "",
    Téléphone: rowData.Num || "",
  });
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  useEffect(() => {
    setProvinces(regionsProvinces[selectedRegion] || []);
    setFormData((prev) => ({ ...prev, Province: "" })); // Reset province when region changes
  }, [selectedRegion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  return (
    <div className="p-4">
      <h2 className="text-4xl font-extrabold dark:text-white pb-4">
        Ajouter une nouvelle installation
      </h2>
      <form>
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-row gap-x-4">
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
                name="Nom"
                value={formData.Nom}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="UMMC ABC"
                required
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="Coordinateur"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Coordinateur <span className="text-red-700">*</span>
              </label>
              <select
                id="Coordinateur"
                name="Coordinateur"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option disabled hidden>
                  Choisissez le coordinateur
                </option>
                <option value="US">Oumaima LALLALEN</option>
                <option value="CA">Mohamed RAZIN</option>
                <option value="FR">Ismail BELGHITI</option>
                <option value="DE">Abderahmen AKRAN</option>
              </select>
            </div>
          </div>
          <div className="flex flex-row gap-x-4">
            <div className="flex-1">
              <label
                htmlFor="region"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Région <span className="text-red-700">*</span>
              </label>
              <select
                id="region"
                name="Région"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={selectedRegion}
                onChange={handleRegionChange}
                defaultValue=""
              >
                <option value="" disabled hidden>
                  Choisissez La région
                </option>
                {Object.keys(regionsProvinces).map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label
                htmlFor="province"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Province <span className="text-red-700">*</span>
              </label>
              <select
                id="province"
                name="Province"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                disabled={!selectedRegion}
                value={formData.Province}
                onChange={handleChange}
              >
                <option disabled hidden>
                  Choisissez La province
                </option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label
                htmlFor="Latitude"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Latitude <span className="text-red-700">*</span>
              </label>
              <input
                type="number"
                id="Latitude"
                name="Latitude"
                value={formData.Latitude}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="23.456"
                required
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="Longitude"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Longitude <span className="text-red-700">*</span>
              </label>
              <input
                type="number"
                id="Longitude"
                name="Longitude"
                value={formData.Longitude}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="45.678"
                required
              />
            </div>
          </div>
          <div className="flex flex-row gap-x-4">
            <div className="flex-1">
              <label
                htmlFor="Chargé_de_suivie"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Chargé de suivi <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                id="Chargé_de_suivie"
                name="Chargé_de_suivie"
                value={formData.Chargé_de_suivie}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="M. Hassan"
                required
              />
            </div>
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
                name="Technicien"
                value={formData.Technicien}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Technicien 1"
                required
              />
            </div>
          </div>
          <div className="flex flex-row gap-x-4">
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
                name="Docteur"
                value={formData.Docteur}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Dr. Mohamed"
                required
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="mail"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email <span className="text-red-700">*</span>
              </label>
              <input
                type="email"
                id="mail"
                name="mail"
                value={formData.mail}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="exemple@exemple.com"
                required
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="Téléphone"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Téléphone <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                id="Téléphone"
                name="num"
                value={formData.Téléphone}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="065xxxxx"
                required
              />
            </div>
          </div>
          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setUpdateModalIsOpen(false)}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Modifier
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateModal;
