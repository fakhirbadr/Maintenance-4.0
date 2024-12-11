import React, { useState } from "react";
import Location from "../../components/Location";

const ChatBot = () => {
  // État pour stocker les messages
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  // Questions prédéfinies
  const predefinedQuestions = [
    "Quelle est la météo aujourd'hui ?",
    "Comment contacter le support technique ?",
    "Quels sont vos horaires d'ouverture ?",
  ];

  // Fonction pour gérer l'envoi de message
  const handleSend = (input) => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      // Simuler une réponse du chatbot
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Voici une réponse automatique", sender: "bot" },
        ]);
      }, 1000);
    }
    setUserInput(""); // Réinitialiser le champ d'entrée
  };

  // Fonction pour gérer la sélection d'une question prédéfinie
  const handlePredefinedQuestionClick = (question) => {
    handleSend(question);
  };

  return (
    <>
      <div>
        <Location />
      </div>
      <div className="flex flex-col md:flex-row gap-x-4 p-4">
        {/* Colonne de gauche avec les boutons de questions prédéfinies */}
        <div className="w-full md:w-1/3 bg-gray-800 p-4 rounded-lg shadow-md mb-4 md:mb-0">
          <div className="text-lg font-semibold mb-4">Questions suggérées</div>
          <div className="flex flex-col space-y-2">
            {predefinedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handlePredefinedQuestionClick(question)}
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Colonne de droite avec le chat */}
        <div className="w-full md:w-2/3 bg-gray-800 p-4 rounded-lg shadow-md">
          <Location />
          <div className="text-xl font-semibold mb-4">Chat v1</div>

          {/* Affichage des messages */}
          <div className="h-64  overflow-y-auto bg-gray-300 p-2 rounded-md mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-md max-w-xs  ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-300 text-black"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          {/* Zone de saisie */}
          <div className="flex mt-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Écris ton message..."
              className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none"
            />
            <button
              onClick={() => handleSend(userInput)}
              className="bg-blue-500 text-white p-2 rounded-r-md"
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
