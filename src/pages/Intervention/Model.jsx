import {
  Checkbox,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
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
        Ajouter une nouvelle INTERVENTION
      </h2>
      {/* Form */}
      <form action="">
        <div className="flex flex-col gap-y-6">
          {/* Ligne 1 */}
          <div className="flex flex-row gap-x-4">
            {/* Date */}
            <div className="flex-1">
              <label
                htmlFor="Date"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Date <span className="text-red-700">*</span>
              </label>
              <input
                type="datetime-local"
                id="meeting-time"
                name="meeting-time"
                value={new Date().toISOString().slice(0, 16)}
                min="2018-06-07T00:00"
                max="2018-06-14T00:00"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                disabled
              />
            </div>
            {/* Technicien */}
            <div className="flex-1">
              <label
                htmlFor="Technicien"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Technicien <span className="text-red-700">*</span>
              </label>
              <select
                id="Technicien"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option disabled hidden selected>
                  Choisissez le Technicien
                </option>
                <option value="US">DANIR Oussama</option>
                <option value="CA">DHAIR Ismail</option>
                <option value="FR">NAJEM Oussama</option>
                <option value="DE">HACHIMI Salah</option>
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
            {/* <div className="flex-1">
              <label
                htmlFor="Latitude "
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Latitude <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                id="Latitude "
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Latitude"
                required
              />
            </div> */}
            {/* longitude  */}
            {/* <div className="flex-1">
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
            </div> */}
          </div>
          {/* ligne 3 */}

          <div className="flex flex-row gap-x-4">
            {/* Chargé_de_suivie  */}
            <div className="flex-1">
              <label
                htmlFor="Technicien"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Type <span className="text-red-700">*</span>
              </label>
              <select
                id="Technicien"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option disabled hidden selected>
                  Choisissez le type
                </option>
                <option value="US">A distance</option>
                <option value="CA">Physique</option>
              </select>
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
            {/* Unité */}
            <div className="flex-1">
              <label
                htmlFor="Site"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Site <span className="text-red-700">*</span>
              </label>
              <select
                id="Site"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option disabled hidden selected>
                  Choisissez le Site
                </option>
                <option value="US">UMMC OUMEJRANE TINGHIR</option>
                <option value="CA">UMMC SETTAT</option>
                <option value="FR">UMMC AGADIR</option>
                <option value="DE">UMMC TIZNIT</option>
              </select>
            </div>
          </div>
          {/* ligne 4 */}
          <div className="flex flex-row gap-x-4">
            {/* Status  */}
            <div className="flex-1">
              <FormLabel id="demo-row-radio-buttons-group-label ">
                <label
                  htmlFor=""
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Status
                </label>
              </FormLabel>
              <div className="flex justify-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                >
                  <FormControlLabel
                    value="En cours"
                    control={<Radio />}
                    label="En cours"
                  />
                  <FormControlLabel
                    value="Annulé"
                    control={<Radio />}
                    label="Annulé"
                  />
                  <FormControlLabel
                    value="Terminé"
                    control={<Radio />}
                    label="Terminé"
                  />
                </RadioGroup>
              </div>
            </div>
          </div>
          {/* ligne 5 */}
          {/* Photo  */}
          <div className=" justify-center items-center gap-x-4">
            <label
              htmlFor=""
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Priorité
            </label>
            <div className="flex justify-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Urgent"
              />
              <FormControlLabel control={<Checkbox />} label="Moyen" />
              <FormControlLabel control={<Checkbox />} label="Normal" />
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
