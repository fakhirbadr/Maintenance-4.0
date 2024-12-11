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

const AddProfil = () => {
  const [formData, setFormData] = useState({
    POSTE: "",
    Name: "",
    Sexe: "",
    CIN: "",
    DateEmbauche: "",
    DateNaissance: "",
    Adresse: "",
    Telephone: "",
    Email: "",
  });
  const [selectedRegion, setSelectedRegion] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [formNumber, setFormNumber] = useState(0);
  const totalForms = 3; // Nombre total de divs

  const handleRegionChange = (event) => {
    const region = event.target.value;
    setSelectedRegion(region);
    setProvinces(regionsProvinces[region] || []);
  };

  // Fonction pour passer au div suivant
  const nextForm = () => {
    if (formNumber < totalForms - 1) {
      setFormNumber(formNumber + 1);
    }
  };

  // Fonction pour revenir au div précédent
  const prevForm = () => {
    if (formNumber > 0) {
      setFormNumber(formNumber - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process formData (e.g., send it to an API)
    console.log(formData);
  };

  return (
    <div>
      {/* Affiche le div correspondant au numéro de formulaire */}
      {formNumber === 0 && (
        <div>
          <h2 className="text-4xl font-extrabold dark:text-white pb-4">
            Ajouter un profil
          </h2>
          <hr />
          <form onSubmit={handleSubmit} className="flex pt-6 flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-x-4">
              <div className="flex-1">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="POSTE"
                >
                  Poste
                </label>
                <select
                  name="POSTE"
                  id="POSTE"
                  value={formData.POSTE}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Sélectionner un poste</option>
                  <option value="Technicien">Technicien</option>
                  <option value="Infirmier">Infirmier</option>
                  <option value="Docteur">Docteur</option>
                  <option value="Technicien Coordinateur">
                    Technicien Coordinateur
                  </option>
                  <option value="Assistant Technique">
                    Assistant Technique
                  </option>
                </select>
              </div>
              <div className="flex-1">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="name"
                >
                  Nom
                </label>
                <input
                  type="text"
                  name="Name"
                  id="name"
                  value={formData.Name}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-x-4">
              <div className="flex-1">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="sexe"
                >
                  Sexe
                </label>
                <select
                  name="Sexe"
                  id="sexe"
                  value={formData.Sexe}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Sélectionner un sexe</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                </select>
              </div>
              <div className="flex-1">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="cin"
                >
                  CIN
                </label>
                <input
                  type="text"
                  name="CIN"
                  id="cin"
                  value={formData.CIN}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-x-4">
              <div className="flex-1">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="dateEmbauche"
                >
                  Date d'embauche
                </label>
                <input
                  type="date"
                  name="DateEmbauche"
                  id="dateEmbauche"
                  value={formData.DateEmbauche}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div className="flex-1">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="dateNaissance"
                >
                  Date de naissance
                </label>
                <input
                  type="date"
                  name="DateNaissance"
                  id="dateNaissance"
                  value={formData.DateNaissance}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="adresse"
              >
                Adresse
              </label>
              <input
                type="text"
                name="Adresse"
                id="adresse"
                value={formData.Adresse}
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={nextForm}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Suivant
            </button>
          </form>
        </div>
      )}

      {formNumber === 1 && (
        <div>
          <h2 className="text-4xl font-extrabold dark:text-white pb-4">
            Informations de contact
          </h2>
          <hr />
          <form onSubmit={handleSubmit} className="flex pt-6 flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-x-4">
              <div className="flex-1">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="telephone"
                >
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="Telephone"
                  id="telephone"
                  value={formData.Telephone}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div className="flex-1">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="Email"
                  id="email"
                  value={formData.Email}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-x-4">
              <button
                type="button"
                onClick={prevForm}
                className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={nextForm}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Suivant
              </button>
            </div>
          </form>
        </div>
      )}

      {formNumber === 2 && (
        <div>
          <h2 className="text-4xl font-extrabold dark:text-white pb-4">
            Résumé
          </h2>
          <hr />
          <div className="mt-4">
            <h3 className="text-2xl ">Détails du profil</h3>
            <p>
              <strong>Poste:</strong> {formData.POSTE}
            </p>
            <p>
              <strong>Nom:</strong> {formData.Name}
            </p>
            <p>
              <strong>Sexe:</strong> {formData.Sexe}
            </p>
            <p>
              <strong>CIN:</strong> {formData.CIN}
            </p>
            <p>
              <strong>Date d'embauche:</strong> {formData.DateEmbauche}
            </p>
            <p>
              <strong>Date de naissance:</strong> {formData.DateNaissance}
            </p>
            <p>
              <strong>Adresse:</strong> {formData.Adresse}
            </p>
            <p>
              <strong>Téléphone:</strong> {formData.Telephone}
            </p>
            <p>
              <strong>Email:</strong> {formData.Email}
            </p>
          </div>
          <button
            type="button"
            onClick={prevForm}
            className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Précédent
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Soumettre
          </button>
        </div>
      )}
    </div>
  );
};

export default AddProfil;
