import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "./1.jpg";
import axios from "axios"; // Assurez-vous d'installer axios si vous ne l'avez pas encore fait

const Login = () => {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]); // Pour stocker les comptes récupérés
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Récupérer les comptes depuis l'API
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      axios
        .get(
          "https://maintenance-4-0-backend-9.onrender.com/api/v1/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setAccounts(response.data); // Met à jour les comptes avec les données renvoyées
          console.log(response.data);
          navigate("/");
        })

        .catch((error) => {
          console.error("Erreur lors de la récupération des comptes:", error);
          setErrorMessage(
            "Token expiré ou invalide. Veuillez vous reconnecter."
          );

          localStorage.removeItem("authToken"); // Supprimer un token invalide
        });
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    axios
      .post("https://backend-v1-e3bx.onrender.com/api/v1/users/login", {
        email,
        password,
      })
      .then((response) => {
        // Si la connexion est réussie, stocke le token et les données utilisateur
        const { token, user } = response.data;
        console.log(response.data);
        if (token && user) {
          localStorage.setItem("authToken", token);

          // Stocker les informations utilisateur
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              id: user.id,
              email: user.email,
              role: user.role,
              site: user.site,
              province: user.province,
              nomComplet: user.nomComplet,
            })
          );

          // Stocker les actifs s'ils existent
          if (user.actifIds && Array.isArray(user.actifIds)) {
            localStorage.setItem("userActifs", JSON.stringify(user.actifIds));
          } else {
            localStorage.setItem("userActifs", JSON.stringify([])); // Valeur par défaut si aucun actif
          }

          // Ajouter une requête pour enregistrer l'historique des connexions
          axios
            .post(
              "https://backend-v1-e3bx.onrender.com/api/v1/connection-history/record",
              {
                userId: user.id,
                email: user.email,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`, // Inclure le token pour sécuriser la requête
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

          // Redirige vers la page tickets après la connexion
          navigate("/");
        }
      })
      .catch((error) => {
        if (error.response) {
          // Le serveur a renvoyé une réponse mais avec un code d'erreur (par exemple 401)
          setErrorMessage(
            error.response.data.message || "Erreur de connexion."
          );
        } else if (error.request) {
          // Aucune réponse du serveur
          setErrorMessage(
            "Pas de réponse du serveur. Vérifiez votre connexion."
          );
        } else {
          // Autre erreur
          setErrorMessage("Une erreur est survenue lors de la connexion.");
        }
        console.error("Erreur lors de la connexion:", error);
      });
  };

  return (
    <div
      className="flex justify-center items-center h-screen text-white"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <section className="dark:bg-gray-900 w-full ">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center text-black mb-6 text-2xl font-semibold dark:text-white"
          >
            <label
              htmlFor=""
              className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
            >
              SCX Asset Management
            </label>
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Connectez-vous à votre compte
              </h1>
              {errorMessage && (
                <p className="text-sm text-red-500">{errorMessage}</p>
              )}
              <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-400 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
                </button>
                {/* <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <a
                    href="/signup"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </a>
                </p> */}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
