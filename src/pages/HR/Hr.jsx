import Layout from "./Layout";

import TopBar from "./TopBar";
import React from "react";

const Hr = () => {
  return (
    <>
      <Layout />
      <div className="px-2 py-20 w-full flex justify-center pt-52">
        <div className="bg-white lg:mx-8 lg:flex lg:max-w-6xl lg:shadow-lg rounded-lg">
          {" "}
          {/* Augmenter le max-w-5xl à max-w-6xl */}
          <div className="lg:w-1/2">
            <div
              className="lg:scale-110 h-80 bg-cover lg:h-full rounded-b-none border lg:rounded-lg"
              style={{
                backgroundImage:
                  "url('https://zagrebglobal.com/wp-content/uploads/2024/08/hr-trends-shaping-2024-and-beyond.jpg')",
              }}
            ></div>
          </div>
          <div className="py-12 px-6 lg:px-12 max-w-xl lg:max-w-6xl lg:w-1/2 rounded-t-none border lg:rounded-lg">
            {" "}
            {/* Augmenter le max-w-5xl à max-w-6xl */}
            <h2 className="text-3xl text-gray-800 font-bold">
              <span className="text-3xl text-[#9C1B33] uppercase font-bold">
                SCX Technology
              </span>{" "}
              vous propose une plateforme en ligne dédiée à faciliter vos
              échanges et collaborations
            </h2>
            <p className="mt-4 text-gray-600">
              Cette plateforme en ligne vous permet de gérer vos demandes de
              congé de manière simple et rapide, de consulter discrètement vos
              réclamations et d'accéder aux dernières actualités de
              l'entreprise, le tout dans un environnement sécurisé et intuitif
            </p>
            <div className="mt-8">
              <a
                href="/DemandeCongé"
                className="bg-gray-900 text-gray-100 px-5 py-3 font-semibold rounded"
              >
                Start Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hr;
