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

      <div className="flex gap-28 justify-center ">
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

      <div>
        <SwiperImage />
      </div>
      <div className="max-w-3xl mx-auto text-center mt-16">
        <h1 className="text-2xl font-bold text-white leading-tight mb-2 border-t-4 border-b-4 border-purple-600 pt-2">
          Chaque action que nous supervisons contribue à un avenir plus sain
          pour notre communauté.
        </h1>
      </div>
    </div>
  );
};

export default TempReel;
