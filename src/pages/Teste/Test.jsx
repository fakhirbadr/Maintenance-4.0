import { Button } from "@mui/material";
import React, { useState } from "react";
import Model from "./model";

const Test = () => {
  const [open, setOpen] = useState(false);

  const handleOpenModelAjout = () => {
    setOpen(true);
    console.log("open model");
  };
  const hundleCloseModelAjout = () => {
    setOpen(false);
    console.log("close model");
  };

  return (
    <div className="flex flex-col">
      <Button onClick={handleOpenModelAjout}>ajout</Button>
      <Button onClick={hundleCloseModelAjout}>close</Button>
      {open && (
        <div>
          <Model open = {open} onClose={hundleCloseModelAjout}  />
        </div>
      )}
    </div>
  );
};

export default Test;
