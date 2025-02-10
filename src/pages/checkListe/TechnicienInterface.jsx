import React, { useEffect, useState } from "react";
import Formulaire from "./Formulaire";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const TechnicienInterface = () => {
  const [dynamicActifs, setDynamicActifs] = useState([]);

  useEffect(() => {
    const fetchActifNames = async () => {
      const cachedNames = localStorage.getItem("cachedActifNames");
      if (cachedNames) {
        setDynamicActifs(JSON.parse(cachedNames));
      } else {
        const userIds = JSON.parse(localStorage.getItem("userActifs"));
        if (userIds && Array.isArray(userIds)) {
          try {
            const responses = await Promise.all(
              userIds.map((id) => axios.get(`${apiUrl}/api/actifs/${id}`))
            );
            const fetchedNames = responses.map(
              (response) => response.data.name
            );
            localStorage.setItem(
              "cachedActifNames",
              JSON.stringify(fetchedNames)
            );
            setDynamicActifs(fetchedNames);
          } catch (error) {
            console.error("Erreur lors de la récupération des actifs", error);
          }
        }
      }
    };

    fetchActifNames();
  }, []);
  return (
    <div>
      <div className="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl uppercase text-orange-500">
        Inventaire hebdomadaire
      </div>
      <div>
        <h2 className="flex flex-row flex-nowrap items-center ">
          <span className="flex-grow block border-t border-black"></span>
          <span className="flex-none block mx-4 px-4 py-2.5 text-xl rounded leading-none font-medium bg-orange-400 text-black">
            Merci de remplire le formulaire
          </span>
          <span className="flex-grow block border-t border-black"></span>
        </h2>
      </div>
      <div className="pt-32">
        <Formulaire />
      </div>
    </div>
  );
};

export default TechnicienInterface;
