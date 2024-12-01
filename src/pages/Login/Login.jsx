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
    const token = localStorage.getItem("authToken"); // ou sessionStorage

    axios
      .get("http://localhost:3000/api/v1/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`, // Ajouter le token au header
        },
      })
      .then((response) => {
        setAccounts(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des comptes:", error);
      });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3000/api/v1/users/login", { email, password })
      .then((response) => {
        // Si la connexion est réussie, stocke le token et redirige
        localStorage.setItem("authToken", response.data.token);
        navigate("/tickets");
      })
      .catch((error) => {
        setErrorMessage("Erreur de connexion. Vérifiez vos identifiants.");
        console.error("Erreur lors de la connexion:", error);
      });
  };

  return (
    <div
      className="flex justify-center items-center h-screen text-white"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <section className="dark:bg-gray-900 w-full">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center text-black mb-6 text-2xl font-semibold dark:text-white"
          >
            <img
              className="w-8 h-8 mr-2"
              src="https://cdn-icons-png.flaticon.com/512/5759/5759665.png"
              alt="logo"
            />
            Gestion intelligente de la maintenance pour les unités mobiles
            <img
              className="w-8 h-8 mr-2"
              src="https://cdn-icons-png.flaticon.com/512/5759/5759665.png"
              alt="logo"
            />
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
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
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <a
                    href="/signup"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
