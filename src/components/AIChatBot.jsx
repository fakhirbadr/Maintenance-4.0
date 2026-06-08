import React, { useState, useEffect, useRef } from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Tooltip,
  Avatar,
  Divider,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";
import ReactMarkdown from "react-markdown";

// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const AIChatBot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory]);

  useEffect(() => {
    if (open && suggestions.length === 0) {
      fetchSuggestions();
    }
  }, [open]);

  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${apiUrl}/api/v1/chatbot/suggestions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Erreur lors de la récupération des suggestions:", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message };
    const updatedHistory = [...conversationHistory, userMessage];
    setConversationHistory(updatedHistory);
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      
      const response = await axios.post(
        `${apiUrl}/api/v1/chatbot`,
        {
          message: message,
          conversationHistory: conversationHistory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiMessage = {
        role: "assistant",
        content: response.data.response,
        context: response.data.context,
        specificData: response.data.specificData,
      };

      setConversationHistory([...updatedHistory, aiMessage]);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      const errorMessage = {
        role: "assistant",
        content: "❌ Désolé, une erreur est survenue. Veuillez réessayer.",
      };
      setConversationHistory([...updatedHistory, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // Retirer l'emoji du début
    const cleanSuggestion = suggestion.replace(/^[^\w\s]+\s*/, "");
    setMessage(cleanSuggestion);
  };

  const handleReset = () => {
    setConversationHistory([]);
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Tooltip title="Assistant IA">
        <IconButton
          onClick={handleOpen}
          sx={{
            color: "white",
            position: "relative",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <SmartToyIcon />
          <Box
            sx={{
              position: "absolute",
              top: -2,
              right: -2,
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#4caf50",
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%, 100%": { opacity: 1 },
                "50%": { opacity: 0.5 },
              },
            }}
          />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            height: "80vh",
            maxHeight: "800px",
            backgroundColor: "background.paper",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            py: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SmartToyIcon />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Assistant IA SCX
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Propulsé par GPT-4
              </Typography>
            </Box>
          </Box>
          <Box>
            <IconButton onClick={handleReset} sx={{ color: "white", mr: 1 }}>
              <RefreshIcon />
            </IconButton>
            <IconButton onClick={handleClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 0,
            overflow: "hidden",
          }}
        >
          {/* Suggestions */}
          {conversationHistory.length === 0 && (
            <Box
              sx={{
                p: 2,
                backgroundColor: "action.hover",
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                💡 Suggestions de questions :
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {suggestions.slice(0, 6).map((suggestion, index) => (
                  <Chip
                    key={index}
                    label={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "primary.main",
                        color: "white",
                      },
                    }}
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {conversationHistory.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  opacity: 0.6,
                }}
              >
                <SmartToyIcon sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Bonjour ! Je suis votre assistant IA
                </Typography>
                <Typography variant="body2" textAlign="center" sx={{ maxWidth: 400 }}>
                  Je peux vous aider à analyser vos données, identifier des problèmes,
                  et vous donner des recommandations pour optimiser votre système.
                </Typography>
              </Box>
            ) : (
              conversationHistory.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    gap: 1,
                  }}
                >
                  {msg.role === "assistant" && (
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        width: 32,
                        height: 32,
                      }}
                    >
                      <SmartToyIcon fontSize="small" />
                    </Avatar>
                  )}

                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: "75%",
                      backgroundColor:
                        msg.role === "user" ? "primary.main" : "background.default",
                      color: msg.role === "user" ? "white" : "text.primary",
                      borderRadius: 2,
                    }}
                  >
                    {msg.role === "assistant" ? (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {children}
                            </Typography>
                          ),
                          ul: ({ children }) => (
                            <Box component="ul" sx={{ pl: 2, my: 1 }}>
                              {children}
                            </Box>
                          ),
                          li: ({ children }) => (
                            <Typography component="li" variant="body2">
                              {children}
                            </Typography>
                          ),
                          strong: ({ children }) => (
                            <Typography
                              component="span"
                              sx={{ fontWeight: 700 }}
                            >
                              {children}
                            </Typography>
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      <Typography variant="body2">{msg.content}</Typography>
                    )}
                  </Paper>

                  {msg.role === "user" && (
                    <Avatar
                      sx={{
                        bgcolor: "secondary.main",
                        width: 32,
                        height: 32,
                      }}
                    >
                      <PersonIcon fontSize="small" />
                    </Avatar>
                  )}
                </Box>
              ))
            )}

            {loading && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                  <SmartToyIcon fontSize="small" />
                </Avatar>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CircularProgress size={16} />
                  <Typography variant="body2">L'IA réfléchit...</Typography>
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions
          sx={{
            p: 2,
            backgroundColor: "action.hover",
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Posez votre question..."
            disabled={loading}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!message.trim() || loading}
            sx={{
              minWidth: 100,
              borderRadius: 3,
              textTransform: "none",
            }}
            endIcon={<SendIcon />}
          >
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AIChatBot;
