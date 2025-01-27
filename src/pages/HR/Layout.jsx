import React from "react";
import TopBar from "./TopBar";

const Layout = ({ children }) => {
  return (
    <>
      <TopBar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
