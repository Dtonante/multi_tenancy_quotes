import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar.js";

const CompHome = () => {
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const toggleSidebar = () => setSidebarAbierto(!sidebarAbierto);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar isOpen={sidebarAbierto} toggleSidebar={toggleSidebar} />
      <div
        style={{
          marginLeft: sidebarAbierto ? "200px" : "-5px",
          transition: "margin-left 0.3s",
          padding: "20px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", textAlign: "center" }}>
          Bienvenido a la Barber
        </h1>
      </div>
    </div>
  );
};

export default CompHome;
