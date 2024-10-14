import React, { useState } from "react";

const Param = ({ rowData, onSave }) => {
  // Utiliser l'état local pour gérer la modification de la quantité
  const [quantite, setQuantite] = useState(rowData.Quantite);

  const handleChange = (e) => {
    setQuantite(e.target.value); // Met à jour la quantité dans l'état local
  };

  const handleSave = () => {
    onSave({ ...rowData, Quantite: quantite }); // Sauvegarder la nouvelle quantité
  };

  return (
    <div className="flex flex-col bg-blue-300 w-full p-4 text-black">
      <div className="font-bold text-lg mb-2">Détails de la Pièce</div>
      <div>
        <strong>ID:</strong> {rowData.ID}
      </div>
      <div>
        <strong>Nom de la Pièce:</strong> {rowData["Nom de la Pièce"]}
      </div>

      {/* Champ de saisie pour la quantité */}
      <div className="mb-4 justify-center items-center">
        <strong>Quantité:</strong>
        <input
          type="number"
          value={quantite}
          onChange={handleChange}
          className="ml-2 p-1 border rounded items-center justify-center"
        />
      </div>

      <div>
        <strong>État de la Pièce:</strong> {rowData["État de la Pièce"]}
      </div>
      <div>
        <strong>Référence:</strong> {rowData.Reference}
      </div>
      <div>
        <strong>Responsable:</strong> {rowData.Responsable}
      </div>
      <div>
        <strong>Observations:</strong> {rowData.Observations}
      </div>

      {/* Bouton pour sauvegarder les modifications */}
      <button
        onClick={handleSave}
        className="mt-4 p-2 bg-green-500 text-white rounded"
      >
        Sauvegarder
      </button>
    </div>
  );
};

export default Param;
