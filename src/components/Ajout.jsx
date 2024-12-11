import { Button } from "@mui/material";
import React from "react";

const Ajout = ({ text, variant = "outlined", onClick }) => {
  return (
    <Button variant={variant} onClick={onClick}>
      {text}
    </Button>
  );
};

export default Ajout;
