import React, { useState } from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import OpenHomePage from "./OpenHomePage";
import LoginPage from "./LoginPage";


export default function HomeLayout() {

  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
  const current = document.documentElement.getAttribute("data-theme");
  document.documentElement.setAttribute(
    "data-theme",
    current === "dark" ? "light" : "dark"
  );
};


  return (
    <div style={{ display: "flex", height: "100vh" }} data-theme={theme}>
      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: "20px",
          transition: "margin-left 0.3s",
          overflow: "auto",
          background: theme === "dark"
            ? "#0f172a"              
            : "linear-gradient(90deg, #f5f9fd 0%, #f2f7fe 40%,  #8cf2b3ff 350%)",
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