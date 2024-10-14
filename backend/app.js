import express from "express";
import morgan from "morgan";
import uniteRouter from "./routes/uniteRoutes.js";
import usersRouter from "./routes/usersRoutes.js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// 1) MIDDLEWARE
app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`Heure de la requête : ${req.requestTime}`);
  next();
});

// Configuration OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 2) ROUTES
app.use("/api/v1/unite", uniteRouter);
app.use("/api/v1/users", usersRouter);

// Route pour le chatbot
app.post("/api/v1/chatbot", async (req, res) => {
  try {
    const { message } = req.body;

    // Envoie la requête à OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      max_tokens: 150,
      temperature: 0.5,
    });

    app.get("/api/v1/test", async (req, res) => {
      try {
        const response = await openai.createCompletion({
          model: "gpt-3.5-turbo",
          prompt: "Bonjour, comment puis-je vous aider aujourd'hui ?",
          max_tokens: 50,
          temperature: 0.5,
        });

        res.status(200).json({
          message: response.data.choices[0].text.trim(),
        });
      } catch (error) {
        console.error("Erreur avec l'API OpenAI", error);
        res.status(500).json({
          error: "Il y a eu un problème avec le test de l'API.",
        });
      }
    });

    // Envoie la réponse de l'API au frontend
    res.status(200).json({
      response: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Erreur avec l'API OpenAI", error);
    res.status(500).json({
      error: "Il y a eu un problème avec le chatbot.",
    });
  }
});

export default app;
