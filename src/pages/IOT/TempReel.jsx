import React from "react";
import Location from "../../components/Location";
import Card from "./Card";
import SwiperImage from "./SwiperImage";

const TempReel = () => {
  return (
    <div>
      <div>
        <Location />
      </div>

      <div className="md:flex-row sm:flex-col h-full flex gap-28 justify-center items-center ">
        <Card
          image="/images/IOT/Card/1.jpg"
          title="Capteur de température"
          description="suivi des capteur de température"
          path="/HomePageCapteur"
        />
        <Card
          image="/images/IOT/Card/2.jpg"
          title="Livraison Vaccin"
          description="suivi des capteur de température"
          path="/Livraison"
        />
        <Card
          image="/images/IOT/Card/3.jpg"
          title="GPS"
          description="suivi des capteur de température"
          path="/"
        />
        <Card
          image="/images/IOT/Card/4.jpg"
          title="Meet "
          description="suivi des capteur de température"
          path="/"
        />
      </div>
    </div>
  );
};

export default TempReel;
