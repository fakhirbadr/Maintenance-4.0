import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { useNavigate } from "react-router-dom"; // Importer le hook useNavigate

export default function CardFormations({ image, title, description, path }) {
  const navigate = useNavigate(); // Initialiser le hook useNavigate

  const handleClick = () => {
    if (path) {
      navigate(path); // Rediriger vers la page spécifiée
    }
  };

  return (
    <Card sx={{ maxWidth: 345 }} onClick={handleClick}>
      <CardActionArea>
        <CardMedia
          component="img"
          // Taille uniforme pour toutes les images
          sx={{ height: 200, width: "100%" }}
          image={image}
          alt={title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
