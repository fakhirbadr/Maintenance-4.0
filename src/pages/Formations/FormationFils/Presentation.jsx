import React from "react";
import videoPrez from "../FormationFils/1.mp4";
import Location from "../../../components/Location";

const Presentation = () => {
  return (
    <div className="flex flex-col ">
      <div>
        <Location />
      </div>
      <div className="flex justify-center items-center pt-6">
        {" "}
        <video
          className="flex  justify-center items-center " // Ajuste la taille maximale de la vidéo
          src={videoPrez}
          controls
          width="800"
          height="300"
        ></video>
      </div>
    </div>
  );
};

export default Presentation;
