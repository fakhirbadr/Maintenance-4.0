import React from "react";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";

const CardInfo = ({ title, value, icon: IconComponent, genderRates }) => {
  return (
    <div className="flex flex-col bg-[#FCF2E6] rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="text-xl font-bold text-gray-700 mb-4">{title}</div>
      <div className="flex justify-between items-center">
        <span className="text-4xl font-extrabold text-gray-900">{value}</span>

        {/* Vérifier si genderRates est défini et afficher Homme et Femme */}
        {genderRates && (
          <div className="flex gap-x-5 text-lg text-gray-600">
            <div className="flex items-center text-2xl">
              <span className="text-2xl" role="img" aria-label="Homme">
                ♂️
              </span>{" "}
              {genderRates.Homme}%
            </div>
            <div className="flex items-center text-2xl">
              <span className="text-2xl" role="img" aria-label="Femme">
                ♀️
              </span>{" "}
              {genderRates.Femme}%
            </div>
          </div>
        )}

        <span className="text-[#880B25]">
          {IconComponent && <IconComponent style={{ fontSize: "48px" }} />}
        </span>
      </div>
    </div>
  );
};

export default CardInfo;
