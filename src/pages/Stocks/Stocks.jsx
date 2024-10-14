import React, { useState } from "react";
import Location from "../../components/Location";
import { Button, Modal } from "@mui/material";
import * as XLSX from "xlsx";
import Modall from "./Modal";
import ItemTable from "./ItemTable";
import { rows } from "./Data";

const Stocks = () => {
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Collaborateurs");
    XLSX.writeFile(workbook, "stocks.xlsx");
  };

  const [openModel, setOpenModal] = useState(false);
  const handleOpenModel = () => setOpenModal(true);
  const handleCloseModel = () => setOpenModal(false);

  return (
    <div>
      <div>
        <Location />
      </div>
      <div className="flex justify-end gap-4">
        <Button onClick={handleDownloadExcel} variant="outlined">
          Télécharger Excel
        </Button>
        <Button onClick={handleOpenModel} variant="outlined">
          Ajouter
        </Button>

        {/* Modal Trigger */}
        <Modal open={openModel} onClose={handleCloseModel}>
          <div className="flex justify-center items-center h-screen">
            <Modall handleClose={handleCloseModel} />
          </div>
        </Modal>
      </div>
      <div>
        <ItemTable />
      </div>
    </div>
  );
};

export default Stocks;
