import React, { useState } from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import OpenHomePage from "./OpenHomePage";
import LoginPage from "./LoginPage";


export default function HomeLayout() {

  const [theme, setTheme] = useState("light");

  return (
    <div className="main-container" style={{ display: "flex", height: "100vh" }}>
      {/* Main content */}
      <main
        className="main-container"
        style={{
          flex: 1,
          padding: "2px",
          transition: "margin-left 0.3s",
          overflow: "auto",
          background: theme === "dark"
            ? "linear-gradient(90deg, #1d2023 0%, #1d2023 40%, #334941 100%)"
            : "linear-gradient(90deg, #f5f9fd 0%, #f2f7fe 40%,  #8cf2b3ff 350%)",
          scrollbarWidth: "thin",
          scrollbarColor: theme === "dark" ? "rgba(13,246,192,0.5) rgba(0,0,0,0.3)" : "white rgba(0,0,0,0.3)",
        }}
      >
        <Routes>
          <Route path="/" element={<OpenHomePage theme={theme} setTheme={setTheme} />} />
          <Route path="/LoginPage" element={<LoginPage />} />
        </Routes>

      </main>
    </div>
  );
}