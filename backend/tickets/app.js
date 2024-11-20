import express from "express";
import morgan from "morgan";
import cors from "cors";
import ticketRouter from "./src/routes/ticketsRoutes.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:8080" }));

app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`heure de la requête : ${req.requestTime}`);
  next();
});

app.use("/api/v1/tickets", ticketRouter);

export default app;
