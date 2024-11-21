import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE.PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connexion a MDB réussie (TICKETS) "))
  .catch((err) => console.log("Erreur de connexion (TICKETS)", err));

const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`L'application fonctionne sur le port ${port}...`);
});

// 
