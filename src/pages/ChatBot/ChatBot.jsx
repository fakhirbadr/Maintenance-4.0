import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User, MessageCircle } from "lucide-react";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const predefinedQuestions = [
    "Quelle est la météo aujourd'hui ?",
    "Comment contacter le support technique ?",
    "Quels sont vos horaires d'ouverture ?",
    "Comment créer un compte ?",
    "Où puis-je trouver de l'aide ?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = (input) => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Ajout du message utilisateur avec animation
    setMessages((prev) => [
      ...prev,
      {
        text: trimmedInput,
        sender: "user",
        id: Date.now(),
        animate: true,
      },
    ]);

    setIsTyping(true);

    // Simulation de réponse du bot avec délai
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          text: "Je vous prie de m'excuser, je suis encore en phase d'entraînement. Comment puis-je vous aider ?",
          sender: "bot",
          id: Date.now() + 1,
          animate: true,
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
    <div className=" bg-gradient-to-br   text-gray-100">
      <div className="container mx-auto p-4 lg:p-8 max-w-7xl">
        {/* Header animé */}
        <div className="text-center mb-8 animate-fade-in-down">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Assistant Virtuel IA
          </h1>
          <p className="text-gray-400 mt-2">
            Comment puis-je vous aider aujourd'hui ?
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Questions prédéfinies */}
          <div className="xl:w-1/4 space-y-3 animate-fade-in-left">
            <h2 className="text-xl font-bold text-purple-400 mb-6 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Questions fréquentes
            </h2>
            <div className="space-y-3">
              {predefinedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(question)}
                  className="w-full p-4 text-left rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 
                           hover:from-gray-700 hover:to-purple-800 transition-all duration-300 
                           border border-gray-600 hover:border-purple-400 
                           transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-sm">{question}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Zone de chat principale */}
          <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-right">
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-purple-600 to-blue-600">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Bot className="w-6 h-6" />
                Assistant Virtuel
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">En ligne</span>
                </div>
              </h2>
            </div>

            {/* Messages avec animations */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-900/50 to-gray-800/50">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 py-12 animate-fade-in">
                  <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>
                    Démarrez la conversation en tapant votre message ci-dessous
                  </p>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex animate-fade-in-up ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`max-w-2xl p-4 rounded-2xl shadow-lg ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm transform hover:scale-105 transition-transform duration-200"
                        : "bg-gradient-to-r from-gray-700 to-gray-600 text-gray-100 rounded-bl-sm transform hover:scale-105 transition-transform duration-200"
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {message.sender === "user" ? (
                        <User className="w-4 h-4 mt-0.5" />
                      ) : (
                        <Bot className="w-4 h-4 mt-0.5" />
                      )}
                      <span className="text-xs opacity-75">
                        {message.sender === "user" ? "Vous" : "Assistant"}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <span className="block mt-2 text-xs opacity-50">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="max-w-xs p-4 rounded-2xl bg-gradient-to-r from-gray-700 to-gray-600 text-gray-100 rounded-bl-sm">
                    <div className="flex items-center gap-1">
                      <Bot className="w-4 h-4" />
                      <span className="text-xs opacity-75 ml-1">Assistant</span>
                    </div>
                    <div className="flex space-x-1 mt-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie élargie avec animations */}
            <div className="p-6 border-t border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
              <div className="flex gap-3">
                <textarea
                  ref={inputRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Écrivez votre message... (Appuyez sur Entrée pour envoyer)"
                  className="flex-1 p-4 rounded-lg bg-gray-900 border border-gray-600 focus:outline-none 
                           focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 
                           transition-all duration-300 text-gray-100 placeholder-gray-400 
                           resize-none overflow-y-auto min-h-16 max-h-32"
                  rows={2}
                />
                <button
                  onClick={() => handleSend(userInput)}
                  disabled={!userInput.trim()}
                  className="px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 
                           hover:from-purple-700 hover:to-blue-700 rounded-lg font-medium 
                           transition-all duration-300 focus:outline-none focus:ring-2 
                           focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 
                           transform hover:scale-105 hover:shadow-lg disabled:opacity-50 
                           disabled:transform-none disabled:hover:shadow-none"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        /* Scrollbar personnalisée */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #1f2937;
        }

        ::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default ChatBot;
