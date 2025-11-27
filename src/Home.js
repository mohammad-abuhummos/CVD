import React, { useState } from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import OpenHomePage from "./OpenHomePage";
import LoginPage from "./LoginPage";


export default function HomeLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const linkStyle = (isActive) => ({
    color: isActive ? "white" : "#555",
    marginBottom: "10px",
    textDecoration: "none",
    background: isActive ? "linear-gradient(90deg, limegreen 50%, green 100%)" : "transparent",
    padding: "10px 10px",
    borderRadius: "10px",
    display: "block",
    fontWeight: "bold",
    transition: "background 0.3s, color 0.3s",
  });

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: "20px",
          transition: "margin-left 0.3s",
          overflow: "auto",
          background: 'linear-gradient(90deg, #f5f9fd 0%, #f2f7fe 40%,  #8cf2b3ff 350%)',
        }}
      >
        <Routes>
          <Route path="/" element={<OpenHomePage />} />
          <Route path="/" element={<LoginPage />} />
        </Routes>

      </main>
    </div>
  );
}