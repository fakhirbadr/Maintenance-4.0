import React, { useEffect, useState } from "react";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import {
  CircularProgress,
  Box,
  Typography,
  Button,
  Card,
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Chip,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import PeopleIcon from "@mui/icons-material/People";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const NetworkPatientData = () => {
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [uploadSpeed, setUploadSpeed] = useState(null);
  const [patientsWaiting, setPatientsWaiting] = useState(0);
  const [isTesting, setIsTesting] = useState(false);
  const [actifNames, setActifNames] = useState([]);
  const [selectedActif, setSelectedActif] = useState("");
  const [technicien, setTechnicien] = useState("");
  const [testSpeedNetworks, setTestSpeedNetworks] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [province, setProvince] = useState("");
  const [dynamicActifs, setDynamicActifs] = useState([]);
  const [actifsData, setActifsData] = useState({});
  const [selectedUnite, setSelectedUnite] = useState("");

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };
  useEffect(() => {
    const fetchActifs = async () => {
      const userIds = JSON.parse(localStorage.getItem("userActifs")) || [];
      try {
        const fetchedActifs = await Promise.all(
          userIds.map(async (id) => {
            const response = await fetch(`${apiUrl}/api/actifs/${id}`);
            return response.json();
          })
        );
        setDynamicActifs(fetchedActifs.filter((a) => a)); // Filtre les résultats null
      } catch (error) {
        console.error("Error fetching actifs:", error);
      }
    };

    fetchActifs();
  }, []);

  const handleInputChange = (event, actif) => {
    const { name, value } = event.target;

    // Initialisation sécurisée de l'objet actif
    setActifsData((prevState) => ({
      ...prevState,
      [actif]: {
        ...prevState[actif],
        [name]: value || "", // Valeur par défaut pour éviter les erreurs
      },
    }));
  };

  // Charger les données de localStorage au montage du composant
  useEffect(() => {
    const cachedActifNames =
      JSON.parse(localStorage.getItem("cachedActifNames")) || [];
    setActifNames(cachedActifNames);
  }, []);
  const handleSelectChange = (event) => {
    setSelectedActif(event.target.value); // Utiliser le nom de l'actif
  };

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo); // Parse the stored JSON object
      if (userInfo.province) {
        setProvince(userInfo.province); // Mise à jour de province
      }
      if (userInfo.nomComplet) {
        setTechnicien(userInfo.nomComplet); // Mise à jour du technicien
      }
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/v1/testSpeedNetwork?nomComplet=${technicien}`
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }
      const data = await response.json();
      console.log("Données reçues:", data); // Ajoutez cette ligne pour vérifier les données
      setTestSpeedNetworks(data);
    } catch (error) {
      console.error("Erreur de récupération des données", error);
    }
  };
  useEffect(() => {
    console.log("Technicien:", technicien); // Vérifiez la valeur de technicien
    if (technicien) {
      fetchData();
    }
  }, [technicien]);
  useEffect(() => {
    console.log("testSpeedNetworks mis à jour:", testSpeedNetworks); // Vérifiez la mise à jour des données
  }, [testSpeedNetworks]);

  // Fonction pour comparer deux heures et vérifier si elles sont proches
  const isWithin3Hours = (targetTime, dataTime) => {
    const target = new Date(targetTime);
    const data = new Date(dataTime);
    const diffInHours = Math.abs(target - data) / (1000 * 60 * 60); // Différence en heures
    return diffInHours <= 3;
  };

  const findClosestData = (targetTime) => {
    let closest = null;
    let minDiff = Infinity;

    // Assurer que 'data' est un tableau
    if (!Array.isArray(data)) {
      console.error("Les données ne sont pas sous forme de tableau : ", data);
      return null;
    }

    data.forEach((group) => {
      if (Array.isArray(group)) {
        group.forEach((entry) => {
          // Vérifier si l'élément 'heure' existe dans 'entry'
          if (entry && entry.heure) {
            console.log("Vérification de entry.heure :", entry.heure);

            // Convertir 'entry.heure' en objet Date
            const entryTime = new Date(entry.heure);

            // Vérifier si 'entryTime' est une date valide
            if (isNaN(entryTime.getTime())) {
              console.error("Date invalide pour entry.heure :", entry.heure);
              return; // Si la date est invalide, on saute cette entrée
            }

            // Comparer la différence avec la 'targetTime'
            const diff = Math.abs(entryTime - targetTime);

            // Si la différence est plus petite, on garde cette entrée
            if (diff < minDiff) {
              minDiff = diff;
              closest = entry;
            }
          } else {
            console.error(
              "Aucune valeur pour entry.heure dans cette entrée :",
              entry
            );
          }
        });
      }
    });

    console.log(`Donnée la plus proche pour ${targetTime}:`, closest); // Vérifier la donnée la plus proche
    return closest;
  };

  // Exemple d'appel avec targetTime
  const targetTime = new Date("2025-02-05T10:00:00.000Z");
  const closestData = findClosestData(targetTime);

  const handleSendData = async () => {
    // Validate required fields
    if (!selectedActif || !downloadSpeed || !uploadSpeed) {
      alert("Veuillez sélectionner un actif et effectuer le test de vitesse.");
      return;
    }

    // Obtenir la date actuelle
    const currentDate = new Date();

    // Créer une copie sans le décalage UTC
    const localDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      currentDate.getHours(),
      currentDate.getMinutes(),
      currentDate.getSeconds()
    );

    // Convertir en format ISO sans conversion UTC
    const dateISOString =
      localDate.toISOString().split("T")[0] + "T00:00:00.000Z"; // Fixer l'heure à 00:00 UTC
    const heureISOString = currentDate.toISOString(); // Heure exacte avec fuseau UTC

    // Préparer les données
    const dataToSend = {
      user: selectedActif,
      nomComplet: technicien,
      download: parseFloat(downloadSpeed),
      upload: parseFloat(uploadSpeed),
      date: dateISOString, // Date locale correcte à minuit UTC
      heure: heureISOString, // Heure exacte du test
      testHoraire: selectedTime,
      patientsWaiting: patientsWaiting,
      province: province,
    };

    console.log(dataToSend);

    try {
      // Send POST request
      const response = await fetch(`${apiUrl}/api/v1/testSpeedNetwork`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Données envoyées avec succès:", result);
      alert("Données envoyées avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      alert("Échec de l'envoi des données");
    }
  };

  useEffect(() => {
    if (!technicien) return;

    const fetchData = async () => {
      try {
        const hours = ["10h", "12h", "16h"];
        const promises = hours.map(async (hour) => {
          const response = await fetch(
            `${apiUrl}/api/v1/testSpeedNetwork?nomComplet=${technicien}&testHoraire=${hour}`
          );
          if (!response.ok)
            throw new Error("Erreur lors de la récupération des données");

          return response.json();
        });

        const results = await Promise.all(promises);
        console.log("Données reçues :", results);
        setData(results.flat()); // Fusionner les résultats en un seul tableau
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [technicien]); // Dépend de `technicien`

  const today = new Date();
  const formattedDate = today.toLocaleDateString("fr-FR"); // Formatée en date française

  return (
    <Box p={4} maxHeight="70vh">
      <Typography
        variant="h3"
        textAlign="center"
        color="#9C1B33"
        fontWeight="bold"
        gutterBottom
      >
        Surveillance Réseau & File d'Attente
      </Typography>
      <Grid container spacing={4} justifyContent="center" alignItems="stretch">
        {/* Test Réseau */}
        <Grid item xs={12} md={6} display="flex">
          <Card
            sx={{
              p: 3,
              boxShadow: 3,
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <SpeedRoundedIcon fontSize="large" color="primary" />
              <Typography variant="h5" fontWeight="bold">
                Test Réseau
              </Typography>
            </Box>

            <TextField
              label="Vitesse de téléchargement (Mbps)"
              value={downloadSpeed || ""}
              onChange={(e) => setDownloadSpeed(e.target.value)}
              margin="normal"
              variant="outlined"
              fullWidth
            />

            <TextField
              label="Vitesse d'envoi (Mbps)"
              value={uploadSpeed || ""}
              onChange={(e) => setUploadSpeed(e.target.value)}
              margin="normal"
              variant="outlined"
              fullWidth
            />
          </Card>
        </Grid>

        {/* Patients en Attente */}
        <Grid item xs={12} md={6} display="flex">
          <Card
            sx={{
              p: 3,
              boxShadow: 3,
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="h5" fontWeight="bold" color="whait">
                👥 Patients en Attente
              </Typography>
            </Box>
            <Typography variant="h3" color="#9C1B33" textAlign="center">
              {patientsWaiting}
            </Typography>
            <TextField
              type="number"
              value={patientsWaiting}
              onChange={(e) => setPatientsWaiting(Number(e.target.value))}
              fullWidth
              label="Nombre de patients"
              variant="outlined"
              sx={{ mt: 2 }}
            />
          </Card>
        </Grid>
      </Grid>

      {/* Données Aujourd'hui */}
      <Box mt={6} mx={2}>
        <Card
          sx={{
            p: 4,
            boxShadow: 3,
            borderRadius: 4,
            background: "linear-gradient(145deg, #f8f9fa 0%, #145deg 100%)",
          }}
        >
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent="center"
            alignItems="center"
            mb={3}
            sx={{
              background:
                "linear-gradient(90deg, rgba(103,103,103,1) 0%, rgba(139,139,139,1) 47%, rgba(144,134,114,1) 90%)",
              borderRadius: 3,
              p: 2,
              boxShadow: 1,
            }}
          >
            <Typography
              variant="h4"
              component="div"
              textAlign="center"
              color="#9C1B33"
              fontWeight={800}
              gutterBottom
              sx={{
                textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                mr: { sm: 2 },
                mb: { xs: 1, sm: 0 },
              }}
            >
              Données d'Aujourd'hui
            </Typography>
            <Typography
              variant="h4"
              component="div"
              textAlign="center"
              color="#9C1B33"
              fontWeight={800}
              sx={{
                textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                fontStyle: "italic",
              }}
            >
              {formattedDate}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {data
              .filter((item) => {
                const itemDate = new Date(item.heure);
                const today = new Date();
                return (
                  itemDate.getDate() === today.getDate() &&
                  itemDate.getMonth() === today.getMonth() &&
                  itemDate.getFullYear() === today.getFullYear()
                );
              })
              .map((item, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Box
                    p={2}
                    sx={{
                      background:
                        "linear-gradient(145deg, #e3f2fd 0%, #bbdefb 100%)",
                      borderRadius: 3,
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 4,
                      },
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Box à gauche */}
                    <Box sx={{ flex: 1, mr: 2 }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="#1a237e"
                        sx={{ textTransform: "uppercase" }}
                      >
                        {item.nomComplet}
                      </Typography>
                      <Box mt={1}>
                        <Typography
                          variant="h5"
                          fontWeight="bold"
                          color="#2e7d32"
                        >
                          {item.download.toFixed(2)} Mbps
                          <ArrowDownwardIcon
                            sx={{ ml: 1, fontSize: "1.2rem" }}
                          />
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="#1565c0"
                          sx={{ mt: 0.5 }}
                        >
                          {item.upload?.toFixed(2) || "--.-"} Mbps
                          <ArrowUpwardIcon sx={{ ml: 1, fontSize: "1.2rem" }} />
                        </Typography>
                      </Box>
                    </Box>

                    {/* Box à droite */}
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end"
                      sx={{ flex: 1, ml: 2 }}
                    >
                      <Chip
                        label={item.testHoraire}
                        size="small"
                        sx={{
                          bgcolor: "#ffab40",
                          color: "white",
                          mb: 1,
                          fontSize: "0.75rem",
                        }}
                      />
                      <Typography variant="caption" color="#455a64">
                        {new Date(item.heure).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                      <Box display="flex" alignItems="center" mt={0.5}>
                        <PeopleIcon
                          fontSize="small"
                          sx={{ color: "#607d8b", mr: 0.5 }}
                        />
                        <Typography variant="caption" color="#607d8b">
                          {item.patientsWaiting} en attente
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
          </Grid>

          <Box
            mt={4}
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel sx={{ color: "#ff6b00" }}>
                Choisir un Actif
              </InputLabel>
              <Select
                value={selectedActif} // Utilisez selectedActif (nom de l'actif)
                onChange={handleSelectChange}
                label="Choisir un Actif"
                sx={{
                  "& .MuiSelect-select": { py: 1.5 },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ff6b00",
                  },
                }}
              >
                {dynamicActifs.map((actif) => (
                  <MenuItem key={actif._id} value={actif.name}>
                    {" "}
                    {/* Utilisez le nom ici */}
                    {actif.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel sx={{ color: "#ff6b00" }}>Choisir l'heure</InputLabel>
              <Select
                value={selectedTime}
                onChange={handleTimeChange}
                label="Choisir l'heure"
                sx={{
                  "& .MuiSelect-select": { py: 1.5 },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ff6b00",
                  },
                }}
              >
                {["10h", "12h", "16h"].map((time) => (
                  <MenuItem key={time} value={time} sx={{ py: 1 }}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              onClick={handleSendData}
              variant="contained"
              sx={{
                background: "linear-gradient(45deg, #ff6b00 30%, #ffa500 90%)",
                color: "white",
                height: 40,
                px: 4,
                fontWeight: "bold",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #ff6b00dd 30%, #ffa500dd 90%)",
                },
              }}
            >
              ENVOYER
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default NetworkPatientData;
