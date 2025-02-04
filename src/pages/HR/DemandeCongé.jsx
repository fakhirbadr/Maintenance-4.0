import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Button, Grid } from "@mui/material";
import { SendIcon } from "lucide-react";
import DemandeCongeDialog from "./FormCongé"; // Importer le composant Dialog
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

const cards = [
  {
    id: 2,
    title: "Jours disponibles",
    total: "",
  },
  {
    id: 3,
    title: "Jours pris",
    total: "0.0",
  },
];

const DemandeCongé = () => {
  const [selectedCard, setSelectedCard] = React.useState(0);
  const [dialogOpen, setDialogOpen] = React.useState(false); // État pour le Dialog
  const [role, setRole] = useState("");
  const [nomComplet, setNomComplet] = useState("");
  const [province, setProvince] = useState("");
  const [soldeConges, setSoldeConges] = useState(0);
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joursPris, setJoursPris] = useState(0);
  const [names, setNames] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const handleDialogOpen = () => setDialogOpen(true); // Ouvrir le Dialog
  const handleDialogClose = () => setDialogOpen(false); // Fermer le Dialog

  useEffect(() => {
    // Récupérer userInfo depuis localStorage
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo); // Convertir en objet
        setRole(parsedUserInfo.role || "");
        setNomComplet(parsedUserInfo.nomComplet || "");
        setSoldeConges(parsedUserInfo.soldeConges || 0);
        setProvince(parsedUserInfo.province || "");

        console.log(nomComplet);
        console.log(province);
        console.log(soldeConges);
        console.log(role); // Récupérer le rôle ou une valeur par défaut
      } catch (error) {
        console.error("Erreur lors de l'analyse de userInfo :", error);
      }
    }
  }, []);

  useEffect(() => {
    const userIds = JSON.parse(localStorage.getItem("userActifs"));
    if (userIds && Array.isArray(userIds)) {
      const fetchedNames = [];
      userIds.forEach(async (id) => {
        try {
          const response = await fetch(`${apiUrl}/api/actifs/${id}`);
          if (response.ok) {
            const data = await response.json();
            fetchedNames.push(data); // Ajoutez l'objet complet ici
            if (fetchedNames.length === userIds.length) {
              setNames(fetchedNames); // Mettez à jour avec les objets complets
              if (fetchedNames.length > 0) {
                setSelectedName(fetchedNames[0].name); // Utilisez le premier nom
              }
            }
            console.log(setSelectedName);
            console.log(selectedName);
          } else {
            console.error(`Erreur pour l'ID ${id}: ${response.statusText}`);
          }
        } catch (error) {
          console.error(
            `Erreur lors de la récupération des données pour l'ID ${id}:`,
            error
          );
        }
      });
    }
  }, []);

  useEffect(() => {
    const fetchAbsences = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/v1/absences?nomComplet=${nomComplet}`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        const data = await response.json();

        // Calcul du total des jours
        const totalJours = data.reduce((total, absence) => {
          const joursParAbsence = absence.historique.reduce(
            (subTotal, entry) => subTotal + entry.nombreJours,
            0
          );
          return total + joursParAbsence;
        }, 0);

        setAbsences(data);
        setJoursPris(totalJours); // Mettre à jour le total dans le state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        console.log(joursPris);
      }
    };

    fetchAbsences();
  }, [nomComplet]); // Dépendance sur `nomComplet`

  return (
    <div className="bg-[#d1dffa] w-full h-full">
      <Layout />
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
              gap: 2,
              padding: 15,
            }}
          >
            {cards.map((card, index) => (
              <Card key={card.id}>
                <CardActionArea
                  onClick={() => setSelectedCard(index)}
                  data-active={selectedCard === index ? "" : undefined}
                  sx={{
                    height: "100%",
                    "&[data-active]": {
                      backgroundColor: "action.selected",
                      "&:hover": {
                        backgroundColor: "action.selectedHover",
                      },
                    },
                  }}
                >
                  <CardContent
                    className="bg-[#d1e6fa] flex justify-center items-center flex-col"
                    sx={{ height: "100%" }}
                  >
                    <Typography
                      className=" uppercase"
                      variant="h5"
                      component="div"
                    >
                      {card.title}
                    </Typography>
                    <Typography variant="h3" color="text.secondary">
                      {card.title === "Jours disponibles"
                        ? soldeConges
                        : card.total}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Grid>
        <Grid item xs={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateCalendar"]}>
              <DateCalendar defaultValue={dayjs()} readOnly />
            </DemoContainer>
          </LocalizationProvider>
        </Grid>
      </Grid>
      <div className="flex justify-center pt-6 ">
        <Button
          sx={{
            backgroundColor: "#5fa6ec",
            width: "35%",
            color: "black",
            ":hover": {
              backgroundColor: "#8dbff2",
              color: "black",
              width: "35%",
            },
          }}
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleDialogOpen} // Ouvrir le Dialog au clic
        >
          nouvelle demande d'absence
        </Button>
      </div>

      {/* Inclure le composant Dialog */}
      <DemandeCongeDialog
        open={dialogOpen}
        nomComplet={nomComplet}
        role={role}
        onClose={handleDialogClose}
        province={province}
        selectedName={selectedName}
      />
    </div>
  );
};

export default DemandeCongé;
