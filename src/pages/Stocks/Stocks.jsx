import React, { useState } from "react";
import Location from "../../components/Location";
import { Button } from "@mui/material";
import * as XLSX from "xlsx";
import Modal from "./Modal";
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
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <div>
        <Location />
      </div>
      <div className="flex justify-end gap-4">
        <Button onClick={handleDownloadExcel} variant="outlined">
          Télécharger Excel
        </Button>
        <Button onClick={() => setModalOpen(true)} variant="outlined">
          Ajouter
        </Button>

        {/* Modal d'ajout */}

        {modalOpen && (
          <div className="fixed justify-center inset-0 items-center bg-black z-50 opacity-75">
            <div className="bg-blue-500 p-4 rounded-md shadow-lg">
              {" "}
              <Modal setModalOpen={setModalOpen} />
            </div>
          </div>
        )}
      </div>
      <div>
        <ItemTable />
      </div>
    </div>
  );
};

export default Stocks;
