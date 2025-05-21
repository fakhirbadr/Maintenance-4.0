import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "./1.jpg";
import scxLogo from "../../../public/scx.png"; // Assurez-vous que le chemin est correct

import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserMd,
  faIdCard,
  faHeartPulse,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      axios
        .get(`${apiUrl}/api/v1/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setAccounts(response.data);
          console.log(response.data);
          navigate("/");
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des comptes:", error);
          setErrorMessage(
            "Token expiré ou invalide. Veuillez vous reconnecter."
          );
          localStorage.removeItem("authToken");
        });
    }
  }, [navigate]);

  // Nouvelle version : fetch noms et objets complets des actifs de l'utilisateur
  const fetchActifDataAndNames = async (actifIds) => {
    try {
      const actifResponses = await Promise.all(
        actifIds.map(async (id) => {
          const response = await axios.get(`${apiUrl}/api/actifs/${id}`);
          return response.data;
        })
      );
      // Stocke les noms seulement
      const actifNames = actifResponses.map((actif) => actif.name);
      localStorage.setItem("nameActifUser", JSON.stringify(actifNames));
      // Stocke toutes les données utiles (nom, region, province, etc.)
      localStorage.setItem("cachedActifData", JSON.stringify(actifResponses));
    } catch (error) {
      console.error("Erreur lors de la récupération des actifs:", error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    axios
      .post(`${apiUrl}/api/v1/users/login`, {
        email,
        password,
      })
      .then((response) => {
        const { token, user } = response.data;
        console.log(response.data);
        if (token && user) {
          localStorage.setItem("authToken", token);

          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              id: user.id,
              email: user.email,
              role: user.role,
              site: user.site,
              region: user.region,
              province: user.province,
              nomComplet: user.nomComplet,
              soldeConges: user.soldeConges,
            })
          );

          if (user.actifIds && Array.isArray(user.actifIds)) {
            localStorage.setItem("userActifs", JSON.stringify(user.actifIds));
            fetchActifDataAndNames(user.actifIds); // Charge noms + data en localStorage
          } else {
            localStorage.setItem("userActifs", JSON.stringify([]));
            localStorage.setItem("nameActifUser", JSON.stringify([]));
            localStorage.setItem("cachedActifData", JSON.stringify([]));
          }

          axios
            .post(
              `${apiUrl}/api/v1/connection-history/record`,
              {
                userId: user.id,
                email: user.email,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then(() => {
              console.log("Historique des connexions enregistré.");
            })
            .catch((error) => {
              console.error(
                "Erreur lors de l'enregistrement de l'historique:",
                error
              );
            });

          navigate("/");
        }
      })
      .catch((error) => {
        if (error.response) {
          setErrorMessage(
            error.response.data.message || "Erreur de connexion."
          );
        } else if (error.request) {
          setErrorMessage(
            "Pas de réponse du serveur. Vérifiez votre connexion."
          );
        } else {
          setErrorMessage("Une erreur est survenue lors de la connexion.");
        }
        console.error("Erreur lors de la connexion:", error);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-400 to-cyan-500 relative overflow-hidden">
      {/* Fond animé médical */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGgxNnYxNkgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik04IDBhOCA4IDAgMTAwIDE2QTE2IDE2IDAgMDA4IDB6IiBmaWxsLW9wYWNpdHk9Ii4xIiBmaWxsPSIjZmZmIi8+PC9zdmc+')] opacity-10 animate-pulse"></div>
      </div>

      <section className="w-full z-10 transform transition-all duration-500 ease-in-out">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="mb-10 space-y-4 text-center animate-fade-in-down">
            <img
              src={scxLogo}
              alt="SCX Logo"
              className="w-75 h-32 mx-auto animate-heartbeat filter"
            />
            <p className="text-cyan-100 font-light text-lg">
              Digital Healthcare Asset Management
            </p>
          </div>

          <div className="w-full bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl md:mt-0 sm:max-w-md xl:p-0 transition-transform duration-300 hover:scale-102">
            <div className="p-8 space-y-6 sm:p-10">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon
                  icon={faUserMd}
                  className="text-white text-3xl"
                />
                <h1 className="text-2xl font-bold text-white">
                  Professional Login
                </h1>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 p-3 bg-red-100 rounded-lg animate-shake">
                  <FontAwesomeIcon
                    icon={faExclamationCircle}
                    className="text-red-500"
                  />
                  <p className="text-sm text-red-500">{errorMessage}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleLogin}>
                <div className="group relative">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/30 backdrop-blur-sm text-white rounded-lg border-2 border-white/20 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200 outline-none transition-all duration-300 placeholder:text-white/60"
                    placeholder="nomComplet@scx.com"
                    required
                  />
                  <FontAwesomeIcon
                    icon={faIdCard}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 group-focus-within:text-cyan-300 transition-colors"
                  />
                </div>

                <div className="group relative">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-white/30 backdrop-blur-sm text-white rounded-lg border-2 border-white/20 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200 outline-none transition-all duration-300 placeholder:text-white/60"
                    required
                  />
                  <FontAwesomeIcon
                    icon={faUserMd}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 group-focus-within:text-cyan-300 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-cyan-400 hover:bg-cyan-500 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon
                    icon={faHeartPulse}
                    className="animate-pulse"
                  />
                  <span>Secure Login</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
