import React, { useState, useEffect, useRef } from "react";
import Location from "../../components/Location";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const predefinedQuestions = [
    "Quelle est la météo aujourd'hui ?",
    "Comment contacter le support technique ?",
    "Quels sont vos horaires d'ouverture ?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = (input) => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Ajout du message utilisateur
    setMessages((prev) => [...prev, { text: trimmedInput, sender: "user" }]);

    // Simulation de réponse du bot
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "Je vous prie de m'excuser, je suis encore en phase d'entraînement. Comment puis-je vous aider ?",
          sender: "bot",
        },
      ]);
    }, 1000);

    setUserInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(userInput);
    }
  };

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages]);

  return (
    <>
      <Location />
      <div className="  text-gray-100">
        <div className="container mx-auto p-4 lg:p-8 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Questions prédéfinies */}
            <div className="lg:w-1/3 space-y-4">
              <h2 className="text-xl font-bold text-blue-400 mb-4">
                Questions fréquentes
              </h2>
              <div className="space-y-2">
                {predefinedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(question)}
                    className="w-full p-3 text-left rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200 
                             border border-gray-600 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Zone de chat */}
            <div className="flex-1 flex flex-col bg-gray-800 rounded-xl shadow-xl overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold text-blue-400">
                  Assistant Virtuel
                </h2>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-3xl p-4 rounded-2xl ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-700 text-gray-100 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <span className="block mt-1 text-xs opacity-70">
                        {message.sender === "user" ? "Vous" : "Assistant"} •
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie */}
              <div className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Écrivez votre message..."
                    className="flex-1 p-3 rounded-lg bg-gray-900 border border-gray-600 focus:outline-none focus:border-blue-400 
                             focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  />
                  <button
                    onClick={() => handleSend(userInput)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors duration-200 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
