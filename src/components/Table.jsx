import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import MUIDataTable from "mui-datatables";

const ReusableTable = ({ title, data, columns, options, theme }) => {
  return (
    <ThemeProvider theme={theme}>
      <MUIDataTable
        title={title}
        data={data}
        columns={columns}
        options={options}
      />
    </ThemeProvider>
  );
};

export default ReusableTable;
