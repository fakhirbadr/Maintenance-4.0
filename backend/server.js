import app from "./app.js"; // Si le fichier est app.js

// 3) LANCEMENT DU SERVEUR
const port = 4000;
app.listen(port, () => {
  console.log(`L'application fonctionne sur le port ${port}...`);
});
