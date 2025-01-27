import React from "react";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";

const CardInfo = ({ title, value, icon: IconComponent }) => {
  return (
    <div className="flex flex-col text-black">
      <div className="text-xl font-bold text-gray-700 mb-4">{title}</div>
      <div className="flex justify-between items-center px-5">
        <span className="text-4xl font-extrabold">{value}</span>
        <span className="text-[#880B25]">
          {IconComponent && <IconComponent style={{ fontSize: "48px" }} />}
        </span>
      </div>
    </div>
  );
};

export default CardInfo;
